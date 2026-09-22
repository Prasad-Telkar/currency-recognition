# CurrencyAI

CurrencyAI is a modern, AI-powered web application that instantly recognizes global currencies, banknotes, and coins from images. It uses Google's advanced Gemini multimodal AI to detect the country, currency code, and denomination, while also providing real-time exchange rates and historical conversion data.

## Features

- **Instant Recognition:** Upload a photo of any global currency, and the Gemini AI engine will instantly identify its country, currency name, ISO code, and denomination.
- **Smart Quality Checks:** Built-in computer vision algorithms automatically detect heavily blurred or poorly lit images before sending them to the AI, giving you immediate feedback to retake the photo.
- **Real-Time Conversion:** Once a currency is recognized, instantly convert its value to your local currency using up-to-date exchange rates.
- **History Tracking:** All your scanned currencies are saved to a searchable, sortable local history. Export your findings to CSV anytime.
- **Multilingual Support:** Fully internationalized (i18n) interface supporting English and Hindi (with scaffolding for more languages).
- **Responsive & Accessible Design:** A beautiful, animated UI built with React, Tailwind CSS, and Framer Motion, optimized for mobile devices and screen readers.

## Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** for styling
- **Framer Motion** for micro-animations
- **React-i18next** for internationalization

### Backend
- **Python (Flask)**
- **Google GenAI SDK** (Gemini 3.6 Flash) for multimodal image inference
- **OpenCV & Pillow** for image quality pre-processing and dynamic compression
- **Gunicorn** for production serving

## Environment Setup

To run this project, you will need a Google Gemini API Key. 

1. Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2. In the `refactor/backend/` directory, create a `.env` file and add your key:
```env
GEMINI_API_KEY=your_api_key_here
```

## Running Locally

### 1. Start the Backend (Flask)
```bash
cd refactor/backend
pip install -r requirements.txt
python app.py
```
The backend will start on `http://localhost:5000`.

### 2. Start the Frontend (React/Vite)
Open a new terminal window:
```bash
cd refactor/frontend/frontend-app
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Deployment (Render)

This repository includes a `render.yaml` Blueprint to automatically deploy the application on Render.

1. Connect your GitHub repository to Render using the **Blueprint** feature.
2. Render will automatically detect the `render.yaml` configuration.
3. Supply your `GEMINI_API_KEY` as an environment variable in the Render Dashboard when prompted.
4. Render will build both the frontend and backend, serving the static React app directly through the Flask backend on a single domain.

> **Note on Timeouts:** The Render load balancer has a strict 100-second timeout. To prevent timeouts on large images (e.g. 10MB smartphone photos), the backend dynamically scales down incoming images to 1024x1024 pixels before sending them to the Gemini API, ensuring lightning-fast predictions.

## Architecture

- **`refactor/frontend/frontend-app/`**: Contains the complete React source code, organized by features (recognition, conversion, history) and reusable UI components.
- **`refactor/backend/app.py`**: The Flask entry point. It serves the compiled React frontend from the `dist` folder and mounts API endpoints under `/api`.
- **`refactor/backend/api/routes/`**: Flask Blueprints containing route definitions for `/predict`, `/currencies`, and `/health`.
- **`refactor/backend/services/`**: Core logic including `inference_service.py` (Gemini API communication) and `quality_service.py` (OpenCV blur detection).
