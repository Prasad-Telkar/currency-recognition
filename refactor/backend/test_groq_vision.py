import os
import urllib.request
import json

grok_api_key = os.environ.get("GROQ_API_KEY", "YOUR_API_KEY_HERE")
url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {grok_api_key}",
    "User-Agent": "Mozilla/5.0"
}
data = {
    "model": "qwen/qwen3.8-27b",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Is this working?"},
                {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="}}
            ]
        }
    ],
    "temperature": 0.1
}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    with urllib.request.urlopen(req, timeout=15) as res:
        print(res.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
