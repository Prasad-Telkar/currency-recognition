import { useMemo, useState, useEffect } from "react";
import { fetchHistory, saveHistoryEntry, deleteHistoryEntry, clearAllHistory } from "../../services/api";

const STORAGE_KEY = "currencyai_history";

export function useHistory() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | confidence
  
  // Load initially from API, fallback to localStorage on error
  useEffect(() => {
    let mounted = true;
    
    // First paint: try local storage immediately for speed
    try {
      const saved = window.localStorage?.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    } catch {
      // ignore
    }
    
    // Then load fresh from DB
    const loadDb = async () => {
      const dbEntries = await fetchHistory();
      if (mounted && dbEntries.length > 0) {
        setEntries(dbEntries);
        try {
          window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(dbEntries));
        } catch {}
      }
    };
    loadDb();
    
    return () => { mounted = false; };
  }, []);

  const addEntry = async (prediction) => {
    // Optimistic UI update
    const tempEntry = {
      id: Date.now(),
      country: prediction.country,
      currencyCode: prediction.currencyCode,
      currencyName: prediction.currencyName,
      currencySymbol: prediction.currencySymbol,
      denomination: prediction.denomination,
      confidence: prediction.confidence,
      confidenceLevel: prediction.confidenceLevel,
      imageAnalysis: prediction.imageAnalysis,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };
    
    setEntries((prev) => [tempEntry, ...prev]);
    
    // Persist to DB
    const savedEntry = await saveHistoryEntry(prediction);
    
    // Update with real ID from DB
    setEntries((prev) => {
      const updated = prev.map(e => e.id === tempEntry.id ? savedEntry : e);
      try {
        window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeEntry = async (id) => {
    setEntries((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      try {
        window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Persist removal
    await deleteHistoryEntry(id);
  };

  const clearHistory = async () => {
    setEntries([]);
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
    await clearAllHistory();
  };

  const filtered = useMemo(() => {
    let list = entries;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.country?.toLowerCase().includes(q) ||
          e.currencyCode?.toLowerCase().includes(q) ||
          String(e.denomination).includes(q)
      );
    }
    const sorted = [...list];
    if (sortBy === "oldest") sorted.reverse();
    if (sortBy === "confidence") sorted.sort((a, b) => b.confidence - a.confidence);
    return sorted;
  }, [entries, query, sortBy]);

  const exportCsv = () => {
    const header = "Country,Currency Code,Denomination,Confidence,Date,Time\n";
    const rows = entries
      .map((e) => `${e.country},${e.currencyCode || ""},${e.denomination},${e.confidence},${e.date},${e.time}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "currencyai-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    entries: filtered,
    rawCount: entries.length,
    query,
    setQuery,
    sortBy,
    setSortBy,
    addEntry,
    removeEntry,
    clearHistory,
    exportCsv,
  };
}
