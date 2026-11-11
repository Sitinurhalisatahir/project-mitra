"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import CariHeader from "@/components/mahasiswa/proyek/CariHeader";
import FilterPanel from "@/components/mahasiswa/proyek/FilterPanel";
import ProyekList from "@/components/mahasiswa/proyek/ProyekList";
import {
  getRekomendasiProyek,
  getProyek,
  getAllTags,
} from "@/lib/frontend/api/mahasiswa";

const INITIAL_FILTER = {
  kategori: "", // "" = semua kategori
  skill: "",
  deadline: "",
};

function CariProyekContent() {
  const searchParams = useSearchParams();
  // Kata kunci dari kolom pencarian di topbar (/proyek?q=...)
  const keyword = (searchParams.get("q") || "").trim();

  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [proyekList, setProyekList] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Ambil daftar tag untuk pencocokan skill
  useEffect(() => {
    let ignore = false;
    getAllTags()
      .then((tags) => {
        if (!ignore && Array.isArray(tags)) setAllTags(tags);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  // Rekomendasi proyek (fallback ke semua proyek yang masih buka jika kosong)
  const fetchRecommendations = useCallback(async () => {
    let recs = [];
    try {
      const res = await getRekomendasiProyek(20);
      if (Array.isArray(res)) recs = res;
    } catch {
      recs = [];
    }

    if (recs.length > 0) return recs;
    const fallback = await getProyek({ status: "buka" });
    return Array.isArray(fallback) ? fallback : [];
  }, []);

  // Pencarian berdasarkan kata kunci + filter
  const fetchFiltered = useCallback(
    async (activeFilter, q) => {
      const params = { status: "buka" };
      if (activeFilter.kategori) params.kategori = activeFilter.kategori;
      if (q) params.q = q;

      // Cocokkan skill input ke tag_id jika ada
      const skillText = activeFilter.skill.trim();
      if (skillText) {
        const queryTerms = skillText
          .toLowerCase()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const matchedTagIds = allTags
          .filter((t) =>
            queryTerms.some(
              (term) =>
                t.nama_tag.toLowerCase().includes(term) ||
                term.includes(t.nama_tag.toLowerCase())
            )
          )
          .map((t) => t.tag_id);

        if (matchedTagIds.length > 0) {
          params.tag_id = matchedTagIds.join(",");
        } else if (!q) {
          // Tidak ada tag yang cocok: cari di judul/deskripsi
          params.q = skillText;
        }
      }

      const res = await getProyek(params);
      let list = Array.isArray(res) ? res : [];

      // Filter sisi client untuk deadline jika diisi (format YYYY-MM-DD)
      if (activeFilter.deadline) {
        list = list.filter(
          (p) => p.deadline && String(p.deadline).slice(0, 10) <= activeFilter.deadline
        );
      }
      return list;
    },
    [allTags]
  );

  // Muat daftar saat halaman dibuka atau kata kunci di topbar berubah
  useEffect(() => {
    let ignore = false;

    async function load() {
      await Promise.resolve();
      if (ignore) return;
      setLoading(true);
      setError(null);
      try {
        let list;
        if (keyword) {
          list = await fetchFiltered(INITIAL_FILTER, keyword);
        } else {
          list = await fetchRecommendations();
        }
        if (ignore) return;
        setFilter(INITIAL_FILTER);
        setIsFiltered(Boolean(keyword));
        setProyekList(list);
      } catch {
        if (!ignore) {
          setError(
            keyword
              ? "Gagal mencari proyek."
              : "Gagal memuat rekomendasi proyek."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
    // fetchFiltered bergantung pada allTags, tetapi tag hanya dipakai saat filter skill
    // diisi manual; pencarian awal tidak perlu diulang ketika daftar tag selesai dimuat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, fetchRecommendations]);

  function handleFilterChange(key, value) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  async function handleReset() {
    setFilter(INITIAL_FILTER);
    setLoading(true);
    setError(null);
    try {
      const list = keyword
        ? await fetchFiltered(INITIAL_FILTER, keyword)
        : await fetchRecommendations();
      setIsFiltered(Boolean(keyword));
      setProyekList(list);
    } catch {
      setError("Gagal memuat proyek.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyFilter() {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchFiltered(filter, keyword);
      setIsFiltered(true);
      setProyekList(list);
    } catch {
      setError("Gagal menerapkan filter proyek.");
    } finally {
      setLoading(false);
    }
  }

  const handleRetry = useCallback(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const listTitle = keyword
    ? `Hasil pencarian "${keyword}"`
    : isFiltered
    ? "Hasil Filter"
    : "Rekomendasi Untuk Anda";

  return (
    <div className="flex flex-col w-full">
      <CariHeader />
      <div className="flex flex-col lg:flex-row items-start gap-gutter">
        <FilterPanel
          filter={filter}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSubmit={handleApplyFilter}
        />
        <ProyekList
          proyekList={proyekList}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          title={listTitle}
        />
      </div>
    </div>
  );
}

export default function CariProyekPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col w-full gap-space-md animate-pulse">
          <div className="h-16 bg-surface-container-low rounded-2xl w-1/3" />
          <div className="h-64 bg-surface-container-lowest rounded-[2rem]" />
        </div>
      }
    >
      <CariProyekContent />
    </Suspense>
  );
}
