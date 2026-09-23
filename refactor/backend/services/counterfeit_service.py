import os
import cv2
import numpy as np
import base64
import json
import time
import logging
from io import BytesIO
from PIL import Image, ImageFile
from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

ImageFile.LOAD_TRUNCATED_IMAGES = True

logger = logging.getLogger(__name__)

counterfeit_bp = Blueprint('counterfeit', __name__)


# ============================================================
# PYDANTIC SCHEMA FOR STRUCTURED GEMINI COUNTERFEIT ANALYSIS
# ============================================================

class SecurityFeature(BaseModel):
    name: str = Field(description="Name of the banknote security feature (e.g. Watermark, Security Thread, Microprinting, Color-Shifting Ink, Latent Image, See-Through Register, Intaglio Raised Print, Holographic Strip).")
    status: str = Field(description="Status of this feature: Must be one of 'VERIFIED', 'SUSPICIOUS', 'MISSING', or 'UNVERIFIED'.")
    details: str = Field(description="Detailed visual observation of this security feature on the note.")


class CounterfeitAnalysisResult(BaseModel):
    verdict: str = Field(description="Final assessment verdict: Must be one of 'GENUINE', 'SUSPICIOUS', 'LIKELY_COUNTERFEIT', or 'INCONCLUSIVE'.")
    authenticity_score: float = Field(description="Estimated authenticity score from 0.0 to 100.0 (where >= 85 is genuine, 60-84 is suspicious, <60 is likely counterfeit).")
    counterfeit_risk: str = Field(description="Counterfeit risk classification: Must be one of 'LOW', 'MEDIUM', or 'HIGH'.")
    security_features: list[SecurityFeature] = Field(description="List of key security features evaluated for this banknote.")
    anomalies: list[str] = Field(description="List of detected anomalies, irregularities, flaws, or signs of counterfeit. Empty list if none detected.")
    recommendations: list[str] = Field(description="Practical recommendations and next steps for verifying or handling the note.")
    explanation: str = Field(description="Summary explanation of the counterfeit assessment.")


# ============================================================
# FALLBACK ANALYSIS (PRESERVES APP STABILITY IF API CALL FAILS)
# ============================================================

def fallback_counterfeit_analysis(image_bytes=None, error_msg=None):
    """
    Provides safe, structured fallback data if the Gemini counterfeit analysis
    fails or encounters network/rate limits.
    """
    return {
        "verdict": "INCONCLUSIVE",
        "authenticity_score": 50.0,
        "counterfeit_risk": "MEDIUM",
        "security_features": [
            {
                "name": "Automated Security Scan",
                "status": "UNVERIFIED",
                "details": "Automated security feature check could not be completed at this time."
            }
        ],
        "anomalies": [
            "Automated counterfeit verification service temporarily degraded or unavailable."
        ],
        "recommendations": [
            "Hold the banknote up to light to verify the watermark.",
            "Feel for raised intaglio printing along portraits and denomination numerals.",
            "Inspect the embedded security thread for color shift and clear text/numerals.",
            "Compare note dimensions and paper texture with a known genuine banknote."
        ],
        "explanation": "Automated verification was inconclusive due to temporary service availability. Manual inspection is advised.",
        "fallback": True,
        "error": error_msg or "AI counterfeit analysis unavailable"
    }


# ============================================================
# GEMINI COUNTERFEIT ANALYSIS SERVICE
# ============================================================

_cf_client = None

def get_counterfeit_client():
    global _cf_client
    if _cf_client is not None:
        return _cf_client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("CurrencyAI service is unconfigured (Missing GEMINI_API_KEY).")
    _cf_client = genai.Client(api_key=api_key)
    return _cf_client


