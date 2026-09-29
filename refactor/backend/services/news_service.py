import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import time
import logging

logger = logging.getLogger(__name__)

# Cache dictionary mapping query -> { "timestamp": float, "data": list }
_news_cache = {}
CACHE_TTL = 600  # 10 minutes

def fetch_financial_news(query="currency market OR forex OR exchange rate"):
    """
    Fetches real-time financial and currency news via Google News RSS feeds.
    Returns a list of structured news dictionaries.
    """
    global _news_cache
    
    current_time = time.time()
    
    # Check cache
    if query in _news_cache:
        cached = _news_cache[query]
        if current_time - cached["timestamp"] < CACHE_TTL:
            return cached["data"]
            
    encoded_query = urllib.parse.quote(query)
    # Using Google News RSS
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        channel = root.find("channel")
        
        news_items = []
        if channel is not None:
            for item in channel.findall("item")[:10]: # Top 10 news items
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", "")
                
                # The source element contains the publisher name
                source_elem = item.find("source")
                source = source_elem.text if source_elem is not None else ""
                
                news_items.append({
                    "title": title,
                    "link": link,
                    "pubDate": pub_date,
                    "source": source
                })
                
        # Update cache
        _news_cache[query] = {
            "timestamp": current_time,
            "data": news_items
        }
        
        return news_items
    except Exception as e:
        logger.error(f"Error fetching news for query '{query}': {e}")
        # If fetch fails but we have stale cache, return it
        if query in _news_cache:
            return _news_cache[query]["data"]
        return []
