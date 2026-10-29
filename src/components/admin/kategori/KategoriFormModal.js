"use client";

import { useState, useEffect } from "react";

function KategoriFormContent({
  onClose,
  mode = "add",
  initialData = null,
  defaultJenis = "skill",
  onSubmit,
}) {
  const [namaTag, setNamaTag] = useState(initialData?.nama_tag || "");
  const [kategori, setKategori] = useState(initialData?.kategori || "");
  const [loading, setLoading] = useState(false);
  const [namaError, setNamaError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const isSkill = (initialData?.jenis || defaultJenis) === "skill";

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanNama = namaTag.trim();
    if (!cleanNama) {
      setNamaError("Nama kategori wajib diisi");
      return;
    }

    setNamaError("");
    setGeneralError("");
    setLoading(true);

    try {
      await onSubmit({
        nama_tag: cleanNama,
        jenis: initialData?.jenis || defaultJenis,
        kategori: kategori.trim() || undefined,
      });
      onClose();
    } catch (err) {
      if (
        err.status === 409 ||
        err.message?.toLowerCase().includes("duplikat") ||
        err.message?.toLowerCase().includes("sudah ada")
      ) {
        setNamaError("Nama kategori sudah ada");
      } else {
        setGeneralError(err.message || "Terjadi kesalahan pada server");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
      {/* Header Modal */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {mode === "add"
              ? `Tambah Kategori ${isSkill ? "Skill" : "Minat"}`
              : `Ubah Kategori ${isSkill ? "Skill" : "Minat"}`}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola taksonomi untuk {isSkill ? "keahlian teknis" : "minat kolaborasi"}.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {generalError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {generalError}
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Jenis Kategori
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg ${
                isSkill
                  ? "text-indigo-600 bg-indigo-50 border border-indigo-100"
                  : "text-amber-600 bg-amber-50 border border-amber-200"
              }`}
            >
              {isSkill ? "SKILL" : "MINAT"}
            </span>
            <span className="text-[11px] text-slate-400">
              (Jenis tidak dapat diubah)
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="nama_tag" className="block text-xs font-bold text-slate-700 mb-1">
            Nama Kategori <span className="text-rose-500">*</span>
          </label>
          <input
            id="nama_tag"
            autoFocus
            type="text"
            maxLength={100}
            disabled={loading}
            value={namaTag}
            onChange={(e) => {
              setNamaTag(e.target.value);
              if (namaError) setNamaError("");
            }}
            placeholder={isSkill ? "contoh: React.js, UI Design" : "contoh: Web Development, AI"}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors ${
              namaError
                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />
          {namaError && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              {namaError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="kategori" className="block text-xs font-bold text-slate-700 mb-1">
            Kategori Kelompok <span className="text-slate-400 font-normal">(opsional)</span>
          </label>
          <input
            id="kategori"
            type="text"
            maxLength={50}
            disabled={loading}
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            placeholder="contoh: Software Engineering, Data"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5 ${
              isSkill
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{mode === "add" ? "Simpan" : "Perbarui"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function KategoriFormModal({
  isOpen,
  onClose,
  mode = "add",
  initialData = null,
  defaultJenis = "skill",
  onSubmit,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <KategoriFormContent
        key={isOpen ? `${initialData?.tag_id || "new"}-${defaultJenis}` : "closed"}
        onClose={onClose}
        mode={mode}
        initialData={initialData}
        defaultJenis={defaultJenis}
        onSubmit={onSubmit}
      />
    </div>
  );
}
