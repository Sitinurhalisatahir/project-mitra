"use client";

import PelamarRow from "./PelamarRow";
import {
  formatProjectCategory,
  formatShortDateIndonesian,
} from "@/lib/frontend/utils/format";

export default function ProyekPostCard({
  proyek,
  applicants = [],
  loadingApplicants = false,
  applicantError = null,
  isSelected = false,
  totalProjects = 1,
  onSelect,
  onEdit,
  onToggleStatus,
  isUpdatingStatus = false,
  onUpdateApplicantStatus,
  processingApplicantId = null,
}) {
  const terisi =
    applicants.filter((a) => a.status === "diterima").length ||
    proyek.slot_terisi ||
    0;
  const slotDibutuhkan = proyek.slot_dibutuhkan || 1;
  const percent = Math.min(100, Math.round((terisi / slotDibutuhkan) * 100));

  const pendingCount = applicants.filter((a) => a.status === "pending").length;

  const sortedApplicants = [...applicants].sort((a, b) => {
    const order = { pending: 1, diterima: 2, ditolak: 3 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  return (
    <div
      onClick={totalProjects > 1 && onSelect ? onSelect : undefined}
      className={`bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm flex flex-col gap-space-md transition-all ${
        isSelected && totalProjects > 1 ? "ring-2 ring-primary-container" : ""
      } ${totalProjects > 1 ? "cursor-pointer" : ""}`}
    >
      {/* Card Top Header */}
      <div className="flex items-start justify-between gap-space-md flex-wrap sm:flex-nowrap">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-space-xs flex-wrap">
            {proyek.status === "buka" ? (
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-label-md font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Buka
              </span>
            ) : proyek.status === "ditutup" ? (
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-semibold">
                Ditutup
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-semibold">
                Selesai
              </span>
            )}
          </div>
          <h3 className="text-title-lg font-bold text-on-surface leading-snug">
            {proyek.judul}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(proyek);
            }}
            className="px-3 py-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit
          </button>
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={(e) => {
              e.stopPropagation();
              if (proyek.status === "buka") {
                if (
                  window.confirm(
                    `Tutup postingan "${proyek.judul}"? Mahasiswa lain tidak bisa melamar lagi.`
                  )
                ) {
                  onToggleStatus(proyek.proyek_id, "ditutup");
                }
              } else {
                if (
                  window.confirm(
                    `Buka kembali postingan "${proyek.judul}"?`
                  )
                ) {
                  onToggleStatus(proyek.proyek_id, "buka");
                }
              }
            }}
            className="px-3 py-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[16px]">
              {proyek.status === "buka" ? "lock" : "lock_open"}
            </span>
            {proyek.status === "buka" ? "Tutup Postingan" : "Buka Kembali"}
          </button>
        </div>
      </div>

      {/* Info Metadata Bar */}
      <div className="flex flex-col gap-space-xs p-space-md rounded-2xl bg-surface-container-low">
        <div className="flex flex-wrap items-center justify-between text-label-md text-on-surface-variant gap-2">
          <span>
            Kategori:{" "}
            <strong className="text-on-surface font-semibold">
              {formatProjectCategory(proyek.kategori)}
            </strong>
          </span>
          <span>
            Slot:{" "}
            <strong className="text-primary font-bold">
              {terisi} dari {proyek.slot_dibutuhkan} Anggota
            </strong>
          </span>
          <span>
            Deadline:{" "}
            <strong className="text-on-surface font-semibold">
              {proyek.deadline
                ? formatShortDateIndonesian(proyek.deadline)
                : "Tanpa deadline"}
            </strong>
          </span>
        </div>
        {/* Slot Visual Progress */}
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-0.5">
          <div
            className="bg-primary-container h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Subsection Header: Daftar Pelamar */}
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-space-sm">
          <h4 className="text-title-lg font-bold text-on-surface">
            Daftar Pelamar
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-bold">
            {pendingCount} Menunggu Respon
          </span>
        </div>
      </div>

      {applicantError && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl">
          {applicantError}
        </p>
      )}

      {/* Vertical List of Applicants */}
      <div className="flex flex-col gap-space-sm">
        {loadingApplicants ? (
          <div className="flex flex-col gap-2 py-4">
            <div className="h-14 rounded-2xl bg-surface-container-low animate-pulse" />
            <div className="h-14 rounded-2xl bg-surface-container-low animate-pulse" />
          </div>
        ) : sortedApplicants.length === 0 ? (
          <p className="text-body-md text-on-surface-variant text-center py-6">
            Belum ada pelamar
          </p>
        ) : (
          sortedApplicants.map((applicant) => (
            <PelamarRow
              key={applicant.aplikasi_id}
              applicant={applicant}
              onUpdateStatus={onUpdateApplicantStatus}
              isProcessing={processingApplicantId === applicant.aplikasi_id}
            />
          ))
        )}
      </div>
    </div>
  );
}

