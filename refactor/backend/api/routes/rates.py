from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import logging

rates_bp = Blueprint('rates', __name__)
logger = logging.getLogger(__name__)

@rates_bp.route("/history", methods=["GET"])
def get_historical_rates():
    base = request.args.get("base", "USD").upper()
    target = request.args.get("target", "INR").upper()
    days = int(request.args.get("days", 30))

    # Always generate a dummy flat line if yfinance is missing or if base == target
    def generate_dummy_data():
        data = []
        for i in range(days):
            d = (datetime.now() - timedelta(days=(days - i - 1))).strftime("%m/%d")
            data.append({"date": d, "rate": 1.0 if base == target else 83.5}) # Dummy rate for INR
        return jsonify({"success": True, "history": data})

    if base == target:
        return generate_dummy_data()

    period = "1mo" if days <= 30 else ("3mo" if days <= 90 else "1y")

    try:
        import yfinance as yf
        # 1. Try direct pair
        ticker_sym = f"{base}{target}=X"
        ticker = yf.Ticker(ticker_sym)
        hist = ticker.history(period=period)
        
        if hist.empty:
            # 2. Try inverted pair
            ticker_sym = f"{target}{base}=X"
            ticker = yf.Ticker(ticker_sym)
            hist = ticker.history(period=period)
            if not hist.empty:
                hist['Close'] = 1 / hist['Close']
            else:
                # 3. Fallback to Cross Rate via USD
                usd_base = yf.Ticker(f"USD{base}=X").history(period=period)
                usd_target = yf.Ticker(f"USD{target}=X").history(period=period)
                
                # Some might be quoted the other way, like EURUSD=X instead of USDEUR=X
                if usd_base.empty and base != "USD":
                    inv = yf.Ticker(f"{base}USD=X").history(period=period)
                    if not inv.empty:
                        usd_base = inv
                        usd_base['Close'] = 1 / usd_base['Close']
                        
                if usd_target.empty and target != "USD":
                    inv = yf.Ticker(f"{target}USD=X").history(period=period)
                    if not inv.empty:
                        usd_target = inv
                        usd_target['Close'] = 1 / usd_target['Close']

                if not usd_base.empty and not usd_target.empty:
                    # Cross rate calculation: (USD -> TARGET) / (USD -> BASE)
                    # For example, if USD->INR is 84 and USD->EGP is 48
                    # 1 INR = 48/84 = 0.57 EGP
                    hist = (usd_target['Close'] / usd_base['Close']).to_frame(name='Close').dropna()
                else:
                    return generate_dummy_data()

        # Take the last 'days' rows
        hist = hist.tail(days)
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%m/%d"),
                "rate": round(row['Close'], 4)
            })
            
        return jsonify({"success": True, "history": data})
    except ImportError:
        logger.warning("yfinance is not installed. Returning dummy historical rates.")
        return generate_dummy_data()
    except Exception as e:
        logger.error(f"Failed to fetch historical rates for {base}/{target}: {e}")
        return generate_dummy_data()

