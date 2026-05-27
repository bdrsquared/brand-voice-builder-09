// Currency conversion + formatting for UK (GBP) → US (USD).
// Rate is updated quarterly; one edit propagates to every price on the US site.

export const GBP_TO_USD = 1.27;

const SYMBOLS = { GBP: "£", USD: "$" } as const;
export type Currency = keyof typeof SYMBOLS;

/**
 * Round USD prices to a "neat" number:
 *  - >= $1,000  → nearest 1,000
 *  - >= $100    → nearest 50
 *  - < $100     → nearest 5
 */
function neatRound(usd: number): number {
  if (usd >= 1000) return Math.round(usd / 1000) * 1000;
  if (usd >= 100) return Math.round(usd / 50) * 50;
  return Math.round(usd / 5) * 5;
}

export function gbpToUsd(gbp: number): number {
  return neatRound(gbp * GBP_TO_USD);
}

export function formatPrice(amount: number, currency: Currency): string {
  return `${SYMBOLS[currency]}${amount.toLocaleString("en-US")}`;
}

/**
 * Convert a price written for GBP to the active currency.
 * Pass the raw GBP number; this handles conversion + formatting.
 */
export function localizedPrice(gbp: number, currency: Currency): string {
  const value = currency === "USD" ? gbpToUsd(gbp) : gbp;
  return formatPrice(value, currency);
}

/**
 * Swap currency in a string that already contains a £ figure.
 * Useful when copy embeds prices ("from £19,500"). Converts every match.
 */
export function swapCurrencyInString(text: string, currency: Currency): string {
  if (currency === "GBP") return text;
  return text.replace(/£([\d,]+(?:\.\d+)?)/g, (_m, num: string) => {
    const gbp = parseFloat(num.replace(/,/g, ""));
    if (Number.isNaN(gbp)) return _m;
    return formatPrice(gbpToUsd(gbp), currency);
  });
}
