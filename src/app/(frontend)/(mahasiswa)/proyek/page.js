"use client";

import { useEffect, useState, useCallback } from "react";
import CariHeader from "@/components/mahasiswa/proyek/CariHeader";
import FilterPanel from "@/components/mahasiswa/proyek/FilterPanel";
import ProyekList from "@/components/mahasiswa/proyek/ProyekList";
import {
  getRekomendasiProyek,
  getProyek,
  getAllTags,
} from "@/lib/frontend/api/mahasiswa";

export default function CariProyekPage() {
  const initialFilter = {
    kategori: "tugas_kuliah",
    skill: "",
    deadline: "",
  };

  const [filter, setFilter] = useState(initialFilter);
  const [proyekList, setProyekList] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Load awal: Rekomendasi proyek (atau fallback ke proyek buka jika rekomendasi kosong)
  const loadInitialRecommendations = useCallback(async () => {
    try {
      let recs = [];
      try {
        const res = await getRekomendasiProyek(20);
        if (Array.isArray(res)) recs = res;
      } catch {
        recs = [];
      }

      if (recs.length > 0) {
        setProyekList(recs);
      } else {
        const fallback = await getProyek({ status: "buka" });
        setProyekList(Array.isArray(fallback) ? fallback : []);
      }
    } catch {
      setError("Gagal memuat rekomendasi proyek.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    loadInitialRecommendations();
  }, [loadInitialRecommendations]);

  useEffect(() => {
    let ignore = false;
    getProyek({ status: "buka" })
      .catch(() => null)
      .then(() => {
        if (!ignore) {
          loadInitialRecommendations();
        }
      });

    return () => {
      ignore = true;
    };
  }, [loadInitialRecommendations]);

  function handleFilterChange(key, value) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setFilter(initialFilter);
    setLoading(true);
    setError(null);
    loadInitialRecommendations();
  }

  async function handleApplyFilter() {
    setLoading(true);
    setError(null);

    try {
      const params = {
        status: "buka",
        kategori: filter.kategori,
      };

      // Cocokkan skill input ke tag_id jika ada
      if (filter.skill && filter.skill.trim()) {
        const queryTerms = filter.skill
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
        } else {
          // Jika tidak ada tag yang match persis, kirim sebagai q untuk judul/deskripsi
          params.q = filter.skill.trim();
        }
      }

      const res = await getProyek(params);
      let list = Array.isArray(res) ? res : [];

      // Filter sisi client untuk deadline jika diisi
      if (filter.deadline) {
        const selectedDeadline = new Date(filter.deadline);
        list = list.filter((p) => {
          if (!p.deadline) return false;
          return new Date(p.deadline) <= selectedDeadline;
        });
      }

      setProyekList(list);
    } catch {
      setError("Gagal menerapkan filter proyek.");
    } finally {
      setLoading(false);
    }
  }

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
        />
      </div>
    </div>
  );
}
