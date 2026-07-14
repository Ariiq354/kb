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

export function formatDuration(seconds: number) {
  if (!seconds)
    return "0 detik";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h} jam ${m} menit`;
  }
  if (m > 0) {
    return `${m} menit ${s} detik`;
  }
  return `${s} detik`;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!bytes)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
