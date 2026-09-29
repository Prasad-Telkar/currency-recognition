import os
from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    # Initialize client locally to prevent Gunicorn worker fork deadlocks
    try:
        client = genai.Client()
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
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
    
    # 1. Try OpenAI if configured
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            from openai import OpenAI
            openai_client = OpenAI(api_key=openai_key)
            response = openai_client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": question}
                ],
                temperature=0.7
            )
            return jsonify({'answer': response.choices[0].message.content}), 200
        except Exception as e:
            print(f"OpenAI Chat Error: {e}")
            # Fall through to Gemini

    # 2. Try Gemini Cascade
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return jsonify({'error': 'No API keys configured for AI Assistant'}), 500
        
    try:
        client = genai.Client(api_key=gemini_key, vertexai=False)
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
        return jsonify({'error': 'Gemini API client initialization failed'}), 500

    models_to_try = [
        os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
        "gemini-3.5-flash",
        "gemini-3.1-pro-preview",
        "gemini-3.5-flash-lite",
        "gemini-flash-latest"
    ]
    
    seen = set()
    models_to_try = [x for x in models_to_try if not (x in seen or seen.add(x))]
    
    all_errors = []
    
    for current_model in models_to_try:
        try:
            interaction = client.interactions.create(
                model=current_model,
                input=question,
                system_instruction=system_instruction,
            )
            return jsonify({'answer': interaction.output_text}), 200
        except Exception as e:
            error_msg = str(e).upper()
            all_errors.append(f"{current_model}: {e}")
            if "503" in error_msg or "UNAVAILABLE" in error_msg or "404" in error_msg:
                print(f"Chat: {current_model} failed. Trying next...")
                continue
            else:
                print(f"Chat API Error with {current_model}: {error_msg}")
                continue

    return jsonify({'error': 'All AI models are currently overloaded. Please try again later.', 'debug': all_errors}), 503
