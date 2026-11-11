"use client";

import { useState } from "react";
import { updateAdminProfile, updateAdminPassword } from "@/lib/frontend/api/admin";

export default function AdminProfileModal({
  isOpen,
  onClose,
  admin,
  onAdminUpdated,
}) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password'

  // Form State: Profil
  const [nama, setNama] = useState(admin?.nama || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Form State: Password
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  if (!isOpen) return null;

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!nama.trim()) {
      setProfileMessage({ type: "error", text: "Nama lengkap tidak boleh kosong" });
      return;
    }

    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const res = await updateAdminProfile({ nama: nama.trim() });
      if (res) {
        setProfileMessage({ type: "success", text: "Nama berhasil diperbarui!" });
        if (onAdminUpdated) onAdminUpdated({ ...admin, nama: res.nama || nama.trim() });
      }
    } catch (err) {
      setProfileMessage({
        type: "error",
        text: err?.message || "Gagal memperbarui profil admin",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    setPasswordMessage(null);

    if (!passwordLama) {
      setPasswordMessage({ type: "error", text: "Password saat ini wajib diisi" });
      return;
    }

    if (passwordBaru.length < 8) {
      setPasswordMessage({ type: "error", text: "Password baru minimal 8 karakter" });
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi password baru tidak cocok" });
      return;
    }

    setPasswordSaving(true);

    try {
      await updateAdminPassword({
        password_lama: passwordLama,
        password_baru: passwordBaru,
      });

      setPasswordMessage({
        type: "success",
        text: "Password berhasil diganti! Gunakan password baru saat login berikutnya.",
      });
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err?.message || "Gagal mengubah password. Pastikan password lama benar.",
      });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Pengaturan Profil Admin</h2>
              <p className="text-xs text-slate-500">Kelola identitas akun dan keamanan kata sandi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Data Profil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "password"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Keamanan Password
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    profileMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {profileMessage.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span>{profileMessage.text}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="admin-nama">
                  Nama Lengkap
                </label>
                <input
                  id="admin-nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="admin-email">
                  Email Akun
                </label>
                <input
                  id="admin-email"
                  type="email"
                  readOnly
                  disabled
                  value={admin?.email || "admin@campus.ac.id"}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed opacity-80"
                />
                <span className="text-[11px] text-slate-400">Email akun admin tidak dapat diubah</span>
              </div>

              {/* Role Indicator */}
              <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">Hak Akses</span>
                  <span className="text-[11px] text-slate-500">Kelola verifikasi mahasiswa dan tag sistem</span>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 rounded-full border border-indigo-200">
                  Administrator
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {profileSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handleSavePassword} className="space-y-4">
              {passwordMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    passwordMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {passwordMessage.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              {/* Password Lama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="admin-old-pw">
                  Password Saat Ini
                </label>
                <input
                  id="admin-old-pw"
                  type="password"
                  required
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="admin-new-pw">
                  Password Baru
                </label>
                <input
                  id="admin-new-pw"
                  type="password"
                  required
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="admin-confirm-pw">
                  Konfirmasi Password Baru
                </label>
                <input
                  id="admin-confirm-pw"
                  type="password"
                  required
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {passwordSaving ? "Memperbarui..." : "Perbarui Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

