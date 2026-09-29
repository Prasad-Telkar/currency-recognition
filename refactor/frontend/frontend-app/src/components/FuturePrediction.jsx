import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, RefreshCw, BarChart2, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CONVERTIBLE_CURRENCIES } from '../data/currencies';
import { fetchForecast } from '../services/api';
import './FuturePrediction.css';

export default function FuturePrediction() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [horizon, setHorizon] = useState(30);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchPrediction = async (base, target, days) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchForecast(base, target, days);
      if (result.success) {
        setData(result);
      } else {
        // Even if success is false, we might have historical data but no model.
        // We'll store it but mark an error.
        setData(result);
        setError(result.message || "Unable to generate forecast.");
      }
    } catch (err) {
      setError("Failed to connect to the prediction service.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(baseCurrency, targetCurrency, horizon);
  }, [baseCurrency, targetCurrency, horizon]);

  const handleRetry = () => {
    fetchPrediction(baseCurrency, targetCurrency, horizon);
  };

  const getCombinedChartData = () => {
    if (!data) return [];
    
    // Process historical
    const combined = (data.historical || []).map(item => ({
      date: item.date,
      historical: item.rate,
      forecast: null
    }));
    
    // In a real scenario, we would append forecast data. 
    // Since we don't have it, we just return historical.
    // If we did have it, we'd add it here.
    if (data.forecast && data.forecast.length > 0) {
       // Append forecast points
       data.forecast.forEach(item => {
         combined.push({
           date: item.date,
           historical: null,
           forecast: item.rate
         });
       });
    }
    
    return combined;
  };

  const chartData = getCombinedChartData();
  const todayDate = data && data.historical && data.historical.length > 0 
    ? data.historical[data.historical.length - 1].date 
    : null;

  return (
    <div className="future-prediction-page">
      <div className="prediction-header">
        <div className="header-icon">
          <TrendingUp size={32} />
        </div>
        <h1>Future Prediction</h1>
        <p>Forecast currency exchange rates using advanced AI models.</p>
      </div>

      <div className="prediction-controls glass-panel">
        <div className="control-group">
          <label>From</label>
          <select 
            value={baseCurrency} 
            onChange={(e) => setBaseCurrency(e.target.value)}
            disabled={loading}
          >
            {CONVERTIBLE_CURRENCIES.map(c => (
              <option key={`from-${c.code}`} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>To</label>
          <select 
            value={targetCurrency} 
            onChange={(e) => setTargetCurrency(e.target.value)}
            disabled={loading}
          >
            {CONVERTIBLE_CURRENCIES.map(c => (
              <option key={`to-${c.code}`} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>

        <div className="control-group horizon-group">
          <label>Horizon</label>
          <div className="horizon-buttons">
            {[7, 30, 90].map(days => (
              <button 
                key={days}
                className={`horizon-btn ${horizon === days ? 'active' : ''}`}
                onClick={() => setHorizon(days)}
                disabled={loading}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="pulse-circle">
            <RefreshCw size={40} className="pulse-icon spin" />
          </div>
          <h3>Generating forecast...</h3>
          <p>Analyzing historical data and running predictive models.</p>
        </div>
      )}

      {!loading && error && !data?.historical?.length && (
        <div className="error-state">
          <AlertCircle size={48} className="error-icon" />
          <h3>Unable to generate forecast.</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && data && data.historical && data.historical.length > 0 && (
        <div className="prediction-results">
          
          <div className="summary-cards">
            <div className="summary-card glass-panel">
              <span className="card-label">Current Rate</span>
              <div className="card-value">
                1 {baseCurrency} = {data.currentRate ? data.currentRate.toFixed(4) : '--'} {targetCurrency}
              </div>
            </div>
            <div className="summary-card glass-panel">
              <span className="card-label">Predicted Rate</span>
              <div className="card-value">
                {data.predictedRate 
                  ? `1 ${baseCurrency} ≈ ${data.predictedRate.toFixed(4)} ${targetCurrency}` 
                  : 'N/A'}
              </div>
            </div>
            <div className="summary-card glass-panel">
              <span className="card-label">Expected Change</span>
              <div className={`card-value ${data.changePercent > 0 ? 'positive' : data.changePercent < 0 ? 'negative' : ''}`}>
                {data.changePercent !== null && data.changePercent !== undefined
                  ? `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`
                  : '--'}
              </div>
            </div>
            <div className="summary-card glass-panel">
              <span className="card-label">Forecast Period</span>
              <div className="card-value">
                {horizon} Days
              </div>
            </div>
          </div>

          <div className="chart-container glass-panel">
            <div className="chart-header">
              <h3><BarChart2 size={20} /> Exchange Rate Trend & Forecast</h3>
              {error && (
                <div className="chart-notice">
                  <Info size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="chart-wrapper" style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(val) => val.toFixed(4)}
                    width={80}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#0ea5e9' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  />
                  
                  {todayDate && (
                    <ReferenceLine x={todayDate} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'TODAY', fill: '#94a3b8', fontSize: 12 }} />
                  )}

                  <Line 
                    type="monotone" 
                    dataKey="historical" 
                    name="Historical"
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Forecast"
                    stroke="#a855f7" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="model-info glass-panel">
            <h3><Activity size={20} /> Prediction Insights</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Model Used</span>
                <span className="info-value">{data.model || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Historical Data</span>
                <span className="info-value">90 Days</span>
              </div>
              <div className="info-item">
                <span className="info-label">Forecast Horizon</span>
                <span className="info-value">{horizon} Days</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">
                  {data.predictedRate ? "Live Prediction" : "Awaiting Model Integration"}
                </span>
              </div>
            </div>
            {data.insights && (
              <div className="insights-text-container" style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Market Analysis</span>
                <p style={{ margin: 0, color: '#f1f5f9', fontSize: '14px', lineHeight: '1.6' }}>{data.insights}</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
