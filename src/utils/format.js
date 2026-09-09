// Formatage multi-devise / multi-locale — 10_INTERNATIONAL_MULTILINGUE_MULTIDEVISE.md
export function formatMoney(amountMinor, currency = 'EUR', locale = 'fr-FR') {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch (e) {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(isoString, locale = 'fr-FR') {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export function formatDateTime(isoString, locale = 'fr-FR') {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(d);
}

export function computePriceBreakdown({ dailyPriceMinor, days, protectionMinor = 0, optionsMinor = 0, deliveryMinor = 0, commissionRate = 0.05 }) {
  const rental = dailyPriceMinor * days;
  const subtotal = rental + protectionMinor + optionsMinor + deliveryMinor;
  const platformFee = Math.round(rental * commissionRate);
  const total = subtotal; // commission prélevée côté propriétaire, non ajoutée au prix locataire
  return { rental, protectionMinor, optionsMinor, deliveryMinor, platformFee, total };
}
