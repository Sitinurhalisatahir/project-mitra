const TOKEN_KEY = "skillmatch_token";
const USER_KEY = "skillmatch_user";

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
}

export function removeToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Abaikan error
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Abaikan error
  }
}

export function removeUser() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Abaikan error
  }
}

export function clearSession() {
  removeToken();
  removeUser();
}

