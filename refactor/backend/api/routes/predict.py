import time
import logging

from flask import Blueprint, request, jsonify

from services.quality_service import analyze_quality
from services.inference_service import predict_currency
from schemas.prediction_schema import build_prediction_response, build_error_response
from utils.image_validation import validate_image_file, ImageValidationError

logger = logging.getLogger(__name__)

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/debug/models", methods=["GET"])
def debug_models():
    """
    Debug endpoint to list all available models for the configured API key.
    This helps diagnose 404 NOT_FOUND errors.
    """
    import os
    from google import genai
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY is not set."}), 500
        
    try:
        # Explicitly disable Vertex AI to ensure we hit the Developer API
        client = genai.Client(api_key=api_key, vertexai=False)
        models = []
        for m in client.models.list():
            models.append({
                "name": m.name,
            })
        return jsonify({
            "api_key_prefix": api_key[:10] + "...",
            "available_models": models
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

    try:
        prediction = predict_currency(image_bytes)
    except Exception as e:
        logger.error("Predict exception: %s", e)
        return jsonify(build_error_response("RECOGNITION_ERROR", str(e))), 500

    if not prediction.get("is_currency", True):
        explanation = prediction.get("explanation", "We couldn't confidently identify this currency. Try taking a clearer photo with the entire note visible.")
        prediction["is_currency"] = False
        prediction["explanation"] = explanation
        prediction["country"] = prediction.get("country", "Unknown")
        prediction["currency_code"] = prediction.get("currency_code", "N/A")
        prediction["currency_name"] = prediction.get("currency_name", "Counterfeit / Invalid")
        prediction["denomination"] = prediction.get("denomination", "0")

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
