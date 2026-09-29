from flask import Blueprint, request, jsonify
from services.news_service import fetch_financial_news

news_bp = Blueprint("news", __name__)

@news_bp.route("/news", methods=["GET"])
def get_news():
    query = request.args.get("query")
    currency = request.args.get("currency")
    country = request.args.get("country")
    
    # Construct a robust search query based on inputs
    search_terms = []
    if currency:
        search_terms.append(f"{currency} currency")
    if country:
        search_terms.append(f"{country} economy")
        
    if query:
        search_terms.append(query)
        
    if not search_terms:
        # Default fallback
        search_terms = ["currency market OR forex OR exchange rate"]
        
    final_query = " OR ".join(search_terms)
    
    try:
        news_items = fetch_financial_news(final_query)
        return jsonify({"success": True, "news": news_items}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
