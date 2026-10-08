# CurrencyAI — Smart Currency Intelligence

CurrencyAI is an advanced, AI-powered financial utility application that brings together computer vision, machine learning, and real-time financial data. Built as a collaborative mentorship project, it empowers users to instantly recognize global currencies from images, track live exchange rates, and mathematically forecast future currency trends.

🌍 **Live Demo:** [https://currencyai.web.app/](https://currencyai.web.app/)

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

**Frontend (Client):**
*   **React.js (Vite)** for lightning-fast module replacement and building.
*   **Tailwind CSS** for a highly customized, glassmorphism-inspired design system.
*   **Framer Motion** for fluid page transitions and interactive elements.
*   **Firebase Authentication** for secure, scalable user login and session management.
*   *Deployment:* **Firebase Hosting** ensures fast, global CDN delivery of the React application.

**Backend (API Server):**
*   **Python (Flask)** serving as the robust API gateway.
*   **XGBoost & scikit-learn** for our machine learning forecasting pipeline.
*   **OpenCV & Pillow** for image manipulation and quality assurance.
*   *Deployment:* **Render.com** hosts the Gunicorn/Flask web service, providing robust backend compute power.

**Third-Party APIs & Integrations:**
*   **Google Gemini API (3.6 Flash):** Powers the core multimodal image inference, analyzing complex currency photos and extracting denominations.
*   **yfinance API / Frankfurter:** Aggregates live and historical global market exchange rate data for real-time conversions and XGBoost training.

---

## 🎯 About the Project
CurrencyAI began as a mentorship initiative aimed at solving a common problem: seamless currency recognition and financial forecasting for everyday users and international businesses. The project bridges the gap between complex machine learning and accessible web interfaces. By combining computer vision with predictive financial models, we aim to provide an all-in-one financial utility that not only identifies banknotes but also contextualizes their value in the global market.

## ⚙️ Technical Approach
Our approach centers around a decoupled, microservice-inspired architecture:
*   **Computer Vision & GenAI:** We use OpenCV for initial image quality assurance (detecting blur/brightness) before passing the optimized image to the Google Gemini multimodal model. This two-step process reduces latency and API costs while maintaining high accuracy in identifying denomination, country, and currency—even with sophisticated fake currency detection checks.
*   **Machine Learning (Predictive Analytics):** We engineered an XGBoost regression pipeline trained on historical financial time-series data. We utilized lagging indicators and chronological data splits to avoid data leakage. For unsupported currency pairs, we developed a dynamic fallback system that uses cross-rates against the USD and naive moving-average drift.
*   **Frontend Architecture:** Built on React and Vite for optimal build speeds, utilizing Tailwind CSS for a scalable design system. The application relies on Firebase Authentication for session state and Firebase Hosting for rapid CDN delivery.

## 🚧 Challenges Faced
*   **Financial Data Availability:** Finding reliable, free, and comprehensive historical exchange rate datasets for niche currencies was difficult. We overcame this by using a hybrid approach involving `yfinance` and fallback mathematical cross-rate derivations.
*   **Image Processing Overhead:** High-resolution smartphone images caused severe latency and timeouts (especially on Render.com's 100s limit). We solved this by implementing dynamic client-side and server-side image compression and OpenCV quality checks.
*   **Model Generalization:** Training the XGBoost model to accurately predict volatile currency markets is inherently challenging. We mitigated overfitting by strictly separating chronological training/testing sets and relying on moving averages for outlier pairs.

## 💡 Feasibility & Viability
*   **Feasibility:** The project is highly feasible as a cloud-native web application. By leveraging serverless platforms (Firebase/Render) and scalable AI APIs (Google Gemini), the infrastructure requires minimal maintenance and scales automatically with user traffic.
*   **Viability:** The application has strong commercial viability. It targets travelers, forex traders, and international e-commerce platforms. The integration of "Fake Currency Detection" and "Future Trend Prediction" adds unique value beyond standard currency converter apps.

## ⚖️ Advantages & Disadvantages
**Advantages:**
*   **All-in-One Solution:** Combines image recognition, live exchange rates, and future forecasting in one interface.
*   **Highly Accessible:** A beautiful, intuitive UI with built-in internationalization (i18n).
*   **Resilient Architecture:** The mathematical fallback engine ensures the app never fails, even if specific ML models are missing.

**Disadvantages:**
*   **API Dependency:** Heavily reliant on third-party APIs (Gemini, yfinance). If these services experience downtime, core features are impacted.
*   **Market Volatility Limitations:** While XGBoost provides mathematical trend projections, real-world geopolitical events cannot be predicted, meaning forecasts must be used as guidance, not absolute financial advice.

---

## 👥 Meet the Team

CurrencyAI was brought to life through the combined efforts of four dedicated developers, under expert mentorship. Different strengths, one shared vision.

<table>
  <tr>
    <td align="center">
      <img src="refactor/frontend/frontend-app/public/prasada.png" width="100px;" alt="Prasada" style="border-radius: 50%"/><br />
      <b>Prasada</b><br />
      <i>Interface & Product Design</i>
    </td>
    <td align="center">
      <img src="refactor/frontend/frontend-app/public/kunal.jpg" width="100px;" alt="Kunal" style="border-radius: 50%"/><br />
      <b>Kunal</b><br />
      <i>Data & Interface Support</i>
    </td>
    <td align="center">
      <img src="refactor/frontend/frontend-app/public/vinay.png" width="100px;" alt="Vinay" style="border-radius: 50%"/><br />
      <b>Vinay</b><br />
      <i>Denomination & Data / Interface Support</i>
    </td>
    <td align="center">
      <img src="refactor/frontend/frontend-app/public/anushka.jpg" width="100px;" alt="Anushka" style="border-radius: 50%"/><br />
      <b>Anushka</b><br />
      <i>Machine Learning / Fake Currency Detection</i>
    </td>
  </tr>
</table>

*   **Prasada:** Led the core frontend development and user experience, while working closely with the entire team to collaboratively design the overall architecture, feature roadmap, and UI.
*   **Kunal:** Spearheaded the collection and cleaning of massive currency datasets, while playing a major collaborative role in UI/UX designing and frontend interface support.
*   **Vinay:** Engineered the external API integrations for the Future Prediction engine and led the complex task of denomination identification and core data organization.
*   **Anushka:** Architected the machine learning pipeline, specifically developing the fake currency identification systems and training the predictive models that power CurrencyAI.

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
