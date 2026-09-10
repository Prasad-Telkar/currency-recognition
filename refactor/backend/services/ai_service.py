import os
from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types

ai_bp = Blueprint('ai', __name__)

# Initialize client using environment variable GEMINI_API_KEY
# If GEMINI_API_KEY is not set, this will fail when the endpoint is hit,
# so we handle it gracefully.
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Failed to initialize Gemini Client: {e}")

@ai_bp.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({'error': 'Gemini API client is not configured. Please set GEMINI_API_KEY in .env'}), 500
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    question = data.get('question')
    context = data.get('context', 'No context provided')
    
    if not question:
        return jsonify({'error': 'question is required'}), 400

    system_instruction = f"""
    You are a helpful travel and financial assistant inside the CurrencyAI application.
    Keep your answers concise and directly answer the user's question.
    Current Context: {context}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=question,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            )
        )
        return jsonify({'answer': response.text}), 200
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({'error': str(e)}), 500
