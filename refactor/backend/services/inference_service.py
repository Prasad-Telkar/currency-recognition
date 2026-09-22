"""
Currency recognition inference with Google Gemini API.
"""

import os
import json
import logging
from io import BytesIO

from google import genai
from google.genai import types
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)



class CurrencyPrediction(BaseModel):
    is_currency: bool = Field(description="True if the image contains a recognizable banknote or coin, false otherwise.")
    currency_name: str = Field(description="The name of the currency (e.g. 'US Dollar', 'Indian Rupee', 'Euro')")
    currency_code: str = Field(description="The 3-letter ISO currency code (e.g. 'USD', 'INR', 'EUR')")
    symbol: str = Field(description="The currency symbol (e.g. '$', '₹', '€')")
    denomination: str = Field(description="The denomination value as a string (e.g. '500', '20'). Return '0' or empty if not sufficiently visible.")
    confidence: float = Field(description="The confidence score out of 100")
    country: str = Field(description="The country or region of the currency (e.g. 'USA', 'India', 'Euro')")
    explanation: str = Field(description="Briefly explain the visual evidence used, or why recognition was unsuccessful.")

# Local Fallback Model Integration
import numpy as np

_fallback_model = None
_class_names = []

def load_fallback_model():
    global _fallback_model, _class_names
    if _fallback_model is not None:
        return True
        
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'fallback_model.keras')
    class_names_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'class_names.json')
    
    if not os.path.exists(model_path) or not os.path.exists(class_names_path):
        return False
        
    try:
        import tensorflow as tf # type: ignore
        _fallback_model = tf.keras.models.load_model(model_path)
        with open(class_names_path, 'r') as f:
            _class_names = json.load(f)
        logger.info("Successfully loaded offline fallback model.")
        return True
    except Exception as e:
        logger.error(f"Failed to load fallback model: {e}")
        return False

def local_fallback_predict(pil_img):
    if not load_fallback_model():
        return None
        
    try:
        import tensorflow as tf # type: ignore
        # Resize image to match model input
        img_resized = pil_img.resize((224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
        img_array = tf.expand_dims(img_array, 0)
        
        predictions = _fallback_model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        confidence = 100 * np.max(score)
        
        predicted_class = _class_names[np.argmax(score)]
        
        return {
            "is_currency": True,
            "currency_name": f"{predicted_class} (Offline Fallback)",
            "currency_code": predicted_class,
            "symbol": "",
            "denomination": "Unknown",
            "confidence": float(confidence),
            "country": "Unknown",
            "explanation": "Predicted using offline fallback model due to Gemini API failure."
        }
    except Exception as e:
        logger.error(f"Fallback inference failed: {e}")
        return None

def predict_currency(image_input):
    """
    Accepts raw image bytes, processes the image,
    and returns a standardized prediction dictionary via Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("CurrencyAI service is unconfigured (Missing API Key).")
    
    try:
        gemini_client = genai.Client(api_key=api_key)
    except Exception as e:
        raise Exception(f"Failed to initialize AI client: {e}")
    
    pil_img = None
    if isinstance(image_input, (bytes, bytearray)):
        try:
            from PIL import Image
            pil_img = Image.open(BytesIO(image_input))
        except Exception:
            raise Exception("Invalid image format.")
    elif isinstance(image_input, str) and os.path.exists(image_input):
        try:
            from PIL import Image
            pil_img = Image.open(image_input)
        except Exception:
            raise Exception("Invalid image path.")

    if not pil_img:
        raise Exception("Could not process the uploaded image.")

    try:
        # Resize image to a maximum dimension of 1024 to dramatically speed up upload and prevent timeouts
        pil_img.thumbnail((1024, 1024))
        
        print("Using Gemini API for currency prediction...")
        
        prompt = (
            "You are the currency recognition engine for CurrencyAI.\n"
            "Analyze the provided image carefully.\n"
            "Determine whether the image contains a recognizable banknote or coin.\n\n"
            "If it is a currency:\n"
            "- identify the country/region\n"
            "- identify the currency\n"
            "- identify the ISO currency code\n"
            "- identify the denomination when visible\n"
            "- provide the currency symbol when applicable\n"
            "- provide a confidence estimate\n"
            "- briefly explain the visual evidence used\n\n"
            "If the image is not a currency or the currency cannot be reliably identified:\n"
            "- set is_currency to false\n"
            "- do not invent a currency or denomination\n"
            "- explain why recognition was unsuccessful\n\n"
            "Never guess a denomination when it is not sufficiently visible.\n"
            "Return ONLY the required structured response."
        )
        
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        
        import time
        max_retries = 3
        retry_delay = 2
        
        response = None
        last_error = None
        
        for attempt in range(max_retries):
            try:
                response = gemini_client.models.generate_content(
                    model=model_name,
                    contents=[pil_img, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=CurrencyPrediction,
                        temperature=0.1
                    ),
                )
                break
            except Exception as e:
                last_error = e
                error_msg = str(e).upper()
                if "503" in error_msg or "429" in error_msg or "UNAVAILABLE" in error_msg or "QUOTA" in error_msg:
                    if attempt < max_retries - 1:
                        logger.warning(f"Gemini API busy (Attempt {attempt + 1}/{max_retries}). Retrying in {retry_delay}s...")
                        time.sleep(retry_delay)
                        retry_delay *= 2
                    else:
                        logger.error("Gemini API is unreachable. Falling back to local model.")
                        fallback_result = local_fallback_predict(pil_img)
                        if fallback_result:
                            return fallback_result
                        raise Exception("The AI service is currently experiencing high demand. Local fallback model is not trained yet. Please try again later.")
                else:
                    logger.error(f"Gemini API Error: {error_msg}. Falling back to local model.")
                    fallback_result = local_fallback_predict(pil_img)
                    if fallback_result:
                        return fallback_result
                    raise e
                    
        if not response:
            raise Exception("Failed to get a response from Gemini.")
        
        try:
            print("Gemini Inference response raw text:", response.text.encode('utf-8', 'ignore').decode('utf-8'))
        except:
            pass
        
        try:
            if hasattr(response, 'parsed') and response.parsed:
                if isinstance(response.parsed, BaseModel):
                    result_dict = response.parsed.model_dump(by_alias=True)
                else:
                    result_dict = response.parsed
            else:
                result_dict = json.loads(response.text)
            
            return result_dict
            
        except Exception as parse_e:
            print("Failed to parse Gemini response:", parse_e)
            print("Raw response text:", response.text)
            raise Exception("Failed to parse recognition results.")
            
    except Exception as e:
        logger.error("Gemini API inference failed: %s", str(e).encode('utf-8', 'ignore').decode('utf-8'))
        raise Exception(f"Recognition failed: {str(e).encode('utf-8', 'ignore').decode('utf-8')}")
