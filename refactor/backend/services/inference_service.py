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

gemini_client = None

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        gemini_client = genai.Client(api_key=api_key)
    else:
        logger.error("GEMINI_API_KEY not found in environment. Recognition will fail.")
except Exception as e:
    logger.error(f"Failed to initialize Gemini Client: {e}")

class CurrencyPrediction(BaseModel):
    is_currency: bool = Field(description="True if the image contains a recognizable banknote or coin, false otherwise.")
    currency_name: str = Field(description="The name of the currency (e.g. 'US Dollar', 'Indian Rupee', 'Euro')")
    currency_code: str = Field(description="The 3-letter ISO currency code (e.g. 'USD', 'INR', 'EUR')")
    symbol: str = Field(description="The currency symbol (e.g. '$', '₹', '€')")
    denomination: str = Field(description="The denomination value as a string (e.g. '500', '20'). Return '0' or empty if not sufficiently visible.")
    confidence: float = Field(description="The confidence score out of 100")
    country: str = Field(description="The country or region of the currency (e.g. 'USA', 'India', 'Euro')")
    explanation: str = Field(description="Briefly explain the visual evidence used, or why recognition was unsuccessful.")

def predict_currency(image_input):
    """
    Accepts raw image bytes, processes the image,
    and returns a standardized prediction dictionary via Gemini.
    """
    global gemini_client
    
    if not gemini_client:
        raise Exception("CurrencyAI service is unconfigured (Missing API Key).")
    
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
        
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        
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
                        raise Exception("The AI service is currently experiencing high demand. Please try again in a few moments.")
                else:
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
