import { getToken, clearSession } from "@/lib/frontend/session";

export class ApiClientError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiClientError("Tidak dapat terhubung ke server", 0);
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    // Respons bukan JSON
  }

  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
    throw new ApiClientError(json?.message || "Sesi telah berakhir, silakan login kembali", 401);
  }

  if (!res.ok || json?.success === false) {
    const message = json?.message || `Permintaan gagal (${res.status})`;
    throw new ApiClientError(message, res.status, json?.errors);
  }

  const data = json?.data !== undefined ? json.data : json;
  if (json?.meta && data && typeof data === "object") {
    data.meta = json.meta;
  }

  if (options.fullResponse) {
    return json;
  }

  return data;
}

