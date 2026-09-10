from flask import Flask
from flask_cors import CORS

from config import Config
from api.routes.predict import predict_bp
from api.routes.currencies import currencies_bp
from api.routes.history import history_bp
from api.routes.news import news_bp
from services.ai_service import ai_bp
from services.counterfeit_service import counterfeit_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend development
    CORS(app, origins=Config.ALLOWED_ORIGINS, supports_credentials=True)

    # Routes without prefix (matches frontend services/api.js)
    app.register_blueprint(predict_bp)
    app.register_blueprint(currencies_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(counterfeit_bp)

    # Routes with /api prefix for API client flexibility
    api_predict = predict_bp
    app.register_blueprint(api_predict, name="predict_api", url_prefix="/api")
    app.register_blueprint(currencies_bp, name="currencies_api", url_prefix="/api")
    app.register_blueprint(history_bp, name="history_api", url_prefix="/api")
    app.register_blueprint(news_bp, name="news_api", url_prefix="/api")
    app.register_blueprint(ai_bp, name="ai_api", url_prefix="/api/ai")
    app.register_blueprint(counterfeit_bp, name="counterfeit_api", url_prefix="/api/counterfeit")

    @app.route("/health")
    @app.route("/api/health")
    def health():
        from services.inference_service import model
        model_status = "keras-model" if model is not None else Config.MODEL_VERSION
        return {
            "status": "ok",
            "model_version": model_status,
        }

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)