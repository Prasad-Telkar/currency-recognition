"""
Compatibility shim for api.predict -> api.routes.predict
"""

from api.routes.predict import predict_bp, predict

__all__ = ["predict_bp", "predict"]