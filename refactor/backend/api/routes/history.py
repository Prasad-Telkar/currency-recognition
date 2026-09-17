from flask import Blueprint, request, jsonify
from services.history_service import get_history, insert_history, delete_history_entry, clear_all_history

history_bp = Blueprint("history", __name__)

@history_bp.route("/history", methods=["GET"])
def fetch_history():
    query = request.args.get("query", "")
    sort_by = request.args.get("sortBy", "newest")
    
    try:
        entries = get_history(query=query, sort_by=sort_by)
        return jsonify({"success": True, "history": entries}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@history_bp.route("/history", methods=["POST"])
def add_history():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
        
    try:
        new_entry = insert_history(data)
        return jsonify({"success": True, "entry": new_entry}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@history_bp.route("/history/<int:entry_id>", methods=["DELETE"])
def remove_history(entry_id):
    try:
        deleted = delete_history_entry(entry_id)
        if deleted:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@history_bp.route("/history", methods=["DELETE"])
def clear_history():
    try:
        clear_all_history()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
