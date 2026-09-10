import time

from flask import Blueprint, request, jsonify

from services.quality_service import analyze_quality
from services.inference_service import predict_currency
from schemas.prediction_schema import build_prediction_response, build_error_response
from utils.image_validation import validate_image_file, ImageValidationError

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

    prediction = predict_currency(image_bytes)
    processing_time_ms = round((time.time() - start) * 1000)

    response = build_prediction_response(
        prediction,
        {
            "quality_score": quality["quality_score"],
            "blur_detected": quality["blur_detected"],
            "lighting_quality": quality["lighting_quality"],
        },
        processing_time_ms,
    )
    return jsonify(response), 200
