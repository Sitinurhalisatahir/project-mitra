"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { formatNotificationTime } from "@/lib/frontend/utils/format";

const NOTIFIKASI_TYPE_CONFIG = {
  pesan: {
    title: "Pesan baru",
    icon: "chat",
    bg: "bg-primary-fixed",
    text: "text-primary",
    href: "/chat",
    filledIcon: false,
  },
  pelamar: {
    title: "Ada pelamar baru di proyek Anda",
    icon: "person_add",
    bg: "bg-secondary-fixed",
    text: "text-secondary",
    href: "/proyek-saya",
    filledIcon: false,
  },
  rekomendasi: {
    title: "Rekomendasi proyek baru untuk Anda",
    icon: "star",
    bg: "bg-secondary-fixed-dim/30",
    text: "text-secondary",
    href: "/proyek",
    filledIcon: true,
  },
  status_lamaran: {
    title: "Status lamaran Anda diperbarui",
    icon: "verified",
    bg: "bg-tertiary-fixed",
    text: "text-tertiary",
    href: "/proyek",
    filledIcon: true,
  },
};

const DEFAULT_CONFIG = {
  title: "Notifikasi",
  icon: "info",
  bg: "bg-primary-fixed",
  text: "text-primary",
  href: "/dashboard",
  filledIcon: false,
};

function useNotificationTime(dateStr) {
  return useSyncExternalStore(
    () => () => {},
    () => formatNotificationTime(dateStr),
    () => "..."
  );
}

export default function NotifikasiItem({ item, onMarkRead }) {
  const router = useRouter();
  const formattedTime = useNotificationTime(item.created_at);

  const typeConfig = NOTIFIKASI_TYPE_CONFIG[item.tipe] || DEFAULT_CONFIG;
  const isUnread = !item.is_read;

  function handleClick() {
    if (isUnread && onMarkRead) {
      onMarkRead(item.notifikasi_id);
    }
    router.push(typeConfig.href);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative group flex items-center justify-between p-space-md sm:p-space-lg rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
        isUnread ? "bg-surface-container-low" : "bg-surface-container-lowest"
      }`}
    >
      <div className="flex items-center gap-space-md min-w-0 pr-space-md">
        {/* Icon box */}
        <div
          className={`relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-[3rem] ${typeConfig.bg} ${typeConfig.text}`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={
              typeConfig.filledIcon
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {typeConfig.icon}
          </span>
          {isUnread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-container ring-4 ring-surface-container-low" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          {isUnread ? (
            <div className="flex items-center gap-2">
              <span className="text-title-lg font-bold text-on-surface truncate">
                {typeConfig.title}
              </span>
              <span
                className="inline-block w-2 h-2 rounded-full bg-primary-container flex-shrink-0"
                title="Belum dibaca"
              />
            </div>
          ) : (
            <span className="text-title-lg font-medium text-on-surface truncate">
              {typeConfig.title}
            </span>
          )}

          <p className="text-body-md text-on-surface-variant truncate mt-0.5">
            {item.isi}
          </p>
        </div>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 flex flex-col items-end pl-space-sm text-right">
        <span className="text-label-md text-on-surface-variant whitespace-nowrap">
          {formattedTime || "..."}
        </span>
      </div>
    </div>
  );
}
