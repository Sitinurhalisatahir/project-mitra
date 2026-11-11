"use client";

import { useState } from "react";
import TagPicker from "@/components/mahasiswa/profil/TagPicker";

export default function ProyekForm({
  editProject = null,
  availableTags = [],
  loadingTags = false,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  fieldErrors = {},
  generalError = null,
  formRef,
}) {
  const isEditMode = Boolean(editProject);

  const [judul, setJudul] = useState(editProject?.judul || "");
  const [kategori, setKategori] = useState(editProject?.kategori || "lomba");
  const [slotText, setSlotText] = useState(
    editProject ? `${editProject.slot_dibutuhkan || 4} Anggota` : "4 Anggota"
  );
  const [deskripsi, setDeskripsi] = useState(editProject?.deskripsi || "");
  const [selectedTags, setSelectedTags] = useState(
    Array.isArray(editProject?.tags) ? editProject.tags : []
  );
  const [deadline, setDeadline] = useState(
    editProject?.deadline ? editProject.deadline.substring(0, 10) : ""
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Tanggal hari ini (zona waktu lokal) untuk batas minimum deadline.
  // toISOString() memakai UTC sehingga di WITA bisa mundur satu hari.
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  function handleRemoveTag(tagId) {
    setSelectedTags((prev) => prev.filter((t) => t.tag_id !== tagId));
  }

  function handleAddTag(tag) {
    if (!selectedTags.some((t) => t.tag_id === tag.tag_id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Parse slot number
    const parsedSlot = parseInt(slotText.replace(/\D/g, ""), 10);
    const slotDibutuhkan = Number.isFinite(parsedSlot)
      ? Math.max(1, Math.min(50, parsedSlot))
      : 1;

    const payload = {
      judul: judul.trim(),
      kategori,
      slot_dibutuhkan: slotDibutuhkan,
      deskripsi: deskripsi.trim() || undefined,
      deadline: deadline || undefined,
      tag_ids: selectedTags.map((t) => t.tag_id),
    };

    onSubmit(payload, isEditMode);
  }

  return (
    <div
      ref={formRef}
      className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm flex flex-col gap-space-lg"
    >
      <div className="flex items-start gap-space-md">
        <div className="w-11 h-11 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            {isEditMode ? "edit_square" : "create_new_folder"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-headline-md text-on-surface font-bold leading-tight">
            {isEditMode ? "Edit Postingan Proyek" : "Buat Postingan Proyek Baru"}
          </h2>
          <p className="text-body-md text-on-surface-variant">
            {isEditMode
              ? "Perbarui detail proyek, kebutuhan skill, atau kuota anggota."
              : "Buka kesempatan kolaborasi tim untuk tugas kuliah, lomba, atau proyek mandiri."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-space-xs">
        {generalError && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {generalError}
          </div>
        )}

        {/* Input Judul Proyek */}
        <div className="flex flex-col gap-space-xs">
          <label
            htmlFor="judul-proyek"
            className="text-pill-tag text-on-surface font-semibold"
          >
            Judul Proyek
          </label>
          <input
            id="judul-proyek"
            type="text"
            required
            maxLength={150}
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Pengembangan Aplikasi Monitoring Sampah Kampus"
            className="w-full px-space-md py-space-sm rounded-2xl bg-surface-container-low text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {fieldErrors.judul && (
            <p className="text-xs text-red-600 mt-0.5">{fieldErrors.judul}</p>
          )}
        </div>

        {/* Grid 2 Sejajar: Kategori & Jumlah Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="kategori-proyek"
              className="text-pill-tag text-on-surface font-semibold"
            >
              Kategori Proyek
            </label>
            <div className="relative">
              <select
                id="kategori-proyek"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-space-md py-space-sm rounded-2xl bg-surface-container-low text-on-surface text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-container transition-all pr-10 cursor-pointer"
              >
                <option value="tugas_kuliah">Tugas Kuliah</option>
                <option value="lomba">Lomba</option>
                <option value="personal">Personal</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
            {fieldErrors.kategori && (
              <p className="text-xs text-red-600 mt-0.5">
                {fieldErrors.kategori}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="slot-anggota"
              className="text-pill-tag text-on-surface font-semibold"
            >
              Jumlah Slot Anggota
            </label>
            <input
              id="slot-anggota"
              type="text"
              value={slotText}
              onChange={(e) => setSlotText(e.target.value)}
              placeholder="Contoh: 3 Anggota"
              className="w-full px-space-md py-space-sm rounded-2xl bg-surface-container-low text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
            {fieldErrors.slot_dibutuhkan && (
              <p className="text-xs text-red-600 mt-0.5">
                {fieldErrors.slot_dibutuhkan}
              </p>
            )}
          </div>
        </div>

        {/* Textarea Deskripsi Proyek */}
        <div className="flex flex-col gap-space-xs">
          <label
            htmlFor="deskripsi-proyek"
            className="text-pill-tag text-on-surface font-semibold"
          >
            Deskripsi Proyek
          </label>
          <textarea
            id="deskripsi-proyek"
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Jelaskan tujuan proyek, pembagian peran, metodologi kerja, dan ekspektasi kontribusi anggota tim..."
            className="w-full p-space-md rounded-2xl bg-surface-container-low text-on-surface placeholder:text-outline text-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {fieldErrors.deskripsi && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.deskripsi}
            </p>
          )}
        </div>

        {/* Skill Dibutuhkan */}
        <div className="flex flex-col gap-space-xs">
          <label className="text-pill-tag text-on-surface font-semibold">
            Skill Dibutuhkan
          </label>
          <div className="flex flex-wrap items-center gap-space-xs pt-0.5">
            {selectedTags.map((tag) => (
              <span
                key={tag.tag_id}
                className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-high text-primary text-pill-tag font-semibold"
              >
                {tag.nama_tag || tag.nama}
                <button
                  type="button"
                  aria-label={`Hapus skill ${tag.nama_tag || tag.nama}`}
                  onClick={() => handleRemoveTag(tag.tag_id)}
                  className="hover:opacity-75 inline-flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </span>
            ))}

            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-primary text-pill-tag font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>
                Tambah Skill
              </button>

              <TagPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                availableTags={availableTags.filter(
                  (at) => !selectedTags.some((st) => st.tag_id === at.tag_id)
                )}
                onSelectTag={(tag) => {
                  handleAddTag(tag);
                  setIsPickerOpen(false);
                }}
                loading={loadingTags}
                jenis="skill"
              />
            </div>
          </div>
          {fieldErrors.tag_ids && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.tag_ids}
            </p>
          )}
        </div>

        {/* Input Tanggal Deadline */}
        <div className="flex flex-col gap-space-xs">
          <label
            htmlFor="deadline-proyek"
            className="text-pill-tag text-on-surface font-semibold"
          >
            Deadline Proyek
          </label>
          <input
            id="deadline-proyek"
            type="date"
            min={todayStr}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-space-md py-space-sm rounded-2xl bg-surface-container-low text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all cursor-pointer"
          />
          {fieldErrors.deadline && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.deadline}
            </p>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-space-sm py-3.5 px-space-md bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-container rounded-2xl text-title-lg font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-space-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isEditMode ? "save" : "send"}
          </span>
          {isSubmitting
            ? isEditMode
              ? "Menyimpan Perubahan..."
              : "Memublikasikan..."
            : isEditMode
            ? "Simpan Perubahan"
            : "Publikasikan Proyek"}
        </button>

        {isEditMode && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancelEdit}
            className="w-full py-3.5 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-2xl text-title-lg font-semibold transition-all flex items-center justify-center gap-space-xs cursor-pointer"
          >
            Batal
          </button>
        )}
      </form>
    </div>
  );
}

