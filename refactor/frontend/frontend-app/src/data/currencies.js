// Static currency knowledge base. This mirrors backend/data/currencies.py —
// when the backend's rich response starts returning currency_code/name/symbol
// directly, this map becomes a client-side fallback/cache rather than the
// source of truth. Keeping it here for now means the guide tab and the
// "legacy" prediction path both still work without a network round trip.

export const CURRENCIES = {
  India: { code: "INR", symbol: "₹", name: "Indian Rupee", material: "Cotton-rag paper", security: "Bleed lines, Mahatma Gandhi watermark, color-shift ink", fact: "The ₹2000 note was withdrawn from circulation in 2023." },
  Nepal: { code: "NPR", symbol: "Rs", name: "Nepalese Rupee" },
  Indonesia: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  Brazil: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  USA: { code: "USD", symbol: "$", name: "US Dollar", material: "Cotton-linen blend", security: "Color-shifting ink, watermark, security thread", fact: "The $1 bill has been in continuous production since 1963." },
  Thailand: { code: "THB", symbol: "฿", name: "Thai Baht" },
  Pakistan: { code: "PKR", symbol: "Rs", name: "Pakistani Rupee" },
  Bangladesh: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  Peru: { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  Euro: { code: "EUR", symbol: "€", name: "Euro", material: "Cotton fiber", security: "Hologram stripe, emerald number, satellite feature", fact: "Euro notes feature generic bridges and windows, not real landmarks." },
  Egypt: { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  Ghana: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  Jordan: { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
  Turkey: { code: "TRY", symbol: "₺", name: "Turkish Lira" },
};

export const TARGET_CURRENCIES = [
  "INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SGD", "AED", "NPR", "IDR", "BRL", "THB", "PKR", "BDT", "PEN"
];

export const CONVERTIBLE_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs", flag: "🇳🇵" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", flag: "🇵🇰" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", flag: "🇬🇭" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD", flag: "🇯🇴" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
];

// Vibrant multi-color orbit palette for the globe — each currency gets its
// own hue so the discs stand out against the sphere instead of blending in.
export const CURRENCY_ORBIT = [
  { symbol: "₹", color: 0xff8b3d, radius: 3.0, speed: 0.45, tilt: 0.15 },
  { symbol: "$", color: 0x2f95ff, radius: 3.15, speed: -0.32, tilt: -0.35 },
  { symbol: "€", color: 0xffc23d, radius: 3.2, speed: 0.27, tilt: 0.48 },
  { symbol: "£", color: 0xb072ff, radius: 3.05, speed: -0.4, tilt: -0.58 },
  { symbol: "¥", color: 0x2fe0dd, radius: 3.3, speed: 0.22, tilt: 0.7 },
];
