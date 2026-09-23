import time
import logging

from flask import Blueprint, request, jsonify

from services.quality_service import analyze_quality
from services.inference_service import predict_currency
from services.counterfeit_service import run_gemini_counterfeit_analysis, fallback_counterfeit_analysis
from schemas.prediction_schema import build_prediction_response, build_error_response
from utils.image_validation import validate_image_file, ImageValidationError

logger = logging.getLogger(__name__)

predict_bp = Blueprint("predict", __name__)

# Below this quality score, we refuse to predict rather than return a
# confident-looking answer for an image the pipeline can't trust.
MIN_QUALITY_SCORE = 40


@predict_bp.route("/predict", methods=["POST"])
def predict():
    start = time.time()

    try:
        image_bytes = validate_image_file(request.files.get("image"))
    except ImageValidationError as e:
        return jsonify(build_error_response(e.code, e.message)), 400

    quality = analyze_quality(image_bytes)
    if quality is None:
        return jsonify(build_error_response(
            "UNREADABLE_IMAGE", "Could not read the uploaded image."
        )), 400

    if quality["quality_score"] < MIN_QUALITY_SCORE:
        return jsonify(build_error_response(
            "LOW_QUALITY_IMAGE",
            "The image quality is too low to analyze reliably. Try better lighting or a steadier shot.",
            {
                "quality_score": quality["quality_score"],
                "blur_detected": quality["blur_detected"],
            },
        )), 422

    # Pre-process image once to avoid redundant decoding and resizing
    try:
        from PIL import Image, ImageFile
        from io import BytesIO
        ImageFile.LOAD_TRUNCATED_IMAGES = True
        pil_img = Image.open(BytesIO(image_bytes))
        pil_img.load()
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
        if max(pil_img.size) > 1024:
            pil_img.thumbnail((1024, 1024))
    except Exception:
        pil_img = image_bytes

    # Run recognition and counterfeit analysis concurrently in parallel
    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        pred_future = executor.submit(predict_currency, pil_img)
        cf_future = executor.submit(run_gemini_counterfeit_analysis, pil_img, None)

        try:
            prediction = pred_future.result(timeout=25)
        except Exception as e:
            logger.error("Predict exception: %s", e)
            prediction = {
                "is_currency": True,
                "country": "Unknown",
                "denomination": "",
                "currency_name": "Banknote",
                "confidence": 50.0,
                "explanation": f"Automated recognition encountered an issue: {str(e)}"
            }

        try:
            counterfeit_analysis = cf_future.result(timeout=25)
        except Exception as e:
            logger.warning("Gemini counterfeit check failed, falling back: %s", e)
            counterfeit_analysis = fallback_counterfeit_analysis(image_bytes, error_msg=str(e))

        # If recognition marked not currency, check if counterfeit forensic check detected a banknote/counterfeit
        if not prediction.get("is_currency", True):
            is_counterfeit_or_banknote = counterfeit_analysis and (
                counterfeit_analysis.get("verdict") in ["LIKELY_COUNTERFEIT", "SUSPICIOUS"] or
                counterfeit_analysis.get("counterfeit_risk") in ["HIGH", "MEDIUM"] or
                counterfeit_analysis.get("authenticity_score", 100) < 85 or
                (counterfeit_analysis.get("anomalies") and len(counterfeit_analysis.get("anomalies")) > 0)
            )

            if is_counterfeit_or_banknote:
                # Retain prediction as a counterfeit currency note so the Fake Note UI can display it
                prediction["is_currency"] = True
                prediction["country"] = prediction.get("country") or "Banknote"
                prediction["currency_name"] = prediction.get("currency_name") or "Counterfeit Note"
                prediction["denomination"] = prediction.get("denomination") or "Note"
                prediction["confidence"] = prediction.get("confidence") or 60.0
            else:
                explanation = prediction.get("explanation", "We couldn't confidently identify this currency. Try taking a clearer photo with the entire note visible.")
                return jsonify(build_error_response("NOT_CURRENCY", explanation)), 400

    processing_time_ms = round((time.time() - start) * 1000)

    response = build_prediction_response(
        prediction,
        {
            "quality_score": quality["quality_score"],
            "blur_detected": quality["blur_detected"],
            "lighting_quality": quality["lighting_quality"],
        },
        processing_time_ms,
        counterfeit_analysis=counterfeit_analysis,
    )
    return jsonify(response), 200
