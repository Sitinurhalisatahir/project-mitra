"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import VerifikasiHeader from "@/components/admin/verifikasi/VerifikasiHeader";
import VerifikasiStatCards from "@/components/admin/verifikasi/VerifikasiStatCards";
import VerifikasiTable from "@/components/admin/verifikasi/VerifikasiTable";
import ValidationNotice from "@/components/admin/verifikasi/ValidationNotice";
import ConfirmDialog from "@/components/admin/kategori/ConfirmDialog";
import AdminToast from "@/components/admin/AdminToast";
import {
  getSemuaPengguna,
  verifikasiPengguna,
  cabutVerifikasiPengguna,
  tolakPengguna,
} from "@/lib/frontend/api/admin";

export default function AdminVerifikasiPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "menunggu", "verified"
  const [processingId, setProcessingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastFetched, setLastFetched] = useState(null);
  const [relativeTime, setRelativeTime] = useState("baru saja");

  // Reject Confirmation State
  const [userToReject, setUserToReject] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectError, setRejectError] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getSemuaPengguna({ limit: 100 });
      const items = Array.isArray(res) ? res : res?.items || [];
      const studentOnly = items.filter((u) => u.role === "mahasiswa");
      setUsers(studentOnly);
      setLastFetched(new Date());
    } catch (err) {
      setErrorMsg(err.message || "Gagal memuat daftar pengguna");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const res = await getSemuaPengguna({ limit: 100 });
        if (!isMounted) return;
        const items = Array.isArray(res) ? res : res?.items || [];
        const studentOnly = items.filter((u) => u.role === "mahasiswa");
        setUsers(studentOnly);
        setLastFetched(new Date());
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg(err.message || "Gagal memuat daftar pengguna");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  // Hitung waktu relatif setelah mount
  useEffect(() => {
    if (!lastFetched) return;
    const updateRelative = () => {
      const diffSec = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
      if (diffSec < 60) {
        setRelativeTime("baru saja");
      } else {
        const diffMin = Math.floor(diffSec / 60);
        setRelativeTime(`${diffMin} menit lalu`);
      }
    };
    updateRelative();
    const timer = setInterval(updateRelative, 30000);
    return () => clearInterval(timer);
  }, [lastFetched]);

  // Penghitungan agregasi data
  const allCount = users.length;
  const menungguCount = useMemo(
    () => users.filter((u) => !u.is_verified).length,
    [users]
  );
  const verifiedCount = useMemo(
    () => users.filter((u) => Boolean(u.is_verified)).length,
    [users]
  );

  // Filter daftar pengguna berdasarkan tab aktif
  const filteredUsers = useMemo(() => {
    if (filter === "menunggu") {
      return users.filter((u) => !u.is_verified);
    }
    if (filter === "verified") {
      return users.filter((u) => Boolean(u.is_verified));
    }
    return users;
  }, [users, filter]);

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setCurrentPage(1);
    setErrorMsg("");
  }

  // Aksi: Setujui Verifikasi
  async function handleVerify(id) {
    if (processingId) return;
    setProcessingId(id);
    setErrorMsg("");

    const targetUser = users.find((u) => u.pengguna_id === id);

    try {
      await verifikasiPengguna(id);
      setUsers((prev) =>
        prev.map((u) =>
          u.pengguna_id === id ? { ...u, is_verified: true } : u
        )
      );
      setLastFetched(new Date());
      setRelativeTime("baru saja");
      showToast(`Akun ${targetUser?.nama || "mahasiswa"} berhasil diverifikasi!`, "success");
    } catch (err) {
      setErrorMsg(err.message || "Gagal memverifikasi akun");
      showToast(err.message || "Gagal memverifikasi akun", "error");
    } finally {
      setProcessingId(null);
    }
  }

  // Aksi: Cabut Verifikasi
  async function handleRevoke(id) {
    if (processingId) return;
    setProcessingId(id);
    setErrorMsg("");

    const targetUser = users.find((u) => u.pengguna_id === id);

    try {
      await cabutVerifikasiPengguna(id);
      setUsers((prev) =>
        prev.map((u) =>
          u.pengguna_id === id ? { ...u, is_verified: false } : u
        )
      );
      setLastFetched(new Date());
      setRelativeTime("baru saja");
      showToast(`Status verifikasi akun ${targetUser?.nama || "mahasiswa"} berhasil dicabut.`, "success");
    } catch (err) {
      setErrorMsg(err.message || "Gagal mencabut verifikasi akun");
      showToast(err.message || "Gagal mencabut verifikasi", "error");
    } finally {
      setProcessingId(null);
    }
  }

  // Aksi: Buka Dialog Tolak
  function handleOpenReject(user) {
    setUserToReject(user);
    setRejectError("");
  }

  // Aksi: Konfirmasi Tolak Pengguna
  async function handleConfirmReject() {
    if (!userToReject) return;
    setRejectLoading(true);
    setRejectError("");

    try {
      await tolakPengguna(userToReject.pengguna_id);
      setUsers((prev) => prev.filter((u) => u.pengguna_id !== userToReject.pengguna_id));
      showToast(`Pendaftaran ${userToReject.nama} berhasil ditolak dan dihapus.`, "success");
      setUserToReject(null);
    } catch (err) {
      setRejectError(err.message || "Gagal menolak pendaftaran akun");
    } finally {
      setRejectLoading(false);
    }
  }

  return (
    <main className="w-full px-8 pb-12 max-w-[1500px] flex flex-col justify-start">
      <div className="flex flex-col w-full">
        {/* Headline and Badge */}
        <VerifikasiHeader menungguCount={menungguCount} />

        {/* 3 Metric Stat Cards */}
        <VerifikasiStatCards
          totalCount={allCount}
          menungguCount={menungguCount}
          verifiedCount={verifiedCount}
        />

        {/* Table Card Container */}
        <VerifikasiTable
          users={filteredUsers}
          allCount={allCount}
          menungguCount={menungguCount}
          verifiedCount={verifiedCount}
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          relativeTime={relativeTime}
          loading={loading}
          processingId={processingId}
          onVerify={handleVerify}
          onRevoke={handleRevoke}
          onReject={handleOpenReject}
          errorMsg={errorMsg}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
        />

        {/* Ketentuan Validasi Akun Mahasiswa */}
        <ValidationNotice />

        {/* Modal Konfirmasi Tolak Pendaftaran */}
        <ConfirmDialog
          isOpen={Boolean(userToReject)}
          title="Tolak Pendaftaran Mahasiswa"
          itemName={userToReject?.nama || ""}
          description={
            userToReject ? (
              <>
                Apakah Anda yakin ingin menolak pendaftaran akun{" "}
                <span className="font-semibold text-slate-800">{userToReject.nama}</span>{" "}
                (NIM: <span className="font-semibold text-slate-800">{userToReject.nim}</span>)?
                Data pendaftaran ini akan dihapus dari sistem.
              </>
            ) : ""
          }
          confirmText="Tolak & Hapus"
          loading={rejectLoading}
          error={rejectError}
          onConfirm={handleConfirmReject}
          onClose={() => {
            if (!rejectLoading) {
              setUserToReject(null);
              setRejectError("");
            }
          }}
        />

        {/* Toast Notification */}
        <AdminToast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </main>
  );
}
