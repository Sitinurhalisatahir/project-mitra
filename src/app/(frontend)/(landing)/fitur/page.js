import Link from "next/link";
import FiturHeader from "@/components/landing/fitur/FiturHeader";
import FiturCard from "@/components/landing/fitur/FiturCard";
import ProfilPreview from "@/components/landing/fitur/ProfilPreview";
import MatchPreview from "@/components/landing/fitur/MatchPreview";
import ChatPreview from "@/components/landing/fitur/ChatPreview";
import FiturFaq from "@/components/landing/fitur/FiturFaq";

export const metadata = {
  title: "SkillMatch - Fitur",
  description: "Jelajahi fitur utama SkillMatch: Profil Skill & Minat, Pencarian Mitra Cerdas, dan Chat Kolaborasi Langsung.",
};

export default function FiturPage() {
  return (
    <section className="relative isolate w-full max-w-[1440px] mx-auto px-gutter py-space-xl overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-primary-container/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-48 -right-24 w-80 h-80 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <FiturHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-stretch">
        <FiturCard
          icon="account_circle"
          label="Fitur 01"
          title="Profil Skill & Minat"
          description="Mahasiswa dapat membangun profil berisi jurusan, skill, minat, pengalaman, dan ketersediaan waktu"
        >
          <ProfilPreview />
        </FiturCard>

        <FiturCard
          icon="manage_search"
          label="Fitur 02"
          title="Pencarian & Rekomendasi Mitra"
          description="Mencari dan mendapatkan rekomendasi mitra atau proyek berdasarkan kecocokan skill dan minat"
        >
          <MatchPreview />
        </FiturCard>

        <FiturCard
          icon="chat"
          label="Fitur 03"
          title="Chat/Diskusi"
          description="Berkomunikasi langsung dengan calon mitra melalui fitur chat di dalam aplikasi"
        >
          <ChatPreview />
        </FiturCard>
      </div>

      {/* FAQ Section */}
      <FiturFaq />

      {/* Bottom CTA Banner */}
      <div className="mt-20 text-center bg-gradient-to-r from-primary-fixed/40 via-surface-container-low to-secondary-fixed/30 rounded-3xl p-8 sm:p-12 border border-outline-variant/30 flex flex-col items-center max-w-3xl mx-auto shadow-sm">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
          Siap Berkolaborasi di Proyek Impianmu?
        </h3>
        <p className="text-on-surface-variant text-base mb-6 max-w-xl">
          Gabung sekarang dengan ratusan mahasiswa lainnya dan bangun tim hebat untuk kompetisi, riset, atau tugas kuliahmu.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-bold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
        >
          <span>Daftar Sekarang — Gratis</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
