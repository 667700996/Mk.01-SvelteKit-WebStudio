const longDate = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

function toDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | number | Date, style: "long" | "short" = "long") {
  const date = toDate(value);
  if (!date) return String(value);
  return (style === "long" ? longDate : shortDate).format(date);
}

/** Zero-padded index: 1 → "01". */
export function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Typographic figures: "-60%" → "−60%", "Weeks 1-2" → "Weeks 1–2". */
export function figure(value: string) {
  return value.replace(/(\d)-(?=\d)/g, "$1–").replace(/(^|\s)-(?=\d)/g, "$1−");
}
