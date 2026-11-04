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

export function formatShortDateIndonesian(date) {
  if (!date) return "-";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
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

export function formatRelativeTime(date) {
  if (!date) return "-";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 60) {
    return "baru saja";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} menit lalu`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} jam lalu`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) {
    return "kemarin";
  }
  if (diffDay < 7) {
    return `${diffDay} hari lalu`;
  }

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return `${diffWeek} minggu lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDaysRemaining(deadline) {
  if (!deadline) return "Tanpa deadline";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return "Tanpa deadline";

  const now = new Date();
  // Set waktu ke tengah malam untuk perbandingan hari yang akurat
  d.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Sudah lewat";
  }
  if (diffDays === 0) {
    return "Hari ini";
  }
  return `${diffDays} hari lagi`;
}

export function formatProjectCategory(category) {
  if (!category) return "-";
  const map = {
    tugas_kuliah: "Tugas Kuliah",
    tugas: "Tugas Kuliah",
    lomba: "Lomba",
    personal: "Personal",
  };
  return map[category] || category;
}
