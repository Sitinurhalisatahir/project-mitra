"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DetailHeader from "@/components/mahasiswa/proyek/DetailHeader";
import DetailInfoGrid from "@/components/mahasiswa/proyek/DetailInfoGrid";
import ApplyForm from "@/components/mahasiswa/proyek/ApplyForm";
import StatusLamaranPanel from "@/components/mahasiswa/proyek/StatusLamaranPanel";
import {
  getDetailProyek,
  getAplikasiSaya,
} from "@/lib/frontend/api/mahasiswa";

export default function DetailProyekPage({ params }) {
  const unwrappedParams = use(params);
  const proyekId = unwrappedParams.id;

  const [proyek, setProyek] = useState(null);
  const [aplikasiSaya, setAplikasiSaya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAplikasi, setLoadingAplikasi] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const fetchProyek = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getDetailProyek(proyekId);
      if (!data) {
        setNotFound(true);
      } else {
        setProyek(data);
      }
    } catch (err) {
      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || "Gagal memuat detail proyek");
      }
    } finally {
      setLoading(false);
    }
  }, [proyekId]);

  const fetchAplikasi = useCallback(async () => {
    setLoadingAplikasi(true);
    try {
      const data = await getAplikasiSaya();
      setAplikasiSaya(Array.isArray(data) ? data : []);
    } catch {
      // Abaikan error panel status lamaran agar tidak merusak halaman utama
    } finally {
      setLoadingAplikasi(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getDetailProyek(proyekId)
      .catch(() => null)
      .then(() => {
        if (!ignore) {
          fetchProyek();
          fetchAplikasi();
        }
      });

    return () => {
      ignore = true;
    };
  }, [proyekId, fetchProyek, fetchAplikasi]);

  function handleApplySuccess() {
    fetchProyek();
    fetchAplikasi();
  }

  if (notFound) {
    return (
      <div className="px-8 py-16 max-w-[1440px] mx-auto w-full flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2">
          <span className="material-symbols-outlined text-[32px]">search_off</span>
        </div>
        <h1 className="text-headline-md text-on-surface font-bold">
          Proyek tidak ditemukan
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-md font-normal">
          Proyek yang kamu cari mungkin telah dihapus atau tidak tersedia.
        </p>
        <Link
          href="/proyek"
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-body-md font-semibold hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Pencarian</span>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-16 max-w-[1440px] mx-auto w-full flex flex-col items-center justify-center text-center gap-4">
        <span className="text-xs text-red-600 font-medium">{error}</span>
        <button
          type="button"
          onClick={fetchProyek}
          className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-body-md font-semibold hover:bg-primary-container transition-all"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const tags = Array.isArray(proyek?.tags) ? proyek.tags : [];

  return (
    <div className="px-8 py-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      <DetailHeader proyek={proyek} />

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 w-full">
          <div className="lg:col-span-8 w-full bg-surface-container-lowest rounded-[2rem] shadow-sm p-8 h-[600px] animate-pulse" />
          <div className="lg:col-span-4 w-full bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 h-96 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 w-full">
          {/* Kolom Kiri: Rincian Utama & Form Lamaran */}
          <section className="lg:col-span-8 w-full bg-surface-container-lowest rounded-[2rem] shadow-sm p-8 flex flex-col gap-8">
            {/* 4 Info Card Grid */}
            <DetailInfoGrid proyek={proyek} />

            {/* Deskripsi Proyek */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-title-lg font-bold text-on-surface">
                Deskripsi Proyek
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed font-normal">
                {proyek?.deskripsi || "Belum ada deskripsi."}
              </p>
            </div>

            {/* Skill Dibutuhkan */}
            <div className="flex flex-col gap-3">
              <h2 className="text-title-lg font-bold text-on-surface">
                Skill Dibutuhkan
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {tags.length === 0 ? (
                  <span className="text-body-md text-on-surface-variant">
                    Tidak ada spesifikasi skill khusus
                  </span>
                ) : (
                  tags.map((t) => (
                    <span
                      key={t.tag_id || t.nama_tag}
                      className="inline-flex items-center gap-1.5 text-pill-tag bg-primary-fixed text-on-primary-fixed-variant px-4 py-2 rounded-full transition-transform hover:scale-105 cursor-default font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        label
                      </span>
                      {t.nama_tag}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Formulir Pengajuan Diri */}
            <ApplyForm proyek={proyek} onApplySuccess={handleApplySuccess} />
          </section>

          {/* Kolom Kanan: Status Lamaran Saya */}
          <StatusLamaranPanel
            items={aplikasiSaya}
            loading={loadingAplikasi}
          />
        </div>
      )}
    </div>
  );
}

