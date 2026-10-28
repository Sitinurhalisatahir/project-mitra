"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "skillmatch_token";
const USER_KEY = "skillmatch_user";

export default function AdminVerificationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filterVerified, setFilterVerified] = useState("false"); // "false", "true", "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = useCallback(
    async (authToken, verifiedFilter, queryStr) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (verifiedFilter !== "all") {
          params.append("is_verified", verifiedFilter);
        }
        if (queryStr.trim()) {
          params.append("q", queryStr.trim());
        }
        params.append("limit", "50");

        const res = await fetch(`/api/admin/pengguna?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          router.replace("/login");
          return;
        }

        const json = await res.json();
        if (json.success) {
          setUsers(json.data || []);
          if (json.meta) setMeta(json.meta);
        }
      } catch (err) {
        console.error("Gagal memuat pengguna:", err);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUserStr = localStorage.getItem(USER_KEY);

    if (!savedToken || !savedUserStr) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUserStr);
      if (parsedUser.role !== "admin") {
        router.replace("/");
        return;
      }
      setCurrentUser(parsedUser);
      setToken(savedToken);
      fetchUsers(savedToken, filterVerified, searchQuery);
    } catch {
      router.replace("/login");
    }
  }, [router, fetchUsers, filterVerified, searchQuery]);

  async function handleToggleVerify(userToUpdate, targetStatus) {
    if (actionLoadingId) return;
    setActionLoadingId(userToUpdate.pengguna_id);

    try {
      const res = await fetch(`/api/admin/pengguna/${userToUpdate.pengguna_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_verified: targetStatus }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: targetStatus
            ? `Akun ${userToUpdate.nama} (${userToUpdate.nim}) berhasil di-ACC / diverifikasi!`
            : `Verifikasi akun ${userToUpdate.nama} berhasil dicabut.`,
        });
        setTimeout(() => setToast(null), 4000);
        // Refresh daftar
        fetchUsers(token, filterVerified, searchQuery);
      } else {
        setToast({
          type: "error",
          message: json.message || "Gagal memperbarui status verifikasi",
        });
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      setToast({
        type: "error",
        message: "Terjadi kesalahan saat menghubungi server",
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Header Admin */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/20"
            >
              S
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  SkillMatch
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                  Panel Admin
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Persetujuan & Verifikasi Akun Mahasiswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full text-xs font-medium text-slate-700">
              <i className="fa-solid fa-user-shield text-indigo-600"></i>
              <span>{currentUser?.nama || "Administrator"}</span>
            </div>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium shadow-md transition-all ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <i
              className={`fa-solid text-lg shrink-0 ${
                toast.type === "success"
                  ? "fa-circle-check text-emerald-600"
                  : "fa-circle-exclamation text-red-600"
              }`}
            ></i>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Dashboard Title & Overview Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-600/15 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verifikasi Akun Pengguna Baru
            </h1>
            <p className="mt-2 text-indigo-100 max-w-2xl text-sm sm:text-base leading-relaxed">
              Mahasiswa yang baru mendaftar membutuhkan persetujuan (ACC) dari
              admin sebelum dapat melakukan login dan menggunakan platform.
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tab Filter */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setFilterVerified("false")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                filterVerified === "false"
                  ? "bg-amber-400 text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-solid fa-clock"></i>
              <span>Menunggu Verifikasi</span>
              {filterVerified === "false" && meta.total > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-slate-900 text-white">
                  {meta.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterVerified("true")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                filterVerified === "true"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-solid fa-circle-check"></i>
              <span>Sudah Diverifikasi</span>
            </button>
            <button
              onClick={() => setFilterVerified("all")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                filterVerified === "all"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <i className="fa-solid fa-users"></i>
              <span>Semua Akun</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
            <input
              type="text"
              placeholder="Cari nama, NIM, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* User List Table / Cards */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600 mb-3"></i>
            <p className="text-slate-500 text-sm font-medium">
              Memuat data pengguna...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fa-solid fa-user-clock"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {filterVerified === "false"
                ? "Tidak ada akun yang menunggu verifikasi"
                : "Tidak ada data pengguna"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {filterVerified === "false"
                ? "Semua pendaftar baru telah diverifikasi atau belum ada akun baru yang mendaftar."
                : "Coba ubah kata kunci pencarian atau ganti filter."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Mahasiswa</th>
                    <th className="py-4 px-6">NIM</th>
                    <th className="py-4 px-6">Jurusan / Angkatan</th>
                    <th className="py-4 px-6">Tgl Terdaftar</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map((u) => {
                    const isVerified = u.is_verified;
                    const isProcessing = actionLoadingId === u.pengguna_id;

                    return (
                      <tr
                        key={u.pengguna_id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {u.nama ? u.nama.charAt(0).toUpperCase() : "M"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {u.nama}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <i className="fa-regular fa-envelope text-[10px]"></i>
                                <span>{u.email}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700">
                          {u.nim}
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-xs sm:text-sm">
                          {u.jurusan || "-"}{" "}
                          {u.angkatan ? `(${u.angkatan})` : ""}
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="py-4 px-6">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              <i className="fa-solid fa-circle-check text-[11px] text-emerald-600"></i>
                              <span>Terverifikasi</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              <i className="fa-solid fa-hourglass-half text-[11px] text-amber-600 animate-pulse"></i>
                              <span>Menunggu ACC</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {!isVerified ? (
                            <button
                              onClick={() => handleToggleVerify(u, true)}
                              disabled={isProcessing}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i
                                className={`fa-solid ${
                                  isProcessing
                                    ? "fa-spinner fa-spin"
                                    : "fa-check"
                                }`}
                              ></i>
                              <span>
                                {isProcessing ? "Memproses..." : "ACC / Setujui"}
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleVerify(u, false)}
                              disabled={isProcessing}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-medium text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <i
                                className={`fa-solid ${
                                  isProcessing
                                    ? "fa-spinner fa-spin"
                                    : "fa-ban"
                                }`}
                              ></i>
                              <span>Cabut Verifikasi</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

