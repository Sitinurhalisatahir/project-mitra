"use client";

import { IconInfo, IconChevronLeft, IconChevronRight } from "@/components/admin/icons";
import VerifikasiRow from "./VerifikasiRow";

export default function VerifikasiTable({
  users = [],
  allCount = 0,
  menungguCount = 0,
  verifiedCount = 0,
  currentFilter = "all", // "all", "menunggu", "verified"
  onFilterChange,
  relativeTime = "baru saja",
  loading = false,
  processingId = null,
  onVerify,
  errorMsg = "",
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}) {
  const totalItems = users.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Card Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-slate-900">Daftar Pengajuan Akun</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            Total {allCount} Data
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <IconInfo className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Akun terverifikasi mendapatkan akses penuh fitur matchmaking kampus</span>
        </div>
      </div>

      {/* Subheader with Filter Tabs and Sync Indicator */}
      <div className="px-8 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {/* Semua */}
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              currentFilter === "all"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Semua ({allCount})
          </button>

          {/* Menunggu */}
          <button
            type="button"
            onClick={() => onFilterChange("menunggu")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentFilter === "menunggu"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentFilter === "menunggu" ? "bg-white" : "bg-amber-400"
              }`}
            />
            Menunggu ({menungguCount})
          </button>

          {/* Terverifikasi */}
          <button
            type="button"
            onClick={() => onFilterChange("verified")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentFilter === "verified"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentFilter === "verified" ? "bg-white" : "bg-emerald-500"
              }`}
            />
            Terverifikasi ({verifiedCount})
          </button>
        </div>

        {/* Sync indicator */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sinkronisasi otomatis aktif • Diperbarui {relativeTime}</span>
        </div>
      </div>

      {/* Error alert if verification fails */}
      {errorMsg && (
        <div className="px-8 py-2.5 bg-red-50 border-b border-red-100 text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <th className="py-4 px-8" scope="col">
                NIM
              </th>
              <th className="py-4 px-6" scope="col">
                NAMA MAHASISWA
              </th>
              <th className="py-4 px-6" scope="col">
                EMAIL
              </th>
              <th className="py-4 px-6" scope="col">
                STATUS
              </th>
              <th className="py-4 px-8 text-center" scope="col">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-800 text-sm">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-8">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-slate-200 rounded" />
                        <div className="h-2.5 w-20 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-36 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-28 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-8 text-center">
                    <div className="h-7 w-20 bg-slate-200 rounded-full mx-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400 font-medium">
                  Tidak ada pengajuan akun
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <VerifikasiRow
                  key={user.pengguna_id}
                  user={user}
                  isProcessing={processingId === user.pengguna_id}
                  onVerify={onVerify}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card Footer with Pagination */}
      <div className="px-8 py-4 bg-white border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Menampilkan {paginatedUsers.length} permohonan terbaru
        </span>
        <div className="flex items-center space-x-2">
          {/* Previous Page */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#4F46E5] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

