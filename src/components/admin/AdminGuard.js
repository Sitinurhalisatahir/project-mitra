"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearSession } from "@/lib/frontend/session";
import { getAdminMe } from "@/lib/frontend/api/admin";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await getAdminMe();
        if (!isMounted) return;

        if (!user || user.role !== "admin") {
          router.replace("/");
          return;
        }

        setAuthorized(true);
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

  if (!authorized) {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  return children;
}

