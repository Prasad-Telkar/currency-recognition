import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, RefreshCw } from "lucide-react";
import { TARGET_CURRENCIES } from "../data/currencies";

export default function ConverterCard({ result, conversion, onOpenFullConverter }) {
  const { t } = useTranslation();
  const { targetCurrency, convertedAmount, converting, rate, runConversion, changeTargetCurrency } = conversion;
  const [prevDenomination, setPrevDenomination] = useState(result?.denomination);
  const [customAmount, setCustomAmount] = useState(result?.denomination || 100);

  if (result?.denomination !== prevDenomination) {
    setPrevDenomination(result?.denomination);
    setCustomAmount(result?.denomination || 100);
  }

  useEffect(() => {
    if (result?.currencyCode && result?.denomination) {
      runConversion(result.denomination, result.currencyCode, targetCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.currencyCode, result?.denomination]);

  if (!result) return null;

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setCustomAmount(val);
      if (val && !isNaN(val)) {
        runConversion(Number(val), result.currencyCode, targetCurrency);
      }
    }
  };

  return (
    <div className="converter-card">
      <div className="converter-header-top">
        <div className="converter-title">
          <span>💱</span>
          <div>
            <h3>{t("converter.title")}</h3>
            <p>{t("converter.subtitle")}</p>
          </div>
        </div>

        {onOpenFullConverter && (
          <button
            type="button"
            className="open-full-converter-btn"
            onClick={() => onOpenFullConverter(customAmount, result.currencyCode, targetCurrency)}
          >
            <ExternalLink size={14} />
            {t("converter.openFull")}
          </button>
        )}
      </div>

      <div className="converter-row">
        <div className="amount-box">
          <label htmlFor="card-amount-input">{t("converter.amount")}</label>
          <div className="amount-input-wrap">
            <span>{result.currencySymbol}</span>
            <input
              id="card-amount-input"
              type="text"
              inputMode="decimal"
              value={customAmount}
              onChange={handleAmountChange}
              placeholder={String(result.denomination)}
            />
          </div>
          <small>{result.currencyCode}</small>
        </div>

        <div className="arrow">→</div>

        <div className="target-box">
          <label htmlFor="card-target-select">{t("converter.convertTo")}</label>
          <select
            id="card-target-select"
            value={targetCurrency}
            onChange={(e) => changeTargetCurrency(e.target.value, customAmount, result.currencyCode)}
          >
            {TARGET_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <small>
            {converting ? (
              <span className="flex-center-gap"><RefreshCw size={10} className="spin" /> {t("converter.fetching")}</span>
            ) : rate ? (
              `1 ${result.currencyCode} = ${rate.toFixed(3)} ${targetCurrency}`
            ) : (
              t("converter.liveRate")
            )}
          </small>
        </div>

        <div className="converted-result">
          <span>{t("converter.convertedValue")}</span>
          <strong>{convertedAmount !== null ? `${convertedAmount.toFixed(2)} ${targetCurrency}` : "--"}</strong>
          {customAmount && result.denomination && Number(customAmount) !== Number(result.denomination) && (
            <small className="note-count-hint">
              ({(Number(customAmount) / Number(result.denomination)).toFixed(1)}x {result.denomination} {result.currencyCode})
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
