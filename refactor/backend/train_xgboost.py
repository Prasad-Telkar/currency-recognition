import pandas as pd
import numpy as np
import yfinance as yf
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import os
from datetime import datetime

# Supported Pairs (Base-Target)
SUPPORTED_PAIRS = [("USD", "INR"), ("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("AUD", "USD")]
YEARS_OF_DATA = 5
TRAIN_RATIO = 0.8

os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

def create_features(df):
    """
    Time-series feature engineering.
    df must have a 'Close' column and a DatetimeIndex.
    """
    df = df.copy()
    df = df.sort_index()
    
    # Calculate lags first
    for lag in [1, 2, 3, 7, 14, 30]:
        df[f'lag_{lag}'] = df['Close'].shift(lag)
        
    # IMPORTANT: To prevent data leakage, all rolling stats and percentage changes 
    # must be calculated on PAST data only (lag_1), not on the current 'Close'.
    
    for window in [7, 14, 30]:
        df[f'rolling_mean_{window}'] = df['lag_1'].rolling(window=window).mean()
        df[f'rolling_std_{window}'] = df['lag_1'].rolling(window=window).std()
        
    df['pct_change_1'] = df['lag_1'].pct_change(1)
    df['pct_change_7'] = df['lag_1'].pct_change(7)
    
    df = df.dropna()
    return df

def train_and_evaluate(pair):
    base, target = pair
    ticker = f"{base}{target}=X"
    print(f"Fetching data for {ticker}...")
    
    df = yf.Ticker(ticker).history(period=f"{YEARS_OF_DATA}y")
    
    if df.empty:
        print(f"No data for {ticker}")
        return
        
    df = df[['Close']]
    # Resample to daily to fill weekends
    df = df.resample('D').ffill()
    
    df_features = create_features(df)
    
    target_col = 'Close'
    features = [c for c in df_features.columns if c != target_col]
    
    split_idx = int(len(df_features) * TRAIN_RATIO)
    train = df_features.iloc[:split_idx]
    test = df_features.iloc[split_idx:]
    
    X_train, y_train = train[features], train[target_col]
    X_test, y_test = test[features], test[target_col]
    
    print(f"Training on {len(X_train)} days, testing on {len(X_test)} days.")
    
    model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    
    y_test_safe = np.where(y_test == 0, 1e-10, y_test)
    mape = np.mean(np.abs((y_test - preds) / y_test_safe)) * 100
    
    print(f"--- {base}-{target} Results ---")
    print(f"MAE:  {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAPE: {mape:.2f}%\n")
    
    model_path = f"models/xgb_{base}_{target}.joblib"
    joblib.dump(model, model_path)
    joblib.dump(features, f"models/xgb_{base}_{target}_features.joblib")
    
    metrics = {"mae": float(mae), "rmse": float(rmse), "mape": float(mape)}
    joblib.dump(metrics, f"models/xgb_{base}_{target}_metrics.joblib")
    
    return metrics

if __name__ == "__main__":
    for pair in SUPPORTED_PAIRS:
        train_and_evaluate(pair)
