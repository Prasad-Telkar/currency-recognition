import { useTranslation } from "react-i18next";
import { Globe as GlobeIcon } from "lucide-react";
import { CURRENCIES } from "../data/currencies";

export default function CurrencyGrid() {
  const { t } = useTranslation();

  return (
    <section className="page-section">
      <div className="section-heading">
        <span><GlobeIcon size={20} /></span>
        <div>
          <h2>{t("currencies.title")}</h2>
          <p>{t("currencies.subtitle")}</p>
        </div>
      </div>

      <div className="currency-grid">
        {Object.entries(CURRENCIES).map(([country, info]) => (
          <div className="currency-card" key={country}>
            <div className="currency-symbol">{info.symbol}</div>
            <div>
              <h3>{country}</h3>
              <p>{info.name}</p>
              <small>{info.code}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
