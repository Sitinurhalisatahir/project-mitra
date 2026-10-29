export function formatDateIndonesian(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatNumber(num) {
  const val = Number(num);
  if (Number.isNaN(val)) return "0";
  return new Intl.NumberFormat("id-ID").format(val);
}

export function formatPercent(num) {
  const val = Number(num);
  if (Number.isNaN(val)) return "0%";
  return `${Math.round(val)}%`;
}

export function getInitials(name = "") {
  if (!name) return "--";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "--";
}

