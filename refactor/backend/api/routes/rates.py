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
