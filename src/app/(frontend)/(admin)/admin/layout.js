import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const metadata = {
  title: "Dashboard Admin - SkillMatch Campus Platform",
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 antialiased">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto" data-purpose="primary-workspace">
          <AdminTopbar />
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

