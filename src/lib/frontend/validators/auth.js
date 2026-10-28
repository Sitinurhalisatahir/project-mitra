const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister({ nim, nama, email, password }) {
  const errors = {};

  if (!nim) errors.nim = "NIM wajib diisi";
  else if (nim.length > 20) errors.nim = "NIM maksimal 20 karakter";

  if (!nama) errors.nama = "Nama lengkap wajib diisi";
  else if (nama.length > 100) errors.nama = "Nama maksimal 100 karakter";

  if (!email) errors.email = "Email wajib diisi";
  else if (email.length > 100) errors.email = "Email maksimal 100 karakter";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format email tidak valid";

  if (!password) errors.password = "Password wajib diisi";
  else if (password.length < 8) errors.password = "Password minimal 8 karakter";

  return errors;
}