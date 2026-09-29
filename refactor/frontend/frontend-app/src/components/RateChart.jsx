import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import './RateChart.css';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 }
];

export default function RateChart({ sourceCurrency, targetCurrency }) {
  const [timeRange, setTimeRange] = useState('1M');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistoricalData() {
      if (!sourceCurrency || !targetCurrency) return;
      
      if (sourceCurrency === targetCurrency) {
        // Mock a flat line for identical currencies
        const mockData = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toISOString().split('T')[0],
            rate: 1.0,
            displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          };
        });
        if (isMounted) {
          setData(mockData);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const rangeItem = RANGES.find(r => r.label === timeRange) || RANGES[1];
        let formattedData = null;
        
        // 1. Try Twelve Data (Primary)
        const twelveDataKey = import.meta.env.VITE_TWELVEDATA_API_KEY;
        if (twelveDataKey) {
          try {
            const tdRes = await fetch(`https://api.twelvedata.com/time_series?symbol=${sourceCurrency}/${targetCurrency}&interval=1day&outputsize=${rangeItem.days}&apikey=${twelveDataKey}`);
            const tdJson = await tdRes.json();
            
            if (tdJson.status === "ok" && tdJson.values && tdJson.values.length > 0) {
              // Twelve data returns newest first, so we reverse it for the chart
              const sortedValues = [...tdJson.values].reverse();
              formattedData = sortedValues.map(item => {
                const d = new Date(item.datetime);
                return {
                  date: item.datetime,
                  rate: parseFloat(item.close),
                  displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                };
              });
            } else {
              console.warn("Twelve Data API issue:", tdJson.message || "Unknown error, falling back...");
            }
          } catch (e) {
            console.warn("Twelve Data fetch failed, falling back to Frankfurter...", e);
          }
        } else {
          console.warn("VITE_TWELVEDATA_API_KEY not found in .env, skipping Twelve Data and using Frankfurter...");
        }

        // 2. Fallback to Frankfurter
        if (!formattedData) {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - rangeItem.days);

          const endDateStr = end.toISOString().split('T')[0];
          const startDateStr = start.toISOString().split('T')[0];

          const res = await fetch(`https://api.frankfurter.dev/v1/${startDateStr}..${endDateStr}?from=${sourceCurrency}&to=${targetCurrency}`);
          
          if (!res.ok) {
            throw new Error('Failed to fetch market data from fallback API');
          }

          const json = await res.json();
          
          if (!json.rates || Object.keys(json.rates).length === 0) {
            throw new Error('No historical data available');
          }

          formattedData = Object.keys(json.rates).map(dateStr => {
            const d = new Date(dateStr);
            return {
              date: dateStr,
              rate: json.rates[dateStr][targetCurrency],
              displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            };
          });
        }

        if (isMounted) {
          setData(formattedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("RateChart API Error:", err);
          setError("Unable to load market data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHistoricalData();

    return () => {
      isMounted = false;
    };
  }, [sourceCurrency, targetCurrency, timeRange, retryCount]);

  const { currentRate, percentChange, isPositive } = useMemo(() => {
    if (!data || data.length < 2) return { currentRate: null, percentChange: 0, isPositive: true };
    
    const latest = data[data.length - 1].rate;
    // We compare with the first data point of the selected range to give the change over that period
    const oldest = data[0].rate;
    
    const change = latest - oldest;
    const percent = (change / oldest) * 100;
    
    return {
      currentRate: latest.toFixed(4),
      percentChange: Math.abs(percent).toFixed(2),
      isPositive: percent >= 0
    };
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { displayDate, rate } = payload[0].payload;
      return (
        <div className="rate-chart-tooltip">
          <p className="rate-chart-tooltip-date">{displayDate}</p>
          <p className="rate-chart-tooltip-value">
            1 {sourceCurrency} = {rate} {targetCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rate-chart-container animate-fade-in">
      <div className="rate-chart-header">
        <div className="rate-chart-title-area">
          <h4 className="rate-chart-title">MARKET DATA</h4>
          <div className="rate-chart-pair">
            {sourceCurrency} &rarr; {targetCurrency}
          </div>
          <div className="rate-chart-subtitle">
            Historical exchange rate &middot; {timeRange}
          </div>
        </div>
        
        <div className="rate-chart-stats">
          {error ? (
            <div className="rate-chart-error-container">
              <span className="rate-chart-error">{error}</span>
              <button 
                className="rate-chart-retry-btn" 
                onClick={() => setRetryCount(prev => prev + 1)}
              >
                Reload
              </button>
            </div>
          ) : loading && !currentRate ? (
            <div className="rate-chart-loading-text">Loading...</div>
          ) : currentRate ? (
            <>
              <div className="rate-chart-current">
                Current rate
              </div>
              <div className="rate-chart-current-value">
                {currentRate}
              </div>
              <div className={`rate-chart-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↑' : '↓'} {percentChange}%
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="rate-chart-controls">
        {RANGES.map(r => (
          <button 
            key={r.label}
            className={`rate-chart-range-btn ${timeRange === r.label ? 'active' : ''}`}
            onClick={() => setTimeRange(r.label)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="rate-chart-graph-wrapper">
        {loading && <div className="rate-chart-loader-overlay"><div className="rate-chart-spinner"></div></div>}
        
        {!error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8b96a5', fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8b96a5', fontSize: 11 }}
                width={45}
                orientation="right"
                tickFormatter={(value) => value.toFixed(3)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRate)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
