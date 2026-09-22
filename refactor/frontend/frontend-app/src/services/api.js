// ============================================================
// CurrencyAI - API Service
// This file handles:
// 1. Sending currency images to Flask ML backend
// 2. Normalizing prediction responses
// 3. Currency conversion
// ============================================================

// Flask Backend URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "/api";

// ============================================================
// CUSTOM API ERROR
// ============================================================

export class ApiError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

// ============================================================
// CURRENCY IMAGE PREDICTION
// ============================================================

export async function predictCurrency(file) {
  // Create multipart form data
  const formData = new FormData();

  // IMPORTANT:
  // Backend expects field name "image"
  formData.append("image", file);

  let response;
  try {
    response = await fetch(
      `${API_BASE}/predict`,
      {
        method: "POST",
        body: formData,
      }
    );
  } catch (error) {
    console.error("Backend connection error:", error);
    throw new ApiError(
      "NETWORK_ERROR",
      "Could not reach the CurrencyAI recognition server. Make sure the Flask backend is running on port 5000."
    );
  }

  // Try reading backend response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      "INVALID_RESPONSE",
      "The server returned an unreadable response."
    );
  }

  // Handle HTTP errors
  if (!response.ok) {
    throw new ApiError(
      data.error?.code || "SERVER_ERROR",
      data.error?.message || "An error occurred on the server.",
      data.error?.details
    );
  }

  // Enforce consistent frontend schema from backend response
  const pred = data.prediction || {};
  const analysis = data.image_analysis || {};

  return {
    id: data.id,
    country: pred.country,
    currencyCode: pred.currency_code,
    currencyName: pred.currency_name,
    currencySymbol: pred.currency_symbol,
    denomination: pred.denomination,
    confidence: pred.confidence,
    confidenceLevel: pred.confidence_level,
    imageUrl: data.image_url,
    timestamp: data.timestamp,
    imageAnalysis: {
      quality_score: analysis.quality_score,
      blur_detected: analysis.blur_detected,
      lighting_quality: analysis.lighting_quality
    }
  };
}

// ============================================================
// CURRENCY CONVERSION 
// ============================================================

// Hardcoded fallback rates relative to USD if API fails
const FALLBACK_RATES = {
  USD: 1.0,
  INR: 95.0,
  EUR: 0.95,
  GBP: 0.80,
  JPY: 155.0,
  CNY: 7.25,
  AUD: 1.55,
  CAD: 1.38,
  BRL: 5.0,
  ZAR: 19.0,
  NPR: 152.0,
  PKR: 278.5,
  BDT: 109.8,
  PEN: 3.71,
  EGP: 47.8,
  GHS: 13.7,
  JOD: 0.71,
  TRY: 32.4,
  IDR: 15650,
  THB: 35.7,
  SGD: 1.34,
  AED: 3.67,
  CHF: 0.88
};

function getFallbackRate(fromCode, toCode) {
  const usdToFrom = FALLBACK_RATES[fromCode] || 1;
  const usdToTo = FALLBACK_RATES[toCode] || 1;
  return usdToTo / usdToFrom;
}

export async function convertCurrency(amount, fromCode, toCode) {
  const numAmount = parseFloat(amount) || 0;
  
  if (!fromCode || !toCode) {
    throw new ApiError("INVALID_INPUT", "Missing currency codes");
  }
  
  if (fromCode === toCode) {
    return {
      amount: numAmount,
      base: fromCode,
      rate: 1,
      rates: { [toCode]: numAmount },
      source: "local"
    };
  }

  // Offline fallback (user requested specific values that override live API)
  // try {
  //   const res = await fetch(`https://open.er-api.com/v6/latest/${fromCode}`);
  //   if (res.ok) {
  //     const data = await res.json();
  //     const rate = data.rates[toCode];
  //     if (rate) {
  //       return {
  //         amount: numAmount,
  //         base: fromCode,
  //         rate: rate,
  //         rates: { [toCode]: rate * numAmount },
  //         source: "open.er-api",
  //       };
  //     }
  //   }
  // } catch (error) {
  //   console.warn("Live currency API failed, using fallbacks:", error);
  // }

  // Offline fallback
  const fallbackRate = getFallbackRate(fromCode, toCode);
  return {
    amount: numAmount,
    base: fromCode,
    rate: fallbackRate,
    rates: { [toCode]: numAmount * fallbackRate },
    source: "offline_fallback",
  };
}

export async function fetchHistory(query = "", sortBy = "newest") {
  try {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (sortBy) params.append("sortBy", sortBy);
    
    const res = await fetch(`${API_BASE}/history?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      let historyArray = [];
      if (Array.isArray(data)) {
        historyArray = data;
      } else if (data && Array.isArray(data.history)) {
        historyArray = data.history;
      }
      
      return historyArray.map(item => ({
        id: item.id,
        timestamp: item.timestamp,
        result: item.result,
        currencyName: item.currency_name,
        currencyCode: item.currency_code,
        confidence: item.confidence,
        confidenceLevel: item.confidence_level
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

// ============================================================
// COUNTERFEIT DETECTION
// ============================================================

export async function checkCounterfeit(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${API_BASE}/counterfeit/check`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Server error");
    const data = await response.json();
    return data.heatmap; // Returns base64 image string
  } catch (error) {
    console.error("Counterfeit API Error:", error);
    throw new ApiError("NETWORK_ERROR", "Could not reach the counterfeit detection service.");
  }
}

// ============================================================
// AI ASSISTANT CHAT
// ============================================================

export async function chatAI(question, context) {
  try {
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, context }),
    });
    if (!response.ok) throw new Error("Server error");
    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("AI Chat API Error:", error);
    throw new ApiError("NETWORK_ERROR", "Could not reach the AI Assistant.");
  }
}
export async function saveHistoryEntry(prediction) {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prediction),
    });
    if (res.ok) {
      const data = await res.json();
      return data.success ? data.entry : prediction;
    }
  } catch (err) {
    console.error("saveHistoryEntry failed:", err);
  }
  // Return the original prediction so it can be saved locally if DB fails
  return { ...prediction, id: Date.now() }; 
}

export async function deleteHistoryEntry(id) {
  try {
    await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("deleteHistoryEntry failed:", err);
  }
}

export async function clearAllHistory() {
  try {
    await fetch(`${API_BASE}/history`, { method: "DELETE" });
  } catch (err) {
    console.error("clearAllHistory failed:", err);
  }
}

export async function fetchFinancialNews(currencyCode, countryName) {
  try {
    const params = new URLSearchParams();
    if (currencyCode) params.append("currency", currencyCode);
    if (countryName) params.append("country", countryName);
    
    const res = await fetch(`${API_BASE}/news?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.success ? data.news : [];
    }
  } catch (err) {
    console.error("fetchFinancialNews failed:", err);
  }
  return [];
}