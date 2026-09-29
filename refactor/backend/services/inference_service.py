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
            "explanation": "Predicted using offline fallback model due to Gemini API failure."
        }
    except Exception as e:
        logger.error(f"Fallback inference failed: {e}")
        return None


def predict_currency(image_input):
    """
    Accepts raw image bytes, processes the image,
    and returns a standardized prediction dictionary via OpenAI or Gemini.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if not gemini_key and not openai_key:
        raise Exception("CurrencyAI service is unconfigured (Missing API Keys).")
    
    gemini_client = None
    if gemini_key:
        try:
            gemini_client = genai.Client(api_key=gemini_key, vertexai=False)
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")
            
    openai_client = None
    if openai_key:
        try:
            from openai import OpenAI
            openai_client = OpenAI(api_key=openai_key)
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
    
    image_to_send = None
    encoded_img_for_openai = None
    
    if hasattr(image_input, 'size') and hasattr(image_input, 'mode'):
        pil_img = image_input
        pil_img.thumbnail((1024, 1024))
        image_to_send = pil_img
        
        # Prepare for OpenAI base64
        import base64
        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        encoded_img_for_openai = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
    elif isinstance(image_input, (bytes, bytearray)):
        try:
            from PIL import Image
            pil_img = Image.open(BytesIO(image_input))
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            pil_img.thumbnail((1024, 1024))
            image_to_send = pil_img
            
            # Prepare for OpenAI base64
            import base64
            buffered = BytesIO()
            pil_img.save(buffered, format="JPEG")
            encoded_img_for_openai = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
        except Exception as e:
            logger.warning(f"PIL failed: {e}. Trying OpenCV fallback.")
            try:
                import cv2
                import numpy as np
                import base64
                np_arr = np.frombuffer(image_input, np.uint8)
                cv_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                if cv_img is None:
                    raise Exception("OpenCV could not decode the image.")
                
                h, w = cv_img.shape[:2]
                if max(h, w) > 1024:
                    scale = 1024 / max(h, w)
                    cv_img = cv2.resize(cv_img, (int(w * scale), int(h * scale)))
                    
                success, encoded_img = cv2.imencode('.jpg', cv_img)
                if not success:
                    raise Exception("Failed to encode image to JPEG.")
                
                image_to_send = types.Part.from_bytes(data=encoded_img.tobytes(), mime_type="image/jpeg")
                encoded_img_for_openai = base64.b64encode(encoded_img.tobytes()).decode('utf-8')
                
                from PIL import Image
                pil_img = Image.open(BytesIO(encoded_img.tobytes()))
            except Exception as cv_e:
                raise Exception(f"Invalid image format. (PIL Error: {e}, CV Error: {cv_e})")
    elif isinstance(image_input, str) and os.path.exists(image_input):
        try:
            from PIL import Image
            pil_img = Image.open(image_input)
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            pil_img.thumbnail((1024, 1024))
            image_to_send = pil_img
            
            # Prepare for OpenAI base64
            import base64
            buffered = BytesIO()
            pil_img.save(buffered, format="JPEG")
            encoded_img_for_openai = base64.b64encode(buffered.getvalue()).decode('utf-8')
        except Exception as e:
            raise Exception(f"Invalid image path: {e}")

    if not image_to_send:
        raise Exception("Could not process the uploaded image.")

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
        "Return ONLY the required structured response matching the schema."
    )

    all_errors = {}
    
    # ---------------------------------------------------------
    # 1. Try OpenAI (if configured)
    # ---------------------------------------------------------
    if openai_client and encoded_img_for_openai:
        try:
            logger.info("Attempting OpenAI inference (gpt-4o-mini)...")
            openai_response = openai_client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{encoded_img_for_openai}"
                                }
                            }
                        ]
                    }
                ],
                response_format=CurrencyPrediction,
                temperature=0.1
            )
            
            parsed_data = openai_response.choices[0].message.parsed
            if parsed_data:
                result_dict = parsed_data.model_dump(by_alias=True)
                if "pp_item_name" in result_dict:
                    result_dict["purchasing_power"] = {
                        "item_name": result_dict.pop("pp_item_name", ""),
                        "past_comparison": result_dict.pop("pp_past_comparison", ""),
                        "present_comparison": result_dict.pop("pp_present_comparison", ""),
                        "summary": result_dict.pop("pp_summary", "")
                    }
                return result_dict
                
        except Exception as e:
            logger.error(f"OpenAI API Error: {e}")
            all_errors["openai (gpt-4o-mini)"] = str(e)

    # ---------------------------------------------------------
    # 2. Try Gemini (if configured and OpenAI failed/missing)
    # ---------------------------------------------------------
    if gemini_client:
        models_to_try = [
            os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
            "gemini-3.5-flash",
            "gemini-3.1-pro-preview",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest"
        ]
        
        seen = set()
        models_to_try = [x for x in models_to_try if not (x in seen or seen.add(x))]
        
        response = None
        for current_model in models_to_try:
            try:
                logger.info(f"Attempting Gemini inference ({current_model})...")
                response = gemini_client.models.generate_content(
                    model=current_model,
                    contents=[image_to_send, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=CurrencyPrediction,
                        temperature=0.1
                    ),
                )
                break # Success
            except Exception as e:
                error_msg = str(e).upper()
                all_errors[f"gemini ({current_model})"] = str(e)
                if "503" in error_msg or "UNAVAILABLE" in error_msg:
                    logger.error(f"{current_model} is overloaded (503). Trying next model...")
                else:
                    logger.error(f"Gemini API Error with {current_model}: {error_msg}")
        
        if response:
            try:
                if hasattr(response, 'parsed') and response.parsed:
                    if isinstance(response.parsed, BaseModel):
                        result_dict = response.parsed.model_dump(by_alias=True)
                    else:
                        result_dict = response.parsed
                else:
                    try:
                        text_to_parse = response.text
                    except Exception:
                        text_to_parse = "{}"
                        raise Exception("Response blocked or empty")
                    result_dict = json.loads(text_to_parse)
                
                if "pp_item_name" in result_dict:
                    result_dict["purchasing_power"] = {
                        "item_name": result_dict.pop("pp_item_name", ""),
                        "past_comparison": result_dict.pop("pp_past_comparison", ""),
                        "present_comparison": result_dict.pop("pp_present_comparison", ""),
                        "summary": result_dict.pop("pp_summary", "")
                    }
                
                return result_dict
                
            except Exception as parse_e:
                logger.error(f"Failed to parse Gemini response: {parse_e}")
                if str(parse_e) != "Response blocked or empty":
                    all_errors["gemini_parsing"] = str(parse_e)

    # ---------------------------------------------------------
    # 3. Final Fallback to Local Model
    # ---------------------------------------------------------
    logger.error("All cloud APIs failed. Falling back to local model.")
    fallback_result = local_fallback_predict(pil_img) if 'pil_img' in locals() and pil_img else None
    if fallback_result:
        return fallback_result
        
    error_details = " | ".join([f"{k}: {v}" for k, v in all_errors.items()])
    
    return {
        "is_currency": False,
        "is_fake": False,
        "fake_reason": "",
        "currency_name": "API Overloaded",
        "currency_code": "ERR",
        "symbol": "!",
        "denomination": "0",
        "confidence": 0,
        "country": "Unknown",
        "explanation": f"The AI models are currently experiencing high demand. Please try again in a few minutes. (Debug Errors: {error_details})",
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
