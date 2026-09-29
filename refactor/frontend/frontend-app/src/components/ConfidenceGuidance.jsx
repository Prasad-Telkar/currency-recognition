import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { getConfidenceGuidance } from "../utils/confidence";

// Renders nothing when the result is already trustworthy (Very High/High) —
// only shows up for Moderate/Low confidence, with concrete next steps
// instead of just leaving the user with a low number.
export default function ConfidenceGuidance({ level }) {
  const { t } = useTranslation();
  const tips = getConfidenceGuidance(level);

  if (tips.length === 0) return null;

  return (
    <div className="confidence-guidance">
      <div className="confidence-guidance-title">
        <AlertTriangle size={15} />
        {t("guidance.title")}
      </div>
      <ul>
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
