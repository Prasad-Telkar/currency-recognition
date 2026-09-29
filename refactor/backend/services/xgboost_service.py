import joblib
import pandas as pd
import numpy as np
import yfinance as yf
import os
from datetime import datetime, timedelta

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
SUPPORTED_PAIRS = [("USD", "INR"), ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD")]

def generate_naive_fallback(base_currency, target_currency, horizon):
    hist = yf.Ticker(f"{base_currency}{target_currency}=X").history(period="90d")
    if hist.empty:
        # Try inverted
        hist = yf.Ticker(f"{target_currency}{base_currency}=X").history(period="90d")
        if not hist.empty:
            hist['Close'] = 1 / hist['Close']
        else:
            return {"success": False, "message": f"Cannot fetch data for {base_currency}-{target_currency}. Currency may be demonetized or unsupported."}
        
    hist = hist[['Close']].resample('D').ffill()
    
    historical_data = []
    hist_tail = hist.tail(15)
    for date, row in hist_tail.iterrows():
        historical_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "rate": round(float(row['Close']), 4)
        })
        
    current_rate = float(hist['Close'].iloc[-1])
    
    # Simple moving average drift
    sma_7 = hist['Close'].tail(7).mean()
    drift = (sma_7 - current_rate) / 7 if current_rate != 0 else 0
    
    forecast_data = []
    last_date = hist.index[-1]
    predicted_rate = current_rate
    
    for i in range(horizon):
        next_date = last_date + timedelta(days=i+1)
        dampened_drift = drift * (0.9 ** i) 
        predicted_rate += dampened_drift
        forecast_data.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "rate": round(predicted_rate, 4)
        })
        
    change_percent = ((predicted_rate - current_rate) / current_rate * 100) if current_rate != 0 else 0.0
    trend = "increase" if change_percent > 0 else "decrease"
    
    return {
        "success": True,
        "base": base_currency,
        "quote": target_currency,
        "horizon": horizon,
        "currentRate": round(current_rate, 4),
        "predictedRate": round(predicted_rate, 4),
        "changePercent": round(change_percent, 2),
        "historical": historical_data,
        "forecast": forecast_data,
        "model": "Mathematical Trend Analysis",
        "insights": f"A dedicated AI model is not yet available for this specific pair. Based on recent mathematical trends, we project a {abs(change_percent):.2f}% {trend} over the next {horizon} days."
    }

def predict_future(base_currency, target_currency, horizon):
    # Determine the pair representation
    if (base_currency, target_currency) in SUPPORTED_PAIRS:
        model_base = base_currency
        model_target = target_currency
        invert = False
    elif (target_currency, base_currency) in SUPPORTED_PAIRS:
        model_base = target_currency
        model_target = base_currency
        invert = True
    else:
        return generate_naive_fallback(base_currency, target_currency, horizon)
        
    model_path = os.path.join(MODEL_DIR, f"xgb_{model_base}_{model_target}.joblib")
    features_path = os.path.join(MODEL_DIR, f"xgb_{model_base}_{model_target}_features.joblib")
    metrics_path = os.path.join(MODEL_DIR, f"xgb_{model_base}_{model_target}_metrics.joblib")
    
    if not os.path.exists(model_path) or not os.path.exists(features_path) or not os.path.exists(metrics_path):
        return generate_naive_fallback(base_currency, target_currency, horizon)
        
    model = joblib.load(model_path)
    feature_cols = joblib.load(features_path)
    metrics = joblib.load(metrics_path)
    
    ticker = f"{model_base}{model_target}=X"
    # Fetch 90 days to ensure we have enough history for the max lag (30)
    df_raw = yf.Ticker(ticker).history(period="90d")
    
    if df_raw.empty:
        return {"success": False, "message": f"No historical data available for {ticker}."}
        
    df = df_raw[['Close']].resample('D').ffill()
    
    # Store historical data for return payload
    hist_df = df.tail(15)
    historical_data = []
    for date, row in hist_df.iterrows():
        rate = float(row['Close'])
        if invert: rate = 1.0 / rate if rate != 0 else 0
        historical_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "rate": round(rate, 4)
        })
        
    current_rate = float(df['Close'].iloc[-1])
    
    # Recursive forecasting buffer
    forecast_data = []
    
    # We will simulate data for 'horizon' days forward
    last_date = df.index[-1]
    
    # df_buffer starts with the actual historical data
    df_buffer = df.copy()
    
    for i in range(horizon):
        next_date = last_date + timedelta(days=i+1)
        
        # Calculate features manually on the current df_buffer
        # Our training model uses: lag_1, lag_2, lag_3, lag_7, lag_14, lag_30
        # rolling_mean_7, rolling_std_7, rolling_mean_14, etc., pct_change_1, pct_change_7
        
        # Since we only need features for the NEXT day, we can just compute them for the last row
        features_dict = {}
        for lag in [1, 2, 3, 7, 14, 30]:
            features_dict[f'lag_{lag}'] = float(df_buffer['Close'].iloc[-lag])
            
        for window in [7, 14, 30]:
            features_dict[f'rolling_mean_{window}'] = float(df_buffer['Close'].tail(window).mean())
            features_dict[f'rolling_std_{window}'] = float(df_buffer['Close'].tail(window).std())
            
        # Pct change
        features_dict['pct_change_1'] = float(df_buffer['Close'].iloc[-1] / df_buffer['Close'].iloc[-2] - 1)
        features_dict['pct_change_7'] = float(df_buffer['Close'].iloc[-1] / df_buffer['Close'].iloc[-8] - 1)
        
        # Create a single-row dataframe for prediction
        X_infer = pd.DataFrame([features_dict])[feature_cols]
        
        pred = model.predict(X_infer)[0]
        
        # Append the prediction to df_buffer so it can be used as a lag for the next step
        df_buffer.loc[next_date] = [pred]
        
        final_rate = float(pred)
        if invert: final_rate = 1.0 / final_rate if final_rate != 0 else 0
            
        forecast_data.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "rate": round(final_rate, 4)
        })
        
    # Final values
    pred_rate = float(df_buffer['Close'].iloc[-1])
    if invert:
        current_rate = 1.0 / current_rate if current_rate != 0 else 0
        pred_rate = 1.0 / pred_rate if pred_rate != 0 else 0
        
    change_percent = ((pred_rate - current_rate) / current_rate) * 100 if current_rate != 0 else 0
    
    # Generate insights text
    trend = "increase" if change_percent > 0 else "decrease"
    insights_text = (
        f"The XGBoost model predicts a {abs(change_percent):.2f}% {trend} over the next {horizon} days. "
        f"This forecast is driven by time-series features including lagged rates, 7/14/30-day rolling averages, "
        f"and recent percentage changes. "
        f"Model Evaluation Metrics (Test Set): MAE = {metrics['mae']:.4f}, RMSE = {metrics['rmse']:.4f}, MAPE = {metrics['mape']:.2f}%."
    )
    
    return {
        "success": True,
        "base": base_currency,
        "quote": target_currency,
        "horizon": horizon,
        "currentRate": round(current_rate, 4),
        "predictedRate": round(pred_rate, 4),
        "changePercent": round(change_percent, 2),
        "historical": historical_data,
        "forecast": forecast_data,
        "model": "XGBoost",
        "metrics": metrics,
        "insights": insights_text
    }
