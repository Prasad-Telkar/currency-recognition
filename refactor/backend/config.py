import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    ENV = os.environ.get("FLASK_ENV", "development")
    DEBUG = ENV == "development"
    _default_origins = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5174,http://127.0.0.1:5174,"
        "http://localhost:3000,http://127.0.0.1:3000"
    )
    ALLOWED_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",")
        if origin.strip()
    ]
    MAX_CONTENT_LENGTH = 8 * 1024 * 1024  # 8MB, matches image_validation.py
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")
    MODEL_VERSION = os.environ.get("MODEL_VERSION", GEMINI_MODEL)
