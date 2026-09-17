import { useCallback, useState } from "react";
import { convertCurrency, ApiError } from "../../services/api";

export function useConversion(defaultTarget = "INR", defaultBase = "USD") {
  const [baseCurrency, setBaseCurrency] = useState(defaultBase);
  const [targetCurrency, setTargetCurrency] = useState(defaultTarget);
  const [amount, setAmount] = useState(100);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rate, setRate] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const runConversion = useCallback(async (customAmount, fromCode, toCode) => {
    const amt = customAmount !== undefined ? customAmount : amount;
    const from = (fromCode || baseCurrency || "USD").toUpperCase();
    const to = (toCode || targetCurrency || "INR").toUpperCase();

    if (amt === undefined || amt === null || amt === "" || isNaN(amt)) {
      setConvertedAmount(null);
      return;
    }

    setConverting(true);
    setError(null);
    try {
      const data = await convertCurrency(amt, from, to);
      const res = data.rates?.[to];
      setConvertedAmount(res !== undefined ? res : null);
      setRate(data.rate || (res !== undefined ? res / (Number(amt) || 1) : null));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setConvertedAmount(null);
      setError(err instanceof ApiError ? err.message : "Conversion failed.");
    } finally {
      setConverting(false);
    }
  }, [amount, baseCurrency, targetCurrency]);

  const changeTargetCurrency = (newTarget, customAmount, fromCode) => {
    setTargetCurrency(newTarget);
    const amt = customAmount !== undefined ? customAmount : amount;
    const from = fromCode || baseCurrency;
    if (amt && from) {
      runConversion(amt, from, newTarget);
    }
  };

  const changeBaseCurrency = (newBase, customAmount, toCode) => {
    setBaseCurrency(newBase);
    const amt = customAmount !== undefined ? customAmount : amount;
    const to = toCode || targetCurrency;
    if (amt && to) {
      runConversion(amt, newBase, to);
    }
  };

  const swapCurrencies = (customAmount) => {
    const prevBase = baseCurrency;
    const prevTarget = targetCurrency;
    setBaseCurrency(prevTarget);
    setTargetCurrency(prevBase);
    const amt = customAmount !== undefined ? customAmount : amount;
    runConversion(amt, prevTarget, prevBase);
  };

  const reset = () => {
    setConvertedAmount(null);
    setRate(null);
    setError(null);
  };

  return {
    baseCurrency, setBaseCurrency,
    targetCurrency, setTargetCurrency,
    amount, setAmount,
    convertedAmount, rate, converting, error, lastUpdated,
    runConversion, changeTargetCurrency, changeBaseCurrency, swapCurrencies, reset,
  };
}
