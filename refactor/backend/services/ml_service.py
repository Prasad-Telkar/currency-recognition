"""
ML Service bridging between external scripts/routes and inference_service.
"""

from services.inference_service import predict_currency as _predict_currency, load_model_if_needed


def predict_currency(image_path_or_bytes):
    result = _predict_currency(image_path_or_bytes)
    return {
        "class": result.get("class", f"{result['country']}_{result['denomination']}"),
        "confidence": result.get("confidence", 0.0),
        "country": result.get("country"),
        "denomination": result.get("denomination"),
        "currency_code": result.get("currency_code"),
        "currency_symbol": result.get("currency_symbol"),
    }