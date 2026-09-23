import os
import json
import logging
from io import BytesIO
from typing import Optional
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

from google import genai
from google.genai import types
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Shared cached GenAI client
_client = None

def get_gemini_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("CurrencyAI service is unconfigured (Missing API Key).")
    _client = genai.Client(api_key=api_key)
    return _client


class PurchasingPower(BaseModel):
    item_name: str = Field(default="Everyday items", description="Name of a culturally relevant, well-known everyday item in this country (e.g. Samosas for India, Cups of Coffee for USA, Baguettes for France/Euro, Street Tacos for Mexico, etc.)")
    past_comparison: str = Field(default="", description="What roughly this amount of money could buy ~20 years ago (e.g. 'Could buy ~100 samosas (₹5 each) in 2004')")
    present_comparison: str = Field(default="", description="What this amount of money buys today (e.g. 'Buys ~25-30 samosas (₹15-20 each) today')")
    summary: str = Field(default="", description="A short, relatable 1-2 sentence comparison showing the change in purchasing power.")


class CurrencyPrediction(BaseModel):
    is_currency: bool = Field(description="True if the image contains a banknote, currency note (genuine or counterfeit/suspect), or coin. Set to false only if the image is completely unrelated to money.")
    currency_name: str = Field(default="", description="The name of the currency (e.g. 'US Dollar', 'Indian Rupee', 'Euro')")
    currency_code: str = Field(default="", description="The 3-letter ISO currency code (e.g. 'USD', 'INR', 'EUR')")
    symbol: str = Field(default="", description="The currency symbol (e.g. '$', '₹', '€')")
    denomination: str = Field(default="", description="The denomination value as a string (e.g. '500', '20'). Return '0' or empty if not sufficiently visible.")
    confidence: float = Field(default=0.0, description="The confidence score out of 100")
    country: str = Field(default="", description="The country or region of the currency (e.g. 'USA', 'India', 'Euro')")
    explanation: str = Field(default="", description="Briefly explain the visual evidence used, or why recognition was unsuccessful.")
    purchasing_power: Optional[PurchasingPower] = Field(default=None, description="Relatable purchasing-power comparison 20 years ago vs today for this specific country and denomination.")
    history: Optional[str] = Field(default="", description="2 to 4 sentences of brief historical or interesting background about this currency and denomination.")


def get_fallback_purchasing_power(country, denomination, currency_name):
    country_lower = (country or "").lower()
    denom_str = str(denomination or "").strip()
    
    if "india" in country_lower:
        item = "Samosas / Street Chai"
        past = f"Roughly 20 years ago, ₹{denom_str} could buy around 80-100 freshly fried samosas (at ~₹5 each) or over 150 cups of chai."
        present = f"Today, ₹{denom_str} buys approximately 20-25 samosas (at ~₹20-25 each) at local bakeries or snack stalls."
        summary = f"Over the past two decades, everyday purchasing power for street snacks has dropped by roughly 70-75% due to cumulative inflation."
    elif "usa" in country_lower or "united states" in country_lower:
        item = "Cups of Brewed Coffee"
        past = f"20 years ago, ${denom_str} could purchase about 2 to 3 times more regular coffee or diner breakfasts than today."
        present = f"Today, ${denom_str} covers fewer specialty coffees or café meals due to rising ingredient and service costs."
        summary = f"The real purchasing power of ${denom_str} has contracted notably compared to 20 years ago."
    elif "euro" in country_lower or "europe" in country_lower or "france" in country_lower or "germany" in country_lower:
        item = "Fresh Baguettes & Bakery Goods"
        past = f"Around 20 years ago, €{denom_str} bought a generous basket of fresh artisan baguettes and morning croissants."
        present = f"Today, €{denom_str} buys about half to a third as many bakery items across eurozone cities."
        summary = f"Everyday food staples reflect noticeable price increases across Europe since the early 2000s."
    elif "japan" in country_lower:
        item = "Onigiri / Bento Meals"
        past = f"20 years ago, this amount covered multiple onigiri rice balls and beverage sets at convenience stores."
        present = f"Today, convenience store staple prices have steadily shifted upward, reducing the item count."
        summary = f"Even in a historically low-inflation economy, consumer staples show tangible price increases over 20 years."
    elif "uk" in country_lower or "britain" in country_lower or "united kingdom" in country_lower or "england" in country_lower:
        item = "Pints of Milk / Loaves of Bread"
        past = f"20 years ago, £{denom_str} could buy substantially more grocery essentials and bakery staples than today."
        present = f"Today, £{denom_str} covers noticeably fewer basic grocery basket items."
        summary = f"Inflation over the past 20 years has steadily reduced the quantity of daily groceries £{denom_str} can secure."
    else:
        item = "Everyday groceries & snacks"
        past = f"20 years ago, {denom_str} {currency_name or 'currency'} could purchase roughly 2 to 3 times more basic goods and groceries."
        present = f"Today, {denom_str} {currency_name or 'currency'} buys a smaller basket of everyday staples."
        summary = f"Due to two decades of price inflation, the purchasing power of {denom_str} {currency_name or 'currency'} has steadily adjusted."

    return {
        "item_name": item,
        "past_comparison": past,
        "present_comparison": present,
        "summary": summary
    }


def get_fallback_history(country, denomination, currency_name):
    country_lower = (country or "").lower()
    denom_str = str(denomination or "").strip()
    if "india" in country_lower:
        if denom_str == "500":
            return "The current stone grey ₹500 banknote belongs to the Mahatma Gandhi New Series introduced on November 10, 2016 following demonetisation. Its reverse features Delhi's historic Red Fort, a UNESCO World Heritage site and symbol of Indian independence, alongside the Swachh Bharat logo."
        elif denom_str == "200":
            return "The bright yellowish-orange ₹200 banknote was introduced by the Reserve Bank of India in August 2017 to bridge the transaction gap between ₹100 and ₹500 notes. The reverse depicts the iconic Sanchi Stupa, commemorating India's ancient Buddhist cultural legacy."
        elif denom_str == "100":
            return "The lavender ₹100 note was released in July 2018 under the Mahatma Gandhi New Series. Its reverse showcases 'Rani ki Vav' (The Queen's Stepwell) in Patan, Gujarat, an intricately carved subterranean marvel celebrating ancient water management and architecture."
        elif denom_str == "50":
            return "The fluorescent blue ₹50 banknote was released in August 2017. Its reverse depicts the famous Stone Chariot of Hampi, Karnataka, celebrating the architectural grandeur of the Vijayanagara Empire."
        elif denom_str == "20":
            return "The greenish-yellow ₹20 banknote was unveiled in April 2019, showcasing the Ellora Caves on the reverse to celebrate UNESCO-recognized rock-cut monument engineering."
        elif denom_str == "10":
            return "The chocolate brown ₹10 note was introduced in January 2018. It depicts the majestic Sun Temple Wheel from Konark, Odisha, symbolizing cosmic time and architectural brilliance."
        else:
            return "The Indian Rupee traces its origin to the silver 'Rupiya' issued by Sultan Sher Shah Suri in the 16th century. Modern Indian banknotes feature Mahatma Gandhi on the obverse and celebrated national monuments and heritage motifs on the reverse."
    elif "usa" in country_lower:
        return f"US Dollar banknotes are produced by the Bureau of Engraving and Printing on a unique 75% cotton and 25% linen blend paper. The ${denom_str} denomination features iconic American historical portraiture alongside microprinting and specialized optical security features designed to deter reproduction."
    elif "euro" in country_lower:
        return f"Euro banknotes entered circulation on January 1, 2002 across eurozone nations. Designed by Robert Kalina, the notes depict architectural styles across European history—windows and gateways on the front symbolizing openness, and bridges on the back symbolizing cross-border cooperation."
    else:
        return f"The {currency_name or country} banknote reflects the unique heritage and economic history of {country}, combining intricate engraved artwork with modern banknote security features."


