"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ProfilHeader from "@/components/mahasiswa/profil/ProfilHeader";
import DataDasarCard from "@/components/mahasiswa/profil/DataDasarCard";
import SkillMinatCard from "@/components/mahasiswa/profil/SkillMinatCard";
import VisibilitasCard from "@/components/mahasiswa/profil/VisibilitasCard";
import Toast from "@/components/mahasiswa/profil/Toast";
import { useMahasiswa } from "@/components/mahasiswa/MahasiswaGuard";
import {
  getMahasiswaProfil,
  updateMahasiswaProfil,
  getAllTags,
} from "@/lib/frontend/api/mahasiswa";

export default function ProfilPage() {
  const { setUser } = useMahasiswa() || {};

  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    jurusan: "",
    angkatan: null,
    ketersediaan_waktu: "",
    profil_publik: true,
    foto: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const loadData = useCallback(async () => {
    const [profilRes, tagsRes] = await Promise.allSettled([
      getMahasiswaProfil(),
      getAllTags(),
    ]);

    if (profilRes.status === "fulfilled" && profilRes.value) {
      const p = profilRes.value;
      let savedPhoto = "";
      if (typeof window !== "undefined" && (p.nim || p.pengguna_id)) {
        try {
          savedPhoto = localStorage.getItem(`profile_photo_${p.nim || p.pengguna_id}`) || "";
        } catch {
          // ignore error
        }
      }

      setFormData({
        nama: p.nama || "",
        nim: p.nim || "",
        jurusan: p.jurusan || "",
        angkatan: p.angkatan ?? null,
        ketersediaan_waktu: p.ketersediaan_waktu || "",
        profil_publik: p.profil_publik !== undefined ? Boolean(p.profil_publik) : true,
        foto: savedPhoto,
      });

      setSelectedTags(Array.isArray(p.tags) ? p.tags : []);
    } else {
      setFetchError("Gagal memuat data profil.");
    }

    if (tagsRes.status === "fulfilled" && Array.isArray(tagsRes.value)) {
      setAllTags(tagsRes.value);
    }

    setLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setFetchError(null);
    loadData();
  }, [loadData]);

  useEffect(() => {
    let ignore = false;
    getMahasiswaProfil()
      .catch(() => null)
      .then(() => {
        if (!ignore) {
          loadData();
        }
      });

    return () => {
      ignore = true;
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [loadData]);

  function handleFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleAddTag(tag) {
    if (!selectedTags.some((t) => t.tag_id === tag.tag_id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  }

  function handleRemoveTag(tagId) {
    setSelectedTags((prev) => prev.filter((t) => t.tag_id !== tagId));
  }

  function validate() {
    const errs = {};
    if (!formData.nama || !formData.nama.trim()) {
      errs.nama = "Nama lengkap wajib diisi";
    } else if (formData.nama.length > 100) {
      errs.nama = "Nama maksimal 100 karakter";
    }

    if (formData.jurusan && formData.jurusan.length > 100) {
      errs.jurusan = "Jurusan maksimal 100 karakter";
    }

    const currentYear = new Date().getFullYear();
    if (formData.angkatan !== null && formData.angkatan !== undefined && formData.angkatan !== "") {
      const num = Number(formData.angkatan);
      if (Number.isNaN(num) || num < 2000 || num > currentYear) {
        errs.angkatan = `Angkatan harus 4 digit antara 2000 dan ${currentYear}`;
      }
    }

    if (formData.ketersediaan_waktu && formData.ketersediaan_waktu.length > 100) {
      errs.ketersediaan_waktu = "Ketersediaan waktu maksimal 100 karakter";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (saving) return;
    if (!validate()) {
      showToast("Mohon periksa kembali isian formulir.", "error");
      return;
    }

    setSaving(true);
    setFieldErrors({});

    try {
      const payload = {
        nama: formData.nama.trim(),
        jurusan: formData.jurusan ? formData.jurusan.trim() : "",
        angkatan: formData.angkatan ? Number(formData.angkatan) : null,
        ketersediaan_waktu: formData.ketersediaan_waktu ? formData.ketersediaan_waktu.trim() : "",
        profil_publik: formData.profil_publik,
        tags: selectedTags.map((t) => ({
          tag_id: t.tag_id,
          level: t.level || "menengah",
        })),
      };

      const updated = await updateMahasiswaProfil(payload);

      if (setUser && updated) {
        setUser((prev) => ({
          ...prev,
          nama: updated.nama,
          jurusan: updated.jurusan,
          angkatan: updated.angkatan,
          tags: updated.tags,
        }));
      }

      if (typeof window !== "undefined" && (formData.nim || user?.pengguna_id)) {
        const photoKey = `profile_photo_${formData.nim || user?.pengguna_id}`;
        try {
          if (formData.foto) {
            localStorage.setItem(photoKey, formData.foto);
          } else {
            localStorage.removeItem(photoKey);
          }
          window.dispatchEvent(new Event("foto_profil:berubah"));
        } catch {
          // ignore localStorage error
        }
      }

      showToast("Profil berhasil disimpan!", "success");
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const mappedErrors = {};
        err.errors.forEach((e) => {
          if (e.field) mappedErrors[e.field] = e.message;
        });
        setFieldErrors(mappedErrors);
      }
      showToast(err.message || "Gagal menyimpan profil", "error");
    } finally {
      setSaving(false);
    }
  }

  if (fetchError) {
    return (
      <div className="px-space-xl py-space-lg w-full max-w-[1360px] mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <span className="text-xs text-red-600 font-medium">{fetchError}</span>
        <button
          type="button"
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-on-primary rounded-full text-body-md font-semibold hover:bg-primary-container transition-all"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="px-space-xl py-space-lg w-full max-w-[1360px] mx-auto flex flex-col gap-space-lg">
      <ProfilHeader />

      {loading ? (
        <div className="flex flex-col gap-space-lg w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 h-96 animate-pulse" />
            <div className="flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 h-64 animate-pulse" />
              <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 h-28 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-space-lg w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
            {/* Kolom Kiri: Data Dasar */}
            <DataDasarCard
              formData={formData}
              errors={fieldErrors}
              onChange={handleFieldChange}
              onPhotoError={(msg) => showToast(msg, "error")}
            />

            {/* Kolom Kanan: Skill & Minat dan Visibilitas */}
            <div className="flex flex-col gap-space-lg">
              <SkillMinatCard
                selectedTags={selectedTags}
                allTags={allTags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />

              <VisibilitasCard
                checked={formData.profil_publik}
                onChange={(val) => handleFieldChange("profil_publik", val)}
              />
            </div>
          </div>

          {/* Tombol Simpan Profil */}
          <div className="flex items-center justify-end pt-space-xs">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-secondary-container hover:opacity-95 text-on-secondary-container text-title-lg px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              id="btn-simpan-profil"
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                save
              </span>
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
      />
    </div>
  );
}