def run_gemini_counterfeit_analysis(image_input, currency_info=None):
    """
    Analyzes an image of a banknote for counterfeit indicators using Gemini.
    Returns a standardized dictionary matching CounterfeitAnalysisResult.
    """
    gemini_client = get_counterfeit_client()

    # Process image input into PIL Image
    pil_img = None
    if hasattr(image_input, 'size') and hasattr(image_input, 'copy'):
        pil_img = image_input.copy()
    elif isinstance(image_input, (bytes, bytearray)):
        try:
            from PIL import Image
            pil_img = Image.open(BytesIO(image_input))
        except Exception:
            raise Exception("Invalid image format for counterfeit check.")
    elif isinstance(image_input, str) and os.path.exists(image_input):
        try:
            from PIL import Image
            pil_img = Image.open(image_input)
        except Exception:
            raise Exception("Invalid image path for counterfeit check.")

    if not pil_img:
        raise Exception("Could not load image for counterfeit analysis.")

    try:
        pil_img.load()
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")
        # Resize image to prevent large payload bottlenecks
        if max(pil_img.size) > 1024:
            pil_img.thumbnail((1024, 1024))

        currency_context = ""
        if currency_info and isinstance(currency_info, dict):
            country = currency_info.get("country", "")
            currency_name = currency_info.get("currency_name", "")
            denom = currency_info.get("denomination", "")
            code = currency_info.get("currency_code", "")
            if country or currency_name or denom:
                currency_context = (
                    f"Banknote Identity Context:\n"
                    f"- Country/Region: {country}\n"
                    f"- Currency: {currency_name} ({code})\n"
                    f"- Denomination: {denom}\n\n"
                )

        prompt = (
            "You are a forensic banknote examination and counterfeit currency detection expert for CurrencyAI.\n"
            "Examine this currency note image with extreme forensic precision for indicators of authenticity and counterfeit signs.\n\n"
            f"{currency_context}"
            "Carefully analyze all visible security features, including:\n"
            "1. Watermark: Presence, portrait clarity, shade gradation, and positioning.\n"
            "2. Security Thread: Continuous vs windowed, microprint clarity, color shift.\n"
            "3. Microprinting: Sharpness of microlettering vs blurry ink bleed of counterfeit copies.\n"
            "4. Color-Shifting / Optical Variable Ink (OVI): Angle-dependent color transitions.\n"
            "5. Intaglio Print & Tactile Features: Raised ink texture on portraits, numerals, and bleed lines.\n"
            "6. Latent Image & See-Through Register: Front/back registration alignment.\n"
            "7. Serial Number & Typography: Font consistency, alignment, and ink consistency.\n"
            "8. Paper Substrate & Edge Cut: Paper quality, edge smoothness, and color accuracy.\n\n"
            "Classification Rules:\n"
            "- 'GENUINE': The note exhibits authentic security features consistent with genuine currency. Authenticity score should be >= 85, counterfeit risk 'LOW'. Anomalies must be empty or negligible.\n"
            "- 'SUSPICIOUS': Note has noticeable irregularities, missing expected features, or blurry print in critical areas. Authenticity score between 50 and 84, counterfeit risk 'MEDIUM'. Detail all anomalies.\n"
            "- 'LIKELY_COUNTERFEIT': Note shows clear counterfeit signatures (e.g., printed fake watermark, missing security thread, color photocopy artifacts, incorrect typography). Authenticity score < 50, counterfeit risk 'HIGH'. Detail all anomalies.\n"
            "- 'INCONCLUSIVE': The image resolution, angle, or lighting is inadequate to verify security features. Authenticity score around 50, counterfeit risk 'MEDIUM'.\n\n"
            "Return ONLY the required structured JSON response matching the schema."
        )

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
                        response_schema=CounterfeitAnalysisResult,
                        temperature=0.1
                    ),
                )
                if response:
                    break
            except Exception as e:
                last_error = e
                logger.warning("Gemini counterfeit check on model %s failed: %s. Trying next candidate...", model_name, e)
                continue

        if not response:
            raise Exception(f"Failed to get counterfeit analysis response: {last_error}")

        if hasattr(response, 'parsed') and response.parsed:
            if isinstance(response.parsed, BaseModel):
                result_dict = response.parsed.model_dump(by_alias=True)
            else:
                result_dict = response.parsed
        else:
            result_dict = json.loads(response.text)

        # Standardize uppercase verdict and risk
        if "verdict" in result_dict:
            result_dict["verdict"] = str(result_dict["verdict"]).upper()
        if "counterfeit_risk" in result_dict:
            result_dict["counterfeit_risk"] = str(result_dict["counterfeit_risk"]).upper()

        return result_dict

    except Exception as e:
        logger.error("Gemini counterfeit check failed: %s", str(e))
        raise e


# ============================================================
# STANDALONE ENDPOINT (PRESERVED FOR DIRECT CALLS)
# ============================================================

@counterfeit_bp.route('/check', methods=['POST'])
@counterfeit_bp.route('/counterfeit/check', methods=['POST'])
def counterfeit_check():
    """
    Standalone endpoint preserved for direct calls.
    Takes an image (multipart form data) or base64,
    applies a Laplacian variance filter to highlight microprinting/edges,
    applies a heatmap colormap, and returns the resulting image as base64.
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part in request'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected image'}), 400

        # Read image bytes
        image_bytes = file.read()
        npimg = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply Laplacian to find edges (high frequencies)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        abs_laplacian = cv2.convertScaleAbs(laplacian)

        # Apply colormap to create heatmap
        heatmap = cv2.applyColorMap(abs_laplacian, cv2.COLORMAP_JET)

        # Blend original with heatmap
        gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        blended = cv2.addWeighted(gray_bgr, 0.4, heatmap, 0.6, 0)

        # Encode back to JPEG
        _, buffer = cv2.imencode('.jpg', blended)
        encoded_img = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'heatmap': f'data:image/jpeg;base64,{encoded_img}',
            'status': 'success'
        }), 200

    except Exception as e:
        logger.error(f"Counterfeit check error: {e}")
        return jsonify({'error': str(e)}), 500
