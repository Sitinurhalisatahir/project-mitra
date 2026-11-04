"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearSession } from "@/lib/frontend/session";
import { getMahasiswaMe } from "@/lib/frontend/api/mahasiswa";

const MahasiswaContext = createContext(null);

export function useMahasiswa() {
  return useContext(MahasiswaContext);
}

export default function MahasiswaGuard({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unverified, setUnverified] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const userData = await getMahasiswaMe();
        if (!isMounted) return;

        if (!userData) {
          clearSession();
          router.replace("/login");
          return;
        }

        if (userData.role === "admin") {
          router.replace("/admin");
          return;
        }

        if (!userData.is_verified) {
          setUnverified(true);
          setLoading(false);
          return;
        }

        setUser(userData);
        setLoading(false);
      } catch {
        if (!isMounted) return;
        clearSession();
        router.replace("/login");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  if (loading) {
    return <div className="min-h-screen bg-surface" />;
  }

  if (unverified) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full shadow-sm border border-outline-variant/30 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
          </div>
          <h2 className="text-title-lg font-bold text-on-surface mb-2">
            Akun Belum Terverifikasi
          </h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Akun kamu belum diverifikasi admin
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-primary text-on-primary rounded-full text-body-md font-semibold hover:bg-primary-container transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <MahasiswaContext.Provider value={{ user, setUser }}>
      {children}
    </MahasiswaContext.Provider>
  );
}

