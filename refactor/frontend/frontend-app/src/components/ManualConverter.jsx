import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftRight,
  TrendingUp,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  Table,
} from "lucide-react";
import { CONVERTIBLE_CURRENCIES } from "../data/currencies";

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000, 5000];

const POPULAR_PAIRS = [
  { from: "USD", to: "INR" },
  { from: "EUR", to: "USD" },
  { from: "GBP", to: "USD" },
  { from: "USD", to: "JPY" },
  { from: "USD", to: "AED" },
  { from: "EUR", to: "INR" },
  { from: "USD", to: "CAD" },
  { from: "AUD", to: "USD" },
];

const TABLE_AMOUNTS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

export default function ManualConverter({ conversion, initialFrom, initialAmount }) {
  const { t } = useTranslation();
  const {
    baseCurrency,
    setBaseCurrency,
    targetCurrency,
    setTargetCurrency,
    amount,
    setAmount,
    convertedAmount,
    rate,
    converting,
    error,
    lastUpdated,
    runConversion,
    swapCurrencies,
  } = conversion;

  const [copied, setCopied] = useState(false);

  // Initialize with passed props if provided
  useEffect(() => {
    if (initialFrom) setBaseCurrency(initialFrom);
    if (initialAmount) setAmount(initialAmount);
    runConversion(initialAmount || amount, initialFrom || baseCurrency, targetCurrency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
      if (val && !isNaN(val)) {
        runConversion(Number(val), baseCurrency, targetCurrency);
      }
    }
  };

  const handleBaseChange = (newBase) => {
    setBaseCurrency(newBase);
    runConversion(amount, newBase, targetCurrency);
  };

  const handleTargetChange = (newTarget) => {
    setTargetCurrency(newTarget);
    runConversion(amount, baseCurrency, newTarget);
  };

  const handlePresetClick = (preset) => {
    setAmount(preset);
    runConversion(preset, baseCurrency, targetCurrency);
  };

  const handlePairClick = (from, to) => {
    setBaseCurrency(from);
    setTargetCurrency(to);
    runConversion(amount, from, to);
  };

  const handleCopy = () => {
    if (convertedAmount !== null) {
      const text = `${amount} ${baseCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}`;
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fromInfo = CONVERTIBLE_CURRENCIES.find((c) => c.code === baseCurrency) || {
    code: baseCurrency,
    symbol: baseCurrency,
    name: baseCurrency,
    flag: "🌐",
  };

  const toInfo = CONVERTIBLE_CURRENCIES.find((c) => c.code === targetCurrency) || {
    code: targetCurrency,
    symbol: targetCurrency,
    name: targetCurrency,
    flag: "🌐",
  };

  const inverseRate = rate && rate > 0 ? (1 / rate).toFixed(4) : null;

  return (
    <section className="page-section manual-converter-section">
      <div className="section-heading">
        <span><ArrowLeftRight size={22} /></span>
        <div>
          <h2>{t("converter.manualTitle")}</h2>
          <p>{t("converter.manualSubtitle")}</p>
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="manual-converter-card glass-panel">
        {/* Popular Pairs Chips */}
        <div className="popular-pairs-container">
          <span className="popular-pairs-label">{t("converter.popularPairs")}:</span>
          <div className="popular-pairs-list">
            {POPULAR_PAIRS.map((pair) => (
              <button
                key={`${pair.from}-${pair.to}`}
                type="button"
                className={`pair-chip ${baseCurrency === pair.from && targetCurrency === pair.to ? "active" : ""}`}
                onClick={() => handlePairClick(pair.from, pair.to)}
              >
                {pair.from} → {pair.to}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="manual-converter-grid">
          {/* Amount input */}
          <div className="input-group amount-group">
            <label htmlFor="manual-amount">{t("converter.amount")}</label>
            <div className="input-with-prefix">
              <span className="input-prefix">{fromInfo.symbol}</span>
              <input
                id="manual-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
              />
            </div>
            {/* Quick Presets */}
            <div className="amount-presets">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${Number(amount) === preset ? "active" : ""}`}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* From Currency Selector */}
          <div className="input-group currency-select-group">
            <label htmlFor="from-currency">{t("converter.from")}</label>
            <div className="select-wrapper">
              <span className="currency-flag">{fromInfo.flag}</span>
              <select
                id="from-currency"
                value={baseCurrency}
                onChange={(e) => handleBaseChange(e.target.value)}
              >
                {CONVERTIBLE_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="swap-button-wrapper">
            <button
              type="button"
              className="swap-button"
              onClick={() => swapCurrencies(amount)}
              title={t("converter.swap")}
              aria-label={t("converter.swap")}
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* To Currency Selector */}
          <div className="input-group currency-select-group">
            <label htmlFor="to-currency">{t("converter.to")}</label>
            <div className="select-wrapper">
              <span className="currency-flag">{toInfo.flag}</span>
              <select
                id="to-currency"
                value={targetCurrency}
                onChange={(e) => handleTargetChange(e.target.value)}
              >
                {CONVERTIBLE_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversion Result Hero Display */}
        <div className="manual-result-display">
          <div className="result-header-row">
            <span className="result-caption">
              {amount || 0} {fromInfo.name} =
            </span>
            {lastUpdated && (
              <span className="live-badge">
                <span className="live-dot" />
                {t("converter.liveRate")} · {lastUpdated}
              </span>
            )}
          </div>

          <div className="result-value-row">
            <div className="big-converted-amount">
              {converting ? (
                <span className="converting-shimmer">{t("converter.fetching")}</span>
              ) : convertedAmount !== null ? (
                <>
                  <span className="result-currency-symbol">{toInfo.symbol}</span>
                  <strong>{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  <span className="result-currency-code">{targetCurrency}</span>
                </>
              ) : (
                <span className="result-dash">--</span>
              )}
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="action-icon-btn copy-btn"
                onClick={handleCopy}
                disabled={convertedAmount === null}
                title={t("converter.copy")}
              >
                {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
                <span>{copied ? t("converter.copied") : t("converter.copy")}</span>
              </button>

              <button
                type="button"
                className="action-icon-btn refresh-btn"
                onClick={() => runConversion(amount, baseCurrency, targetCurrency)}
                disabled={converting}
                title="Refresh rate"
              >
                <RefreshCw size={18} className={converting ? "spin" : ""} />
              </button>
            </div>
          </div>

          {/* Rate and Inverse Rate Strip */}
          {rate && (
            <div className="rate-details-strip">
              <div className="rate-item">
                <TrendingUp size={15} />
                <span>
                  1 {baseCurrency} = <strong>{rate.toFixed(4)} {targetCurrency}</strong>
                </span>
              </div>
              {inverseRate && (
                <div className="rate-item">
                  <RotateCcw size={15} />
                  <span>
                    1 {targetCurrency} = <strong>{inverseRate} {baseCurrency}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="conversion-error-alert">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Quick Conversion Reference Table */}
      {rate && (
        <div className="quick-table-card glass-panel">
          <div className="quick-table-header">
            <Table size={18} />
            <h3>{t("converter.quickTable")} ({baseCurrency} to {targetCurrency})</h3>
          </div>
          <div className="quick-table-grid">
            <div className="table-column">
              <h4>{fromInfo.name} ({baseCurrency})</h4>
              {TABLE_AMOUNTS.slice(0, 5).map((amt) => (
                <div key={amt} className="table-row">
                  <span>{fromInfo.symbol}{amt} {baseCurrency}</span>
                  <strong>{toInfo.symbol}{(amt * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetCurrency}</strong>
                </div>
              ))}
            </div>
            <div className="table-column">
              <h4>{fromInfo.name} ({baseCurrency})</h4>
              {TABLE_AMOUNTS.slice(5).map((amt) => (
                <div key={amt} className="table-row">
                  <span>{fromInfo.symbol}{amt} {baseCurrency}</span>
                  <strong>{toInfo.symbol}{(amt * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetCurrency}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
