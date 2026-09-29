// Confidence thresholds from the architecture report:
// 95-100 Very High | 80-94 High | 60-79 Moderate | <60 Low
export function getConfidenceLevel(confidence) {
  if (confidence == null || Number.isNaN(confidence)) return null;
  if (confidence >= 95) return "Very High";
  if (confidence >= 80) return "High";
  if (confidence >= 60) return "Moderate";
  return "Low";
}

// Returns actionable tips when confidence is Moderate/Low, or an empty
// array when the result is already trustworthy — callers should render
// nothing (not an empty state) when this comes back empty.
export function getConfidenceGuidance(level) {
  if (level === "Very High" || level === "High" || level == null) return [];
  return [
    "Improve lighting — avoid shadows and glare on the note.",
    "Capture the entire note or coin, not just part of it.",
    "Hold the camera steady to avoid motion blur.",
    "Avoid reflections off plastic sleeves or glass.",
    "Use the highest resolution your camera allows.",
  ];
}

export function confidenceLevelToClass(level) {
  switch (level) {
    case "Very High": return "confidence-very-high";
    case "High": return "confidence-high";
    case "Moderate": return "confidence-moderate";
    case "Low": return "confidence-low";
    default: return "";
  }
}
