"use client";

import { useEffect } from "react";

export default function AdminToast({
  show,
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!show || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, onClose, duration]);

  if (!show || !message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border ${
          type === "success"
            ? "bg-slate-900 text-white border-slate-800"
            : "bg-rose-600 text-white border-rose-500"
        }`}
        role="alert"
      >
        <span className="material-symbols-outlined text-[18px]">
          {type === "success" ? "check_circle" : "error"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

