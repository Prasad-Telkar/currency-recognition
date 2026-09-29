"""
Currency recognition inference with Google Gemini API.
"""

import os
import json
import logging
from io import BytesIO

import base64
from openai import OpenAI
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class CurrencyPrediction(BaseModel):
    is_currency: bool = Field(description="True if the image contains a recognizable banknote or coin, false otherwise.")
    is_fake: bool = Field(default=False, description="True if the currency appears to be counterfeit, a novelty, or a fake note.")
    fake_reason: str = Field(default="", description="If is_fake is true, explain why the note appears to be fake or a novelty.")
    is_legal_tender: bool = Field(default=True, description="True if the note is currently valid legal tender. False if it has been banned, withdrawn, demonetized, or replaced.")
    legal_tender_info: str = Field(default="", description="If is_legal_tender is false, explain when and why it was demonetized/withdrawn, and its current exchange value (if any).")
    currency_name: str = Field(description="The name of the currency (e.g. 'US Dollar', 'Indian Rupee', 'Euro')")
    currency_code: str = Field(description="The 3-letter ISO currency code (e.g. 'USD', 'INR', 'EUR')")
    symbol: str = Field(description="The currency symbol (e.g. '$', '₹', '€')")
    denomination: str = Field(description="The EXACT denomination value printed as a string (e.g. '500', '20'). DO NOT add extra zeros or convert currencies (e.g. if it says 500, return '500', not '500000').")
    confidence: float = Field(description="The confidence score out of 100")
    country: str = Field(description="The country or region of the currency (e.g. 'USA', 'India', 'Euro')")
    explanation: str = Field(description="Briefly explain the visual evidence used, or why recognition was unsuccessful.")
    history: str = Field(default="", description="Detailed, 2-3 paragraph historical background and design analysis of this specific banknote")
    
    # Flattened Purchasing Power to avoid pydantic nested $defs validation errors on some environments
    pp_item_name: str = Field(default="", description="Everyday item used for comparison (e.g. samosas, coffee)")
    pp_past_comparison: str = Field(default="", description="What this bought ~20 years ago")
    pp_present_comparison: str = Field(default="", description="What this buys today")
    pp_summary: str = Field(default="", description="A short 1-2 sentence comparison summary")

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
    except ImportError:
        logger.warning("TensorFlow is not installed. Offline fallback model is disabled (expected on Render).")
        return False
    except Exception as e:
        logger.error(f"Failed to load fallback model: {e}")
        return False

def local_fallback_predict(pil_img):
    if not load_fallback_model() or pil_img is None:
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
        
        denomination_map = {
            "1Hundrednote": "100",
            "2Hundrednote": "200",
            "2Thousandnote": "2000",
            "5Hundrednote": "500",
            "Fiftynote": "50",
            "Tennote": "10",
            "Twentynote": "20"
        }
        
        denomination = denomination_map.get(predicted_class, "Unknown")
        
        return {
            "is_currency": True,
            "currency_name": "Indian Rupee (Offline Fallback)",
            "currency_code": "INR",
            "symbol": "₹",
            "denomination": denomination,
            "confidence": float(confidence),
            "country": "India",
            "explanation": "Predicted using offline fallback model due to API failure."
        }
    except Exception as e:
        logger.error(f"Fallback inference failed: {e}")
        return None


