"use client";

import { useEffect, useRef, useState } from "react";

export default function TagPicker({
  isOpen,
  onClose,
  availableTags = [],
  onSelectTag,
  loading = false,
  jenis = "skill",
}) {
  const ref = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTags = availableTags.filter((t) =>
    t.nama_tag.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 z-50 w-72 max-h-80 overflow-hidden bg-surface-container-lowest rounded-2xl shadow-xl p-3 border border-outline-variant/30 flex flex-col gap-2"
    >
      <div className="relative">
        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
          search
        </span>
        <input
          type="text"
          placeholder={`Cari ${jenis}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low text-body-md text-on-surface rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
          autoFocus
        />
      </div>

      <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-1">
        {loading ? (
          <span className="p-3 text-body-md text-on-surface-variant text-center">
            Memuat tag...
          </span>
        ) : availableTags.length === 0 ? (
          <div className="p-3 text-center flex flex-col gap-1">
            <span className="text-body-md text-on-surface-variant font-medium">
              Belum ada {jenis} dari admin
            </span>
            <span className="text-xs text-outline">
              Admin belum menambahkan kategori {jenis} di sistem.
            </span>
          </div>
        ) : filteredTags.length === 0 ? (
          <span className="p-3 text-body-md text-on-surface-variant text-center">
            Tidak ditemukan &quot;{searchTerm}&quot;
          </span>
        ) : (
          filteredTags.map((tag) => (
            <button
              key={tag.tag_id}
              type="button"
              onClick={() => {
                onSelectTag(tag);
                setSearchTerm("");
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-body-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-between group"
            >
              <span className="font-medium group-hover:text-primary transition-colors">
                {tag.nama_tag}
              </span>
              <span className="material-symbols-outlined text-outline text-[16px] group-hover:text-primary">
                add
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
