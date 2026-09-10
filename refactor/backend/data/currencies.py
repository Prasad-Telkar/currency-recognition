# Mirrors frontend/src/data/currencies.js. Kept in sync manually for now —
# once GET /currencies is the source of truth on the frontend too, this
# becomes the single copy instead of a mirror.

CURRENCIES_BY_COUNTRY = {
    "India": {
        "code": "INR", "symbol": "₹", "name": "Indian Rupee",
        "material": "Cotton-rag paper",
        "security": "Bleed lines, Mahatma Gandhi watermark, color-shift ink",
        "fact": "The ₹2000 note was withdrawn from circulation in 2023.",
    },
    "USA": {
        "code": "USD", "symbol": "$", "name": "US Dollar",
        "material": "Cotton-linen blend",
        "security": "Color-shifting ink, watermark, security thread",
        "fact": "The $1 bill has been in continuous production since 1963.",
    },
    "Euro": {
        "code": "EUR", "symbol": "€", "name": "Euro",
        "material": "Cotton fiber",
        "security": "Hologram stripe, emerald number, satellite feature",
        "fact": "Euro notes feature generic bridges and windows, not real landmarks.",
    },
    "Nepal": {"code": "NPR", "symbol": "Rs", "name": "Nepalese Rupee"},
    "Indonesia": {"code": "IDR", "symbol": "Rp", "name": "Indonesian Rupiah"},
    "Thailand": {"code": "THB", "symbol": "฿", "name": "Thai Baht"},
    "Pakistan": {"code": "PKR", "symbol": "Rs", "name": "Pakistani Rupee"},
    "Bangladesh": {"code": "BDT", "symbol": "৳", "name": "Bangladeshi Taka"},
    "Peru": {"code": "PEN", "symbol": "S/", "name": "Peruvian Sol"},
    "Brazil": {"code": "BRL", "symbol": "R$", "name": "Brazilian Real"},
    "Egypt": {"code": "EGP", "symbol": "E£", "name": "Egyptian Pound"},
    "Ghana": {"code": "GHS", "symbol": "GH₵", "name": "Ghanaian Cedi"},
    "Jordan": {"code": "JOD", "symbol": "JD", "name": "Jordanian Dinar"},
    "Turkey": {"code": "TRY", "symbol": "₺", "name": "Turkish Lira"},
}
