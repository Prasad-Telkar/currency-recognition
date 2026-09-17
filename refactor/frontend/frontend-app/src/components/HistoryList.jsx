import { useTranslation } from "react-i18next";
import { History as HistoryIcon, Search, Download, Trash2, X } from "lucide-react";
import { CURRENCIES } from "../data/currencies";

export default function HistoryList({ history }) {
  const { t } = useTranslation();
  const { entries, rawCount, query, setQuery, sortBy, setSortBy, removeEntry, clearHistory, exportCsv } = history;

  return (
    <section className="page-section">
      <div className="section-heading">
        <span><HistoryIcon size={20} /></span>
        <div>
          <h2>{t("history.title")}</h2>
          <p>{t("history.subtitle")}</p>
        </div>
      </div>

      {rawCount > 0 && (
        <div className="history-toolbar">
          <div className="history-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("history.search")}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="history-sort">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="confidence">Highest confidence</option>
          </select>

          <button className="history-toolbar-btn" onClick={exportCsv}>
            <Download size={15} />
            {t("history.export")}
          </button>

          <button className="history-toolbar-btn danger" onClick={clearHistory}>
            <Trash2 size={15} />
            {t("history.clear")}
          </button>
        </div>
      )}

      {rawCount === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><HistoryIcon size={30} /></div>
          <h3>{t("history.empty")}</h3>
          <p>{t("history.emptyHint")}</p>
        </div>
      ) : (
        <div className="history-list">
          {entries.map((item) => {
            const currency = CURRENCIES[item.country];
            return (
              <div className="history-card" key={item.id}>
                <div className="history-icon">{currency?.symbol || "?"}</div>
                <div className="history-info">
                  <strong>{currency?.symbol}{item.denomination} {item.country}</strong>
                  <span>{item.date} · {item.time}</span>
                </div>
                <div className="history-confidence">{item.confidence}%</div>
                <button className="history-remove" onClick={() => removeEntry(item.id)} aria-label="Remove entry">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
