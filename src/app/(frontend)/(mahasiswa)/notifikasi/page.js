"use client";

import { useEffect, useState, useCallback } from "react";
import NotifikasiHeader from "@/components/mahasiswa/notifikasi/NotifikasiHeader";
import NotifikasiList from "@/components/mahasiswa/notifikasi/NotifikasiList";
import {
  getNotifikasi,
  tandaiNotifikasiDibaca,
} from "@/lib/frontend/api/mahasiswa";

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadNotifications = useCallback(() => {
    setLoading(true);
    setError(null);
    getNotifikasi(false, 50)
      .then((res) => {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat notifikasi");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;

    getNotifikasi(false, 50)
      .then((res) => {
        if (!ignore) {
          setNotifications(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "Gagal memuat notifikasi");
          setLoading(false);
        }
      });

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        getNotifikasi(false, 50)
          .then((res) => {
            if (!ignore) {
              setNotifications(Array.isArray(res.data) ? res.data : []);
            }
          })
          .catch(() => {});
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      ignore = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function handleMarkRead(notifikasiId) {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n.notifikasi_id === notifikasiId ? { ...n, is_read: true } : n
      )
    );

    // Notify Topbar bell icon
    window.dispatchEvent(new CustomEvent("notifikasi:berubah"));

    try {
      await tandaiNotifikasiDibaca(notifikasiId);
    } catch {
      // Rollback on failure
      setNotifications((prev) =>
        prev.map((n) =>
          n.notifikasi_id === notifikasiId ? { ...n, is_read: false } : n
        )
      );
      window.dispatchEvent(new CustomEvent("notifikasi:berubah"));
    }
  }

  return (
    <div className="max-w-4xl w-full mx-auto pb-space-xl">
      <NotifikasiHeader />

      {error && (
        <div className="mb-space-md p-3 rounded-2xl bg-error-container text-on-error-container text-body-md flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={reloadNotifications}
            className="px-3 py-1 bg-error text-on-error rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            Coba lagi
          </button>
        </div>
      )}

      <NotifikasiList
        notifications={notifications}
        loading={loading}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
