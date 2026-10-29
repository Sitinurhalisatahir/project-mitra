"use client";

import { getInitials } from "@/lib/frontend/utils/format";

export default function VerificationItem({ user, isVerifying, onVerify }) {
  const initials = getInitials(user?.nama);

  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-indigo-50 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 leading-tight truncate">
            {user?.nama}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            NIM: {user?.nim}
          </div>
        </div>
      </div>
      <button
        type="button"
        disabled={isVerifying}
        onClick={() => onVerify(user?.pengguna_id)}
        className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-full shadow-sm transition-colors flex items-center space-x-1 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isVerifying ? (
          <span>Memproses...</span>
        ) : (
          <>
            <span>✓</span>
            <span>Verifikasi</span>
          </>
        )}
      </button>
    </div>
  );
}

