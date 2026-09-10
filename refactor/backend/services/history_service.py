import sqlite3
import os
import json
import logging

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "history.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recognition_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                country TEXT NOT NULL,
                currency_code TEXT,
                currency_name TEXT,
                currency_symbol TEXT,
                denomination INTEGER,
                confidence REAL,
                confidence_level TEXT,
                quality_score INTEGER,
                blur_detected BOOLEAN,
                lighting_quality TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()

# Initialize on import
init_db()

def _row_to_dict(row):
    # Ensure mapping matches frontend expectations
    # id, country, currency_code, currency_name, currency_symbol, denomination, confidence, confidence_level, quality_score, blur_detected, lighting_quality, created_at
    created_at = row[11]
    # Simple split of datetime "YYYY-MM-DD HH:MM:SS"
    date_part = created_at.split(" ")[0] if created_at else ""
    time_part = created_at.split(" ")[1] if created_at and " " in created_at else ""
    
    return {
        "id": row[0],
        "country": row[1],
        "currencyCode": row[2],
        "currencyName": row[3],
        "currencySymbol": row[4],
        "denomination": row[5],
        "confidence": row[6],
        "confidenceLevel": row[7],
        "imageAnalysis": {
            "quality_score": row[8],
            "blur_detected": bool(row[9]),
            "lighting_quality": row[10]
        },
        "date": date_part,
        "time": time_part
    }

def get_history(query=None, sort_by="newest"):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        
        sql = "SELECT * FROM recognition_history"
        params = []
        
        if query:
            sql += " WHERE LOWER(country) LIKE ? OR LOWER(currency_code) LIKE ? OR CAST(denomination AS TEXT) LIKE ?"
            q = f"%{query.lower()}%"
            params.extend([q, q, q])
            
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC"
        elif sort_by == "confidence":
            sql += " ORDER BY confidence DESC"
        else:
            sql += " ORDER BY created_at DESC"
            
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        
        return [_row_to_dict(row) for row in rows]

def insert_history(entry):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        
        # entry might have imageAnalysis, we extract it safely
        image_analysis = entry.get("imageAnalysis") or {}
        
        cursor.execute('''
            INSERT INTO recognition_history (
                country, currency_code, currency_name, currency_symbol, 
                denomination, confidence, confidence_level, 
                quality_score, blur_detected, lighting_quality
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            entry.get("country"),
            entry.get("currencyCode"),
            entry.get("currencyName"),
            entry.get("currencySymbol"),
            entry.get("denomination"),
            entry.get("confidence"),
            entry.get("confidenceLevel"),
            image_analysis.get("quality_score"),
            image_analysis.get("blur_detected", False),
            image_analysis.get("lighting_quality")
        ))
        
        inserted_id = cursor.lastrowid
        conn.commit()
        
        # Return the fully constructed entry
        cursor.execute("SELECT * FROM recognition_history WHERE id = ?", (inserted_id,))
        row = cursor.fetchone()
        return _row_to_dict(row)

def delete_history_entry(entry_id):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM recognition_history WHERE id = ?", (entry_id,))
        conn.commit()
        return cursor.rowcount > 0

def clear_all_history():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM recognition_history")
        conn.commit()
        return True