def predict_currency(image_input):
    """
    Accepts raw image bytes, PIL Image, or file path,
    and returns a standardized prediction dictionary via Gemini with
    integrated purchasing power comparison and historical background.
    """
    gemini_client = get_gemini_client()
    
    pil_img = None
    if hasattr(image_input, 'size') and hasattr(image_input, 'copy'):
        # Already a PIL Image
        pil_img = image_input.copy()
    elif isinstance(image_input, (bytes, bytearray)):
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
        pil_img.load()
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
        # Resize image to a maximum dimension of 1024 if needed
        if max(pil_img.size) > 1024:
            pil_img.thumbnail((1024, 1024))
        
        prompt = (
            "You are the currency recognition and economic analysis engine for CurrencyAI.\n"
            "Analyze the provided image carefully.\n"
            "Determine whether the image contains a banknote, paper bill (genuine, suspect, or counterfeit being checked), or coin.\n\n"
            "If it is a banknote or coin:\n"
            "- set is_currency to true\n"
            "- identify the country/region\n"
            "- identify the currency name\n"
            "- identify the ISO currency code\n"
            "- identify the denomination value when visible\n"
            "- provide the currency symbol when applicable\n"
            "- provide a confidence estimate out of 100\n"
            "- briefly explain the visual evidence used\n\n"
            "ECONOMIC & HISTORICAL INSIGHTS (for recognized currency):\n"
            "1. Purchasing Power Comparison ('20 years ago vs today'):\n"
            "   - Choose a culturally well-known, locally relatable everyday item specifically for this country (e.g. samosas / cutting chai for India, brewed coffee / burgers for USA, artisan baguettes for France/Eurozone, street tacos for Mexico, ramen/onigiri for Japan).\n"
            "   - State roughly how much of this item this denomination could buy ~20 years ago (around 2004-2006).\n"
            "   - State roughly how much of this item it can buy today.\n"
            "   - Provide a short, relatable 1-2 sentence comparison summary.\n"
            "2. History (2-4 sentences):\n"
            "   - Provide a brief, interesting historical background or notable design elements about this specific banknote / denomination (e.g. year of introduction, monuments/portraits depicted, significance).\n\n"
            "If the image is completely unrelated to money (e.g. animals, cars, food, random objects):\n"
            "- set is_currency to false\n"
            "- do not invent a currency or denomination\n"
            "- explain why recognition was unsuccessful\n\n"
            "Never guess a denomination when it is not sufficiently visible.\n"
            "Return ONLY the required structured response matching the schema."
        )
        
        # Candidate models with fast low-latency fallback
        env_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        candidate_models = [env_model]
        for fallback in ["gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-3.5-flash"]:
            if fallback not in candidate_models:
                candidate_models.append(fallback)
        
        response = None
        last_error = None
        
        for model_name in candidate_models:
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
                if response:
                    break
            except Exception as e:
                last_error = e
                logger.warning("Gemini recognition on model %s failed: %s. Trying next candidate...", model_name, e)
                continue
                    
        if not response:
            raise Exception(f"Failed to get a response from Gemini: {last_error}")
        
        try:
            if hasattr(response, 'parsed') and response.parsed:
                if isinstance(response.parsed, BaseModel):
                    result_dict = response.parsed.model_dump(by_alias=True)
                else:
                    result_dict = response.parsed
            else:
                result_dict = json.loads(response.text)
            
            # Ensure purchasing_power and history fallbacks if omitted or empty
            if result_dict.get("is_currency", False):
                country = result_dict.get("country", "")
                denom = result_dict.get("denomination", "")
                curr_name = result_dict.get("currency_name", "")
                
                pp = result_dict.get("purchasing_power")
                if not pp or not isinstance(pp, dict) or not pp.get("summary"):
                    result_dict["purchasing_power"] = get_fallback_purchasing_power(country, denom, curr_name)
                    
                hist = result_dict.get("history")
                if not hist or len(str(hist).strip()) < 15:
                    result_dict["history"] = get_fallback_history(country, denom, curr_name)

            return result_dict
            
        except Exception as parse_e:
            logger.error("Failed to parse Gemini response: %s", parse_e)
            raise Exception("Failed to parse recognition results.")
            
    except Exception as e:
        logger.error("Gemini API inference failed: %s", str(e))
        raise Exception(f"Recognition failed: {str(e)}")

