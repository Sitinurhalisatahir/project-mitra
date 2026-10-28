export class ApiClientError extends Error {
  constructor(message, status = 0, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function register({ nim, nama, email, password }) {
  let res;
  try {
    res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, nama, email, password }),
    });
  } catch {
    throw new ApiClientError("Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    // respons bukan JSON
  }

  if (res.ok && json?.success) {
    // Token sengaja diabaikan: akun belum diverifikasi admin.
    return json.data.user;
  }

  const message = json?.message || "Terjadi kesalahan pada server";
  const fieldErrors = {};

  // 400 validasi Zod: errors = [{ field, message }]
  if (Array.isArray(json?.errors)) {
    for (const e of json.errors) {
      if (e.field && !fieldErrors[e.field]) fieldErrors[e.field] = e.message;
    }
  }

  // 409 duplikat: nama constraint ada di message (pengguna_nim_key / pengguna_email_key)
  if (res.status === 409) {
    const m = message.toLowerCase();
    if (m.includes("nim")) fieldErrors.nim = "NIM sudah terdaftar";
    else if (m.includes("email")) fieldErrors.email = "Email sudah terdaftar";
  }

  throw new ApiClientError(message, res.status, fieldErrors);
}