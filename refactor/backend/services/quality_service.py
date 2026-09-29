"""Image quality analysis — genuinely useful independent of the recognition
model itself. Runs on every uploaded image before inference, using two
well-established, cheap OpenCV techniques:

  1. Blur detection: variance of the Laplacian. A sharp image has high-
     frequency edges everywhere, which the Laplacian responds strongly to;
     a blurry image doesn't, so its variance is low.
  2. Lighting quality: mean grayscale brightness. Too low = underexposed,
     too high = overexposed/blown out.

Neither of these depends on a trained model, so this ships and is useful
today even while the recognition model itself is still a placeholder.

SCORING DESIGN NOTE: blur and "too small to see detail" are treated as
hard failures (the image is genuinely unusable, regardless of anything
else) rather than partial deductions from a 100-point scale. An earlier
version of this scoring subtracted a capped penalty for each defect, which
meant a badly blurred image could still land at 60/100 and pass the
quality gate — verified as a real bug via a smoke test with a deliberately
blurred image. Poor lighting alone is treated more leniently, since a
dim or bright (but sharp, full-size) image can often still be read.
"""

import cv2
import numpy as np

BLUR_THRESHOLD = 60.0
MIN_DIMENSION = 200  # px, on the shorter side


def analyze_quality(image_bytes):
    """Returns a dict of quality metrics, or None if the bytes aren't a
    readable image."""
    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    blur_detected = blur_score < BLUR_THRESHOLD

    mean_brightness = float(np.mean(gray))
    if mean_brightness < 60:
        lighting_quality = "Poor - too dark"
        lighting_ok = False
    elif mean_brightness > 200:
        lighting_quality = "Poor - overexposed"
        lighting_ok = False
    else:
        lighting_quality = "Good"
        lighting_ok = True

    height, width = gray.shape[:2]
    resolution_ok = min(height, width) >= MIN_DIMENSION

    quality_score = _compute_quality_score(blur_score, blur_detected, lighting_ok, resolution_ok)

    return {
        "quality_score": quality_score,
        "blur_detected": bool(blur_detected),
        "blur_score": round(blur_score, 2),
        "lighting_quality": lighting_quality,
        "resolution_ok": resolution_ok,
        "width": width,
        "height": height,
    }


def _compute_quality_score(blur_score, blur_detected, lighting_ok, resolution_ok):
    # Too small to trust, full stop — no amount of sharpness or good
    # lighting compensates for an image where the note's detail simply
    # isn't captured.
    if not resolution_ok:
        return 15

    # Blur is a hard failure too, but scaled within a low band so a
    # "slightly soft" image (blur_score just under threshold) still reads
    # as less bad than one that's severely blurred.
    if blur_detected:
        ratio = max(0.0, min(1.0, blur_score / BLUR_THRESHOLD))
        return round(5 + ratio * 25)  # 5-30 range, always below the gate

    score = 100.0
    if not lighting_ok:
        score -= 25.0
    return max(0, min(100, round(score)))