@rates_bp.route("/forecast", methods=["GET"])
def get_forecast():
    """
    Returns real historical data up to today, and generates a forecast 
    using Gemini AI and live market news.
    """
    base = request.args.get("from", "USD").upper()
    target = request.args.get("to", "INR").upper()
    horizon = int(request.args.get("days", 30))

    def generate_error_or_dummy_response(msg="Model preparation in progress"):
        # We still try to return a valid shape, but with an error message or flag
        return jsonify({
            "success": False,
            "message": msg,
            "base": base,
            "quote": target,
            "horizon": horizon,
            "currentRate": 1.0 if base == target else None,
            "predictedRate": None,
            "changePercent": None,
            "historical": [],
            "forecast": [],
            "model": "Not Available (In Preparation)"
        })

    if base == target:
        return jsonify({
            "success": True,
            "base": base,
            "quote": target,
            "horizon": horizon,
            "currentRate": 1.0,
            "predictedRate": 1.0,
            "changePercent": 0.0,
            "historical": [{"date": datetime.now().strftime("%m/%d"), "rate": 1.0}],
            "forecast": [],
            "model": "Not Available"
        })

    # Fetch 90 days of history to have a good chart
    historical_days = 90
    period = "3mo" if historical_days <= 90 else "1y"

    try:
        import yfinance as yf
        ticker_sym = f"{base}{target}=X"
        ticker = yf.Ticker(ticker_sym)
        hist = ticker.history(period=period)
        
        if hist.empty:
            ticker_sym = f"{target}{base}=X"
            ticker = yf.Ticker(ticker_sym)
            hist = ticker.history(period=period)
            if not hist.empty:
                hist['Close'] = 1 / hist['Close']
            else:
                usd_base = yf.Ticker(f"USD{base}=X").history(period=period)
                usd_target = yf.Ticker(f"USD{target}=X").history(period=period)
                
                if usd_base.empty and base != "USD":
                    inv = yf.Ticker(f"{base}USD=X").history(period=period)
                    if not inv.empty:
                        usd_base = inv
                        usd_base['Close'] = 1 / usd_base['Close']
                        
                if usd_target.empty and target != "USD":
                    inv = yf.Ticker(f"{target}USD=X").history(period=period)
                    if not inv.empty:
                        usd_target = inv
                        usd_target['Close'] = 1 / usd_target['Close']

                if not usd_base.empty and not usd_target.empty:
                    hist = (usd_target['Close'] / usd_base['Close']).to_frame(name='Close').dropna()
                else:
                    return generate_error_or_dummy_response("No historical data available for this pair")

        hist = hist.tail(historical_days)
        
        historical_data = []
        for date, row in hist.iterrows():
            historical_data.append({
                "date": date.strftime("%m/%d"),
                "rate": round(row['Close'], 4)
            })
            
        current_rate = historical_data[-1]["rate"] if historical_data else 0.0

        # Generate AI forecast
        from services.forecast_service import generate_ai_forecast
        ai_forecast_data = generate_ai_forecast(base, target, horizon, historical_data)

        if ai_forecast_data:
            return jsonify({
                "success": True,
                "base": base,
                "quote": target,
                "horizon": horizon,
                "currentRate": current_rate,
                "predictedRate": round(ai_forecast_data.get("predictedRate", 0), 4),
                "changePercent": round(ai_forecast_data.get("changePercent", 0), 2),
                "historical": historical_data,
                "forecast": ai_forecast_data.get("forecast", []),
                "model": "Gemini 3.5 Flash + Live Market News",
                "insights": ai_forecast_data.get("model_insights", "Forecast generated based on current trends.")
            })
        else:
            return jsonify({
                "success": True,
                "base": base,
                "quote": target,
                "horizon": horizon,
                "currentRate": current_rate,
                "predictedRate": None, # Indicates model is not available
                "changePercent": None,
                "historical": historical_data,
                "forecast": [], # Real model would populate this
                "model": "Failed to generate AI forecast",
                "insights": None
            })
            
    except ImportError:
        return generate_error_or_dummy_response("yfinance is not installed.")
    except Exception as e:
        logger.error(f"Failed to fetch forecast history for {base}/{target}: {e}")
        return generate_error_or_dummy_response(str(e))

@rates_bp.route("/predict", methods=["GET"])
def get_predict():
    """
    New forecasting endpoint using XGBoost.
    """
    base_currency = request.args.get('from', 'USD').upper()
    target_currency = request.args.get('to', 'EUR').upper()
    days_to_predict = int(request.args.get('days', 30))

    try:
        from services.xgboost_service import predict_future
        prediction = predict_future(base_currency, target_currency, days_to_predict)
        if not prediction.get("success"):
            return jsonify(prediction), 400
            
        return jsonify(prediction)
        
    except Exception as e:
        logger.error(f"Error in XGBoost predict: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to generate prediction."
        }), 500

