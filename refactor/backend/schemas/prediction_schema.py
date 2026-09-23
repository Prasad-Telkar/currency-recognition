"""Builds the rich API response AND embeds a `legacy` block that matches
the original { label, confidence } shape — this is what lets the existing
frontend (or any client not yet updated) keep working unmodified while new
clients read `prediction.*` directly. See services/api.js on the frontend
for the corresponding normalizePrediction() that reads either shape.
"""


def confidence_level(confidence):
    if confidence >= 95:
        return "Very High"
    if confidence >= 80:
        return "High"
    if confidence >= 60:
        return "Moderate"
    return "Low"


def build_prediction_response(prediction, image_analysis, processing_time_ms, model_version="v1.0-mock", counterfeit_analysis=None):
    level = confidence_level(prediction["confidence"])
    legacy_label = f"{prediction.get('country', 'unknown')}_{prediction.get('denomination', '0')}"

    response = {
        "success": True,
        "prediction": {**prediction, "confidence_level": level},
        "image_analysis": image_analysis,
        "metadata": {
            "processing_time_ms": processing_time_ms,
            "model_version": model_version,
        },
        # Backward-compat shim — old frontend code that does
        # `data.label.split("_")` and reads `data.confidence` keeps working.
        "legacy": {
            "label": legacy_label,
            "confidence": prediction["confidence"],
        },
    }
    if counterfeit_analysis is not None:
        response["counterfeit_analysis"] = counterfeit_analysis
    return response


def build_error_response(code, message, details=None):
    error = {"code": code, "message": message}
    if details:
        error["details"] = details
    return {"success": False, "error": error}
