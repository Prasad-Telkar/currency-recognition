import time

from flask import Blueprint, request, jsonify

from services.quality_service import analyze_quality
from services.inference_service import predict_currency
from schemas.prediction_schema import build_prediction_response, build_error_response
from utils.image_validation import validate_image_file, ImageValidationError

predict_bp = Blueprint("predict", __name__)



@predict_bp.route("/predict", methods=["POST"])
def predict():
    start = time.time()

    try:
        image_bytes = validate_image_file(request.files.get("image"))
    except ImageValidationError as e:
        return jsonify(build_error_response(e.code, e.message)), 400

    quality = analyze_quality(image_bytes)
    if quality is None:
        quality = {
            "quality_score": 70,
            "blur_detected": False,
            "lighting_quality": "Fair",
        }

    prediction = predict_currency(image_bytes)
    processing_time_ms = round((time.time() - start) * 1000)
    model_version = prediction.get("model_version", "gemini-2.0-flash")

    response = build_prediction_response(
        prediction,
        {
            "quality_score": quality["quality_score"],
            "blur_detected": quality["blur_detected"],
            "lighting_quality": quality["lighting_quality"],
        },
        processing_time_ms,
        model_version=model_version,
    )
    return jsonify(response), 200
