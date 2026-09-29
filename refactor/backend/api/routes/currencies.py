from flask import Blueprint, jsonify

from data.currencies import CURRENCIES_BY_COUNTRY

currencies_bp = Blueprint("currencies", __name__)


@currencies_bp.route("/currencies", methods=["GET"])
def list_currencies():
    return jsonify({"success": True, "currencies": CURRENCIES_BY_COUNTRY})


@currencies_bp.route("/currencies/<code>", methods=["GET"])
def get_currency(code):
    code = code.upper()
    for country, info in CURRENCIES_BY_COUNTRY.items():
        if info["code"] == code:
            return jsonify({"success": True, "country": country, **info})
    return jsonify({
        "success": False,
        "error": {"code": "NOT_FOUND", "message": f"No currency with code {code}"},
    }), 404
