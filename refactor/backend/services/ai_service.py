import os
from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types

ai_bp = Blueprint('ai', __name__)

client = None


def get_ai_client():
    global client
    if client is not None:
        return client

    from dotenv import load_dotenv
    load_dotenv(override=True)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
        return None


@ai_bp.route('/chat', methods=['POST'])
def chat():
    ai_client = get_ai_client()
    if not ai_client:
        return jsonify({'error': 'Gemini API client is not configured. Please set GEMINI_API_KEY in .env'}), 500
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
        
    question = data.get('question')
    context = data.get('context', 'No context provided')
    
    if not question:
        return jsonify({'error': 'question is required'}), 400

    system_instruction = f"""
    You are the CurrencyAI Assistant, the official AI assistant for the CurrencyAI platform.

    Your primary expertise includes:
    - Currency recognition, banknotes, and currency denominations
    - Countries and currency information
    - Currency conversion and exchange rates
    - Confidence scores from AI recognition
    - International travel currency guidance and travel-related expense estimates
    - CurrencyAI platform features (AI currency scanning, Financial News, Manual Converter, About Us)

    IMPORTANT RULES:
    1. Identity: You are the "CurrencyAI Assistant". Do NOT identify as a generic "Travel Assistant".
    2. Origins: If asked who created CurrencyAI or this website, state clearly that it was developed by the CurrencyAI project team. Direct users to the About Us section for more information. Do NOT claim CurrencyAI was created by Google or any AI provider.
    3. Travel Expenses: You SHOULD answer travel expense questions (e.g., "I am traveling to Japan for 3 days"). When providing travel expense estimates, always include these categories:
       - Accommodation
       - Food
       - Transportation
       - Attractions
       - Miscellaneous
       - Estimated total budget
       Offer budget ranges such as Budget, Mid-range, and Premium.
    4. Accuracy: Clearly distinguish estimated information from live or current information.

    Keep your answers helpful, well-structured, and directly address the user's question.
    Current Context: {context}
    """
    
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
        response = ai_client.models.generate_content(
            model=model_name,
            contents=question,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            ),
        )
        return jsonify({'answer': response.text}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Gemini API Error: {e}")
        return jsonify({'error': str(e)}), 500
