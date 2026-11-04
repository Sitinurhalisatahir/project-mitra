"use client";

import { useState } from "react";
import TagPicker from "./TagPicker";

export default function TagChipGroup({
  label,
  jenis,
  selectedTags = [],
  allTags = [],
  onAddTag,
  onRemoveTag,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Filter tag jenis yang sama yang belum dipilih
  const availableTags = allTags.filter(
    (t) => t.jenis === jenis && !selectedTags.some((st) => st.tag_id === t.tag_id)
  );

  const isSkill = jenis === "skill";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-label-md text-on-surface font-semibold">{label}</label>
        <span className="text-label-md text-on-surface-variant font-medium">
          {selectedTags.length} Terpilih
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.tag_id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-pill-tag font-semibold ${
              isSkill
                ? "bg-surface-container text-primary"
                : "bg-secondary-fixed text-on-secondary-fixed-variant"
            }`}
          >
            {tag.nama_tag}
            <button
              aria-label={`Hapus ${isSkill ? "skill" : "minat"}`}
              className={`w-4 h-4 flex items-center justify-center rounded-full transition-colors ${
                isSkill
                  ? "hover:bg-primary/10 text-primary"
                  : "hover:bg-secondary-container/20 text-on-secondary-fixed-variant"
              }`}
              onClick={() => onRemoveTag(tag.tag_id)}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}

        <div className="relative">
          <button
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest text-pill-tag font-semibold transition-all cursor-pointer ${
              isSkill
                ? "text-primary shadow-[inset_0_0_0_1.5px_#c3c0ff] hover:bg-surface-container hover:shadow-none"
                : "text-secondary shadow-[inset_0_0_0_1.5px_#ffddb8] hover:bg-secondary-fixed hover:shadow-none"
            }`}
            type="button"
            onClick={() => setPickerOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {isSkill ? "Tambah Skill" : "Tambah Minat"}
          </button>

          <TagPicker
            isOpen={pickerOpen}
            onClose={() => setPickerOpen(false)}
            availableTags={availableTags}
            jenis={isSkill ? "Skill" : "Minat"}
            onSelectTag={(tag) => {
              onAddTag(tag);
              setPickerOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
