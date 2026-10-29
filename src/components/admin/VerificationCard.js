"use client";

import { useState } from "react";
import Link from "next/link";
import { IconShield } from "./icons";
import VerificationItem from "./VerificationItem";
import { verifikasiPengguna } from "@/lib/frontend/api/admin";

export default function VerificationCard({
  users = [],
  totalWaiting = 0,
  loading = false,
  onVerificationDone,
}) {
  const [verifyingId, setVerifyingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleVerify(id) {
    if (verifyingId) return;
    setErrorMsg("");
    setVerifyingId(id);
    try {
      await verifikasiPengguna(id);
      if (onVerificationDone) {
        onVerificationDone(id);
      }
    } catch (err) {
      setErrorMsg(err.message || "Gagal memverifikasi akun");
    } finally {
      setVerifyingId(null);
    }
  }

  const displayedCount = users.length;
  const countLabel = totalWaiting > 0 ? totalWaiting : displayedCount;

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
      data-purpose="verification-queue"
    >
      <div>
        {/* Header with Title & Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
          <div className="flex items-center space-x-2">
            <IconShield className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Akun Menunggu Verifikasi</h2>
          </div>
          <span className="px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-full border border-amber-200/60">
            {countLabel} Menunggu
          </span>
        </div>

        {/* Error message if action fails */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* List of Students */}
        <div className="divide-y divide-slate-50 pt-1">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-3 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-7 w-20 bg-slate-200 rounded-full" />
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              Tidak ada akun yang menunggu verifikasi
            </div>
          ) : (
            users.map((user) => (
              <VerificationItem
                key={user.pengguna_id}
                user={user}
                isVerifying={verifyingId === user.pengguna_id}
                onVerify={handleVerify}
              />
            ))
          )}
        </div>
      </div>

      {/* Left Card Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Menampilkan {displayedCount} mahasiswa teratas
        </span>
        <Link
          href="/admin/verifikasi"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1 group"
        >
          <span>Kelola Verifikasi</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

