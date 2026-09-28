const nf = new Intl.NumberFormat('ko-KR');

/** 48326500 → "48,326,500" */
export const won = (n) => nf.format(Math.abs(n));

/** 58000 → "+58,000", -6500 → "-6,500" */
export const signed = (n) => `${n > 0 ? '+' : '-'}${won(n)}`;

/** part/whole → "6.7" */
export const pct = (part, whole, digits = 1) => ((part / whole) * 100).toFixed(digits);
