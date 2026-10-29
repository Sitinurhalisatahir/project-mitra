"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import KategoriHeader from "@/components/admin/kategori/KategoriHeader";
import KategoriStatCards from "@/components/admin/kategori/KategoriStatCards";
import KategoriPanel from "@/components/admin/kategori/KategoriPanel";
import KategoriFormModal from "@/components/admin/kategori/KategoriFormModal";
import ConfirmDialog from "@/components/admin/kategori/ConfirmDialog";
import TipsBanner from "@/components/admin/kategori/TipsBanner";
import { getTags, createTag, updateTag, deleteTag } from "@/lib/frontend/api/admin";

export default function AdminKategoriPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formInitialData, setFormInitialData] = useState(null);
  const [formDefaultJenis, setFormDefaultJenis] = useState("skill");

  // Confirm Delete Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchTagsData = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const data = await getTags();
      const list = Array.isArray(data) ? data : [];
      // Urutkan sesuai tag_id naik (urutan tambah)
      const sorted = [...list].sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0));
      setTags(sorted);
    } catch (err) {
      setFetchError(err.message || "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const data = await getTags();
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0));
        setTags(sorted);
      } catch (err) {
        if (!isMounted) return;
        setFetchError(err.message || "Gagal memuat kategori");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  // Turunkan skill dan minat
  const skillItems = useMemo(
    () => tags.filter((t) => t.jenis === "skill").sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0)),
    [tags]
  );

  const minatItems = useMemo(
    () => tags.filter((t) => t.jenis === "minat").sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0)),
    [tags]
  );

  const totalCount = tags.length;
  const skillCount = skillItems.length;
  const minatCount = minatItems.length;

  // Handler Tambah & Ubah
  function handleOpenAdd(jenis) {
    setFormMode("add");
    setFormDefaultJenis(jenis);
    setFormInitialData(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(item) {
    setFormMode("edit");
    setFormDefaultJenis(item.jenis);
    setFormInitialData(item);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(payload) {
    if (formMode === "add") {
      const created = await createTag(payload);
      setTags((prev) => [...prev, created].sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0)));
    } else if (formMode === "edit" && formInitialData) {
      const updated = await updateTag(formInitialData.tag_id, payload);
      setTags((prev) =>
        prev
          .map((t) => (t.tag_id === updated.tag_id ? updated : t))
          .sort((a, b) => (a.tag_id || 0) - (b.tag_id || 0))
      );
    }
  }

  // Handler Hapus
  function handleOpenDelete(item) {
    setItemToDelete(item);
    setDeleteError("");
    setIsConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteTag(itemToDelete.tag_id);
      setTags((prev) => prev.filter((t) => t.tag_id !== itemToDelete.tag_id));
      setIsConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus kategori");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="max-w-[1360px] mx-auto space-y-6 p-8">
      {/* Header */}
      <KategoriHeader total={totalCount} loading={loading} />

      {/* Error state alert jika fetch gagal */}
      {fetchError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{fetchError}</span>
          </div>
          <button
            type="button"
            onClick={fetchTagsData}
            className="font-bold underline hover:no-underline cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* 3 Metrics Cards */}
      <KategoriStatCards
        total={totalCount}
        skillCount={skillCount}
        minatCount={minatCount}
        loading={loading}
      />

      {/* Two Column Panels (Skill & Minat) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <KategoriPanel
          variant="skill"
          items={skillItems}
          loading={loading}
          onAdd={() => handleOpenAdd("skill")}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
        <KategoriPanel
          variant="minat"
          items={minatItems}
          loading={loading}
          onAdd={() => handleOpenAdd("minat")}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Bottom Banner */}
      <TipsBanner />

      {/* Form Modal (Tambah / Ubah) */}
      <KategoriFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        initialData={formInitialData}
        defaultJenis={formDefaultJenis}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Hapus Kategori"
        itemName={itemToDelete?.nama_tag || ""}
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleteLoading) {
            setIsConfirmOpen(false);
            setItemToDelete(null);
            setDeleteError("");
          }
        }}
      />
    </div>
  );
}
