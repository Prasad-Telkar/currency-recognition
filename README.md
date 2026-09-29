# CurrencyAI — Smart Currency Intelligence

CurrencyAI is an advanced, AI-powered financial utility application that brings together computer vision, machine learning, and real-time financial data. Built as a collaborative mentorship project, it empowers users to instantly recognize global currencies from images, track live exchange rates, and mathematically forecast future currency trends.

Whether you are a traveler dealing with unfamiliar banknotes or an international business analyzing future currency strength, CurrencyAI provides a complete, accessible, and seamless solution.

---

## ✨ Advanced Features

### 🔍 Multimodal AI Currency Recognition
Upload or snap a photo of any global currency, and our backend engine instantly identifies the **country, currency name, ISO code, and denomination**. 
- **Smart Quality Pre-processing:** Built-in computer vision algorithms (OpenCV) automatically detect heavily blurred or poorly lit images before sending them to the AI, saving bandwidth and ensuring high accuracy.
- **Dynamic Compression:** Handles multi-megabyte smartphone photos by dynamically scaling them down before inference.

### 🔮 XGBoost Future Forecasting & Trend Analysis
CurrencyAI doesn't just look at the present; it looks at the future.
- **Machine Learning Forecasts:** We have trained and deployed dedicated **XGBoost regression models** for major global currency pairs (e.g., USD-INR, EUR-USD, GBP-USD). It analyzes chronological time-series data and engineered lag features to predict 90-day currency trends.
- **Mathematical Fallback Engine:** For hundreds of unsupported currency combinations (e.g., JPY-CAD), the system dynamically cross-calculates live rates via USD and utilizes a **7-Day Moving Average "Naive Drift" Analysis**. This ensures the application never crashes and can intelligently project mathematical trends for *any* currency pair selected.

### 💱 Real-Time Conversions & History
- **Live Exchange Rates:** Integrates with up-to-date APIs to convert recognized currencies into your local denomination instantly.
- **Persistent Local History:** All scanned currencies and generated insights are saved locally. You can search, sort, filter, and export your personal financial history to CSV.

### 🌍 Internationalization (i18n) & Accessibility
- **Multilingual Support:** Fully internationalized interface currently supporting English and Hindi, built with scalability for dozens of global languages.
- **Premium UX/UI:** A responsive, accessible, and highly polished interface built with React, Tailwind CSS, and Framer Motion micro-animations.

---

## 🛠️ Tech Stack & Architecture

CurrencyAI uses a decoupled client-server architecture to ensure high performance and scalability.

**Frontend:**
*   **React.js (Vite)** for lightning-fast module replacement and building.
*   **Tailwind CSS** for a highly customized, glassmorphism-inspired design system.
*   **Framer Motion** for fluid page transitions and interactive elements.
*   **React-i18next** for seamless language switching.
*   *Deployed via Firebase Hosting / GitHub Pages.*

**Backend:**
*   **Python (Flask)** serving as the robust API gateway.
*   **Google GenAI SDK (Gemini 3.6 Flash)** for heavy-lifting multimodal image inference.
*   **XGBoost & scikit-learn** for our machine learning forecasting pipeline.
*   **OpenCV & Pillow** for image manipulation and quality assurance.
*   **yfinance** for live and historical market data aggregation.
*   *Served via Gunicorn and deployed on Render.*

---

## 👥 Meet the Team

CurrencyAI was brought to life through the combined efforts of four dedicated developers, under expert mentorship. Different strengths, one shared vision.

*   **Prasada** — *Interface & Product Design*
    Designed and developed the beautiful CurrencyAI frontend. Focused on user experience, visual design, and seamlessly integrating complex AI capabilities into an intuitive, accessible application.
*   **Kunal** — *Data Collection & Interface Support*
    Spearheaded the collection, cleaning, and organization of the massive currency datasets required for the project, while also contributing to product refinement and UI support.
*   **Vinay** — *Denomination & Data Organization*
    Led the complex task of denomination identification, organizing the data structures by specific banknote values, and contributed directly to core development.
*   **Anushka** — *Machine Learning*
    Architected and developed the machine learning components of CurrencyAI, including training the models responsible for making the application truly intelligent.

**Guided by Experience:**
*   **Dileep Ladache** — *Project Mentor*
    Provided invaluable guidance, architectural advice, and technical mentorship to the team throughout the entire development lifecycle of CurrencyAI.

---

## 🚀 Running Locally

To run this project, you will need a Google Gemini API Key. 
1. Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2. In the `refactor/backend/` directory, create a `.env` file and add your key: `GEMINI_API_KEY=your_api_key_here`

### 1. Start the Backend (Flask)
```bash
cd refactor/backend
pip install -r requirements.txt
python app.py
```
*The backend will start on `http://localhost:5000`.*

### 2. Start the Frontend (React/Vite)
Open a new terminal window:
```bash
cd refactor/frontend/frontend-app
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*