def predict_currency(image_input):
    """
    Accepts raw image bytes, processes the image,
    and returns a standardized prediction dictionary via OpenAI.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("CurrencyAI service is unconfigured (Missing OPENAI_API_KEY).")
    
    openai_client = OpenAI(api_key=api_key)
    
    # Extract raw bytes for base64 encoding
    image_bytes = None
    if isinstance(image_input, (bytes, bytearray)):
        image_bytes = image_input
    elif hasattr(image_input, 'size') and hasattr(image_input, 'mode'):
        # It's a PIL Image
        img_byte_arr = BytesIO()
        image_input.save(img_byte_arr, format='JPEG')
        image_bytes = img_byte_arr.getvalue()
    elif isinstance(image_input, str) and os.path.exists(image_input):
        with open(image_input, "rb") as f:
            image_bytes = f.read()

    if not image_bytes:
        raise Exception("Could not process the uploaded image.")

    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    prompt = (
        "You are the currency recognition and economic analysis engine for CurrencyAI.\n"
        "Analyze the provided image carefully.\n"
        "Determine whether the image contains a banknote, paper bill (genuine, suspect, or counterfeit being checked), or coin.\n"
        "CRITICAL: Even if the note is heavily damaged, torn, taped together, faded, or in extremely poor condition, you MUST still identify it and treat it as a valid currency.\n\n"
        "If it is a banknote or coin (regardless of condition):\n"
        "- set is_currency to true\n"
        "- identify the country/region\n"
        "- identify the currency name\n"
        "- identify the ISO currency code\n"
        "- identify the EXACT denomination value printed on the note (do not add extra zeros or hallucinate large numbers)\n"
        "- provide the currency symbol when applicable\n"
        "- provide a confidence estimate out of 100\n"
        "- if the note appears to be fake, counterfeit, or a novelty toy note (e.g. 'Children Bank of India'), set is_fake to true and provide the reason in fake_reason\n"
        "- determine if the note is still valid legal tender today. If it has been demonetized, withdrawn, banned (e.g., the old Indian 500/1000 notes from 2016, or pre-Euro currencies), or replaced, set is_legal_tender to false and detail the reasons, dates, and current value (if any) in legal_tender_info\n"
        "- WARNING: For Brazilian notes, do NOT convert 'Cruzeiros' to 'Mil Reis' and do NOT multiply the printed denomination by 1000. If the note says '500', output '500'.\n"
        "- briefly explain the visual evidence used\n\n"
        "ECONOMIC & HISTORICAL INSIGHTS (for recognized currency):\n"
        "1. Purchasing Power Comparison ('20 years ago vs today'):\n"
        "   - Set pp_item_name to a culturally well-known, locally relatable everyday item specifically for this country (e.g. samosas / cutting chai for India, brewed coffee / burgers for USA, artisan baguettes for France/Eurozone, street tacos for Mexico, ramen/onigiri for Japan).\n"
        "   - Set pp_past_comparison to roughly how much of this item this denomination could buy ~20 years ago (around 2004-2006).\n"
        "   - Set pp_present_comparison to roughly how much of this item it can buy today.\n"
        "   - Set pp_summary to a short, relatable 1-2 sentence comparison summary.\n"
        "2. History (Fully detailed, 2-3 paragraphs):\n"
        "   - Provide a comprehensive and interesting historical background about this specific banknote / denomination.\n"
        "   - Detail the year of introduction, monuments, portraits, or cultural symbols depicted on the obverse and reverse.\n"
        "   - Explain the significance of these design elements and any major design changes over time.\n\n"
        "If the image is completely unrelated to money (e.g. animals, cars, food, random objects):\n"
        "- set is_currency to false\n"
        "- do not invent a currency or denomination\n"
        "- explain why recognition was unsuccessful\n"
        "- return empty strings for history and pp_ fields\n\n"
        "Never guess a denomination when it is not sufficiently visible.\n"
        "You MUST populate all history and pp_ fields when a currency is identified.\n"
    )

    try:
        print("Using OpenAI API for currency prediction...")
        
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            response_format=CurrencyPrediction,
            temperature=0.1
        )
        
        parsed_response = response.choices[0].message.parsed
        result_dict = parsed_response.model_dump()
        
        # Format purchasing power manually
        result_dict["purchasing_power"] = {
            "item_name": result_dict.pop("pp_item_name", ""),
            "past_comparison": result_dict.pop("pp_past_comparison", ""),
            "present_comparison": result_dict.pop("pp_present_comparison", ""),
            "summary": result_dict.pop("pp_summary", "")
        }
        
        return result_dict
            
    except Exception as e:
        logger.error(f"OpenAI API inference process failed: {e}")
        
        fallback_result = None
        # Try local fallback if PIL image exists (we'd have to decode it back, but let's just attempt it)
        try:
            from PIL import Image
            fallback_img = Image.open(BytesIO(image_bytes))
            fallback_result = local_fallback_predict(fallback_img)
        except Exception:
            pass
            
        if fallback_result:
            return fallback_result
            
        return {
            "is_currency": False,
            "is_fake": False,
            "fake_reason": "",
            "currency_name": "API Error",
            "currency_code": "ERR",
            "symbol": "!",
            "denomination": "0",
            "confidence": 0,
            "country": "Unknown",
            "explanation": f"The OpenAI model experienced an error: {e}",
            "history": "",
            "legal_tender_info": "",
            "is_legal_tender": False,
            "purchasing_power": {
                "item_name": "",
                "past_comparison": "",
                "present_comparison": "",
                "summary": ""
            }
        }
