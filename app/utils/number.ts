export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRupiahParts(value: number) {
  const parts = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).formatToParts(value);

  const currency = parts
    .filter(p => p.type === "currency" || p.type === "literal")
    .map(p => p.value)
    .join("")
    .trim();

  const number = parts
    .filter(p => p.type !== "currency" && p.type !== "literal")
    .map(p => p.value)
    .join("");

  return { currency, number };
}
