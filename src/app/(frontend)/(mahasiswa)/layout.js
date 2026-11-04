import MahasiswaGuard from "@/components/mahasiswa/MahasiswaGuard";
import MahasiswaSidebar from "@/components/mahasiswa/MahasiswaSidebar";
import MahasiswaTopbar from "@/components/mahasiswa/MahasiswaTopbar";

export default function MahasiswaLayout({ children }) {
  return (
    <MahasiswaGuard>
      <MahasiswaSidebar />
      <div className="pl-72">
        <MahasiswaTopbar />
        <main className="relative pt-16 min-h-screen bg-surface p-space-xl">
          {children}
        </main>
      </div>
    </MahasiswaGuard>
  );
}

