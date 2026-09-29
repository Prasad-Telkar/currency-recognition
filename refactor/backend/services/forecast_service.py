import json
import logging
from datetime import datetime, timedelta
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from services.news_service import fetch_financial_news

logger = logging.getLogger(__name__)

class ForecastPoint(BaseModel):
    date: str
    rate: float

class ForecastResult(BaseModel):
    forecast: list[ForecastPoint]
    predictedRate: float
    changePercent: float
    model_insights: str

def generate_ai_forecast(base, target, horizon, historical_data):
    """
    Generates a forecast by fetching live financial news and using Gemini to predict future rates based on history.
    """
    try:
        client = genai.Client()
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client for forecasting: {e}")
        return None
        
    # 1. Fetch live world news
    query = f"{base} {target} currency exchange rate economy"
    news_items = fetch_financial_news(query)
    
    # Format news context
    news_context = "\n".join([f"- {n['title']} ({n.get('source', '')}, {n.get('pubDate', '')})" for n in news_items[:10]])
    
    # Format historical context
    # Only send last 14 days to keep prompt size reasonable and focused on recent trends
    recent_history = historical_data[-14:] 
    history_context = "\n".join([f"{d['date']}: {d['rate']}" for d in recent_history])
    
    current_rate = historical_data[-1]["rate"] if historical_data else 1.0
    
    prompt = f"""
    You are an expert financial quantitative analyst AI. Your task is to forecast the exchange rate for {base} to {target} over the next {horizon} days.
    
    CURRENT RATE (as of today): {current_rate}
    
    RECENT HISTORICAL TREND (Last 14 days):
    {history_context}
    
    LIVE WORLD NEWS & MARKET CONTEXT:
    {news_context if news_items else "No recent news available. Rely on historical trend."}
    
    TASK:
    Based on the historical trend and the market news above, predict the exact exchange rate for the next {horizon} days.
    Make the curve realistic with some volatility (ups and downs), but follow the trend you believe is likely based on the news.
    Also provide a short explanation (insights) of why you predicted this trend (e.g. "Based on recent news about X, we expect the currency to strengthen...").
    
    Return the result matching the schema.
    Start the dates from tomorrow. Today's date is {(datetime.now()).strftime("%m/%d")}. 
    Ensure you output EXACTLY {horizon} items in the forecast array.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ForecastResult,
                temperature=0.7,
            ),
        )
        
        # Parse the JSON
        response_text = response.text.strip()
        data = json.loads(response_text)
        return data
    except Exception as e:
        logger.error(f"Error calling Gemini for forecast: {e}")
        return None
