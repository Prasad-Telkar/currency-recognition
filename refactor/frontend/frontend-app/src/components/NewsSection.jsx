import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Newspaper, ExternalLink, Loader2, X, TrendingUp, TrendingDown, Activity, Sparkles } from "lucide-react";
import { fetchFinancialNews } from "../services/api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"
];

export default function NewsSection() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadNews = async () => {
      setLoading(true);
      const items = await fetchFinancialNews();
      if (mounted) {
        // Mock some AI insights for the MVP based on the title
        const enhancedItems = items.map((item, index) => {
          const isBullish = item.title.toLowerCase().includes("up") || item.title.toLowerCase().includes("gain") || item.title.toLowerCase().includes("high") || item.title.toLowerCase().includes("rise");
          const isBearish = item.title.toLowerCase().includes("down") || item.title.toLowerCase().includes("drop") || item.title.toLowerCase().includes("low") || item.title.toLowerCase().includes("fall") || item.title.toLowerCase().includes("decline") || item.title.toLowerCase().includes("weaken");
          
          let sentiment = "Neutral";
          if (isBullish) sentiment = "Bullish";
          if (isBearish) sentiment = "Bearish";
          
          const impactScore = (Math.random() * 4 + 5).toFixed(1); // 5.0 to 9.0
          const imageUrl = item.image_url || item.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
          
          return {
            ...item,
            sentiment,
            impactScore,
            imageUrl,
            aiSummary: `This article discusses recent developments regarding ${item.title.split(' ').slice(0, 5).join(' ')}... The broader implications suggest a ${sentiment.toLowerCase()} trend for affected currency pairs.`
          };
        });
        
        setNews(enhancedItems);
        setLoading(false);
      }
    };
    loadNews();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <span><Newspaper size={20} /></span>
        <div>
          <h2>{t("news.title", "Market Intelligence")}</h2>
          <p>{t("news.subtitle", "Latest financial and currency market headlines")}</p>
        </div>
      </div>

      {loading ? (
        <div className="news-feed">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="news-card glass-panel has-image skeleton">
              <div className="news-card-image-wrapper skeleton-image" />
              <div className="news-card-body">
                <div className="skeleton-text short" />
                <div className="skeleton-text title" />
                <div className="skeleton-text" />
                <div className="skeleton-text" />
                <div className="news-impact-metrics">
                  <div className="skeleton-tag" />
                  <div className="skeleton-tag" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Newspaper size={30} /></div>
          <h3>{t("news.empty", "No news found")}</h3>
          <p>{t("news.emptyHint", "Try checking back later.")}</p>
        </div>
      ) : (
        <div className="news-feed">
          {news.map((item, i) => (
            <div key={i} className="news-card glass-panel has-image" onClick={() => setSelectedArticle(item)}>
              <div className="news-card-image-wrapper">
                <img src={item.imageUrl} alt={item.title} className="news-card-image" />
              </div>
              <div className="news-card-body">
                <div className="news-card-header">
                  <span className="news-source">{item.source || "Financial News"}</span>
                  <span className="news-date">{item.pubDate}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="news-ai-summary">
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                  {item.aiSummary}
                </p>
                <div className="news-impact-metrics">
                  {item.sentiment === "Bullish" && <span className="impact-tag bullish"><TrendingUp size={14} /> Bullish</span>}
                  {item.sentiment === "Bearish" && <span className="impact-tag bearish"><TrendingDown size={14} /> Bearish</span>}
                  <span className="impact-tag score"><Activity size={14} /> Impact: {item.impactScore}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArticle && (
        <div className="article-drawer-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="article-drawer glass-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-header-content">
                <div className="news-card-header" style={{ marginBottom: "10px" }}>
                  <span className="news-source">{selectedArticle.source || "Financial News"}</span>
                  <span className="news-date">{selectedArticle.pubDate}</span>
                </div>
                <h2>{selectedArticle.title}</h2>
                <div className="news-impact-metrics">
                  {selectedArticle.sentiment === "Bullish" && <span className="impact-tag bullish"><TrendingUp size={14} /> Bullish</span>}
                  {selectedArticle.sentiment === "Bearish" && <span className="impact-tag bearish"><TrendingDown size={14} /> Bearish</span>}
                  <span className="impact-tag score"><Activity size={14} /> Impact: {selectedArticle.impactScore}/10</span>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setSelectedArticle(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="drawer-body has-image">
              <div className="drawer-hero-image-wrapper">
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="drawer-hero-image" />
              </div>
              <div className="ai-insight-panel">
                <h4><Sparkles size={16} /> AI Market Insights</h4>
                <ul>
                  <li><strong>Key Takeaway:</strong> {selectedArticle.aiSummary}</li>
                  <li><strong>Market Sentiment:</strong> The market is reacting with a {selectedArticle.sentiment.toLowerCase()} tone to this news.</li>
                  <li><strong>Expected Volatility:</strong> A {selectedArticle.impactScore}/10 impact score suggests {selectedArticle.impactScore > 7 ? 'high' : 'moderate'} short-term volatility in related currency pairs.</li>
                </ul>
              </div>
              
              <div className="article-content-preview">
                <p>This article provides an in-depth look at recent market movements and policy shifts. According to the original publication, the central drivers include macroeconomic data releases and shifts in investor risk appetite.</p>
                <p>Read the full coverage to understand the complete context and potential long-term implications for your portfolio.</p>
              </div>
              
              <a href={selectedArticle.link} target="_blank" rel="noreferrer" className="read-original-btn">
                Read Full Article <ExternalLink size={16} style={{ marginLeft: "6px" }} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
