"use client";

import NotifikasiItem from "./NotifikasiItem";

export default function NotifikasiList({
  notifications = [],
  loading = false,
  onMarkRead,
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-space-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="h-20 rounded-2xl bg-surface-container-low animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm text-center py-10">
        <p className="text-body-md text-on-surface-variant">
          Belum ada notifikasi
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-sm" id="notification-list">
      {notifications.map((item) => (
        <NotifikasiItem
          key={item.notifikasi_id}
          item={item}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}

