# CurrencyAI - Recent Changes Summary

This document outlines the major changes, bug fixes, and performance optimizations made to the CurrencyAI application to resolve production deployment issues (specifically the "unreadable response" timeouts and "AI service experiencing high demand" errors on Render).

## 1. Concurrency & Deadlock Fixes (Gunicorn/Flask)

**Problem:** 
The application was experiencing intermittent hangs and returning `"The server returned an unreadable response."` errors after taking an extremely long time (timing out at 100s). This happened because the Google Gemini client (`genai.Client()`) was being initialized globally at the top of the Python files. When Gunicorn spawned multiple worker processes to handle web requests, they shared the same network connection pool. This sharing caused sockets to become corrupted or deadlocked, hanging the entire worker.

**Changes Made:**
- **`refactor/backend/services/inference_service.py`**: Moved the initialization of `client = genai.Client()` from the top-level module scope to *inside* the `predict_currency()` function. This ensures each prediction request gets a fresh, isolated connection that doesn't conflict with other workers.
- **`refactor/backend/services/ai_service.py`**: Applied the exact same fix to the AI Assistant component. Moved the `client = genai.Client()` initialization inside the `@ai_bp.route('/chat')` handler to fix the connection errors reported when using the UI Assistant.

## 2. Image Compression & Payload Optimization

**Problem:** 
Users with high-resolution cameras (like modern iPhones or Androids) were uploading large images (5MB+). Sending these large files directly to the Gemini API took a significant amount of time, sometimes exceeding Render's strict load balancer timeout limits.

**Changes Made:**
- **`refactor/backend/services/inference_service.py`**: Introduced the Python `Pillow` (PIL) library to dynamically compress and resize images *before* sending them to the AI model. 
- Implemented `pil_img.thumbnail((1024, 1024))` so that no image exceeds 1024x1024 pixels in dimensions.
- Saved the image in an optimized `JPEG` format to memory. This dramatically reduces the payload size sent over the network, making the prediction API extremely fast and reliable.

## 3. AI Model Migration

**Problem:** 
The application was periodically returning `"The AI service is currently experiencing high demand. Please try again in a few moments."` (503 Service Unavailable) because it was hitting a heavily loaded Google Gemini model. Additionally, there were 404 errors due to attempting to call older/deprecated models (`gemini-1.5-flash`).

**Changes Made:**
- **`refactor/backend/services/inference_service.py`**: Updated the prediction engine to use `gemini-3.6-flash`, bypassing the temporary high-demand blocks on the standard 3.7 model.
- **`refactor/backend/services/ai_service.py`**: Updated the AI Assistant chat route to use the recommended `gemini-3.6-flash` model via the modern `client.interactions.create` API.

## 4. Documentation

**Changes Made:**
- Created a brand-new, comprehensive `README.md` at the root of the project repository.
- Detailed the system architecture (React + Vite, Flask, Gemini AI).
- Added step-by-step instructions for local development, environment variable configuration, and production deployment on Render.
- Removed outdated refactor notes that were no longer relevant.
