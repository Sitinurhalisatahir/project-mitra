"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "skillmatch_token";
const USER_KEY = "skillmatch_user";

// Halaman tujuan setelah login
const HOME_BY_ROLE = {
  admin: "/admin",
  mahasiswa: "/",
};

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setIsPendingVerification(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        if (res.status === 403) {
          setIsPendingVerification(true);
          setError(
            json?.message || "Akun Anda masih menunggu verifikasi dari admin"
          );
        } else if (res.status === 400) {
          setError("Email/NIM dan password wajib diisi");
        } else {
          setError(json?.message || "Login gagal, coba lagi");
        }
        return;
      }

      const { token, user } = json.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      router.replace(HOME_BY_ROLE[user.role] || "/");
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  function handleIdentifierChange(e) {
    setIdentifier(e.target.value);
    if (error) setError("");
    if (isPendingVerification) setIsPendingVerification(false);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    if (error) setError("");
    if (isPendingVerification) setIsPendingVerification(false);
  }

  return (
    <div className="w-full max-w-[480px] bg-[#4F46E5] text-white rounded-[36px] p-8 sm:p-12 shadow-[0_25px_50px_-12px_rgba(79,70,229,0.25),0_12px_24px_-8px_rgba(0,0,0,0.08)] relative overflow-hidden transition-all duration-300 z-10">
      {/* Subtle Card Decorative Accent Lights */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col">
        {/* Card Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Login untuk Melanjutkan
          </h2>
          <p className="text-indigo-100/90 text-sm font-normal">
            Masuk dengan akun universitas kamu untuk mencari tim
          </p>
        </div>

        {/* Login Form Elements */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email / NIM Input Field */}
          <div>
            <label className="sr-only" htmlFor="identifier">
              Email atau NIM
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-regular fa-envelope text-base"></i>
              </div>
              <input
                className="w-full pl-12 pr-6 py-4 bg-white text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-medium rounded-full border-2 border-transparent focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all shadow-xs"
                id="identifier"
                name="identifier"
                placeholder="Email atau NIM"
                required
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={handleIdentifierChange}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-lock text-base"></i>
              </div>
              <input
                className="w-full pl-12 pr-6 py-4 bg-white text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-medium rounded-full border-2 border-transparent focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all shadow-xs"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {/* Pemberitahuan khusus jika masih menunggu verifikasi admin */}
          {isPendingVerification && (
            <div
              role="alert"
              className="rounded-2xl bg-amber-500/20 border border-amber-300/40 p-4 text-left text-amber-100 flex items-start gap-3 shadow-sm transition-all"
            >
              <i className="fa-solid fa-hourglass-half text-amber-300 text-lg mt-0.5 shrink-0 animate-pulse"></i>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-amber-200">
                  Menunggu Verifikasi Admin
                </p>
                <p className="mt-1 text-amber-100/90 leading-relaxed">
                  {error ||
                    "Akun Anda telah berhasil terdaftar tetapi masih menunggu verifikasi dari admin. Silakan tunggu hingga akun Anda disetujui (di-acc) untuk dapat login."}
                </p>
              </div>
            </div>
          )}

          {/* Pesan error umum (hanya muncul saat gagal bukan verifikasi) */}
          {!isPendingVerification && error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-500/20 border border-red-300/40 px-4 py-3 text-center text-xs sm:text-sm text-red-100 flex items-center justify-center gap-2 transition-all"
            >
              <i className="fa-solid fa-circle-exclamation shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Small Verification Note below inputs */}
          <div className="pt-1 pb-2">
            <p className="text-xs text-indigo-100 flex items-center justify-center gap-1.5 text-center font-normal">
              <i className="fa-solid fa-circle-info text-amber-300 text-xs shrink-0"></i>
              <span>Akun yang belum diverifikasi admin tidak dapat login</span>
            </p>
          </div>

          {/* Action Button */}
          <div>
            <button
              className="w-full py-4 px-6 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-900 font-bold text-base rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Memproses..." : "Masuk"}</span>
              <i
                className={`fa-solid ${
                  loading ? "fa-spinner fa-spin" : "fa-arrow-right"
                } text-sm`}
              ></i>
            </button>
          </div>

          {/* Small Link below button */}
          <div className="pt-3 text-center">
            <Link
              className="text-xs sm:text-sm text-indigo-100 hover:text-white font-medium underline underline-offset-4 decoration-indigo-300 hover:decoration-white transition-colors"
              href="/register"
            >
              Belum punya akun? Registrasi di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
