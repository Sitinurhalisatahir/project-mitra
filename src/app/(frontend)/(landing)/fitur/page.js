import FiturHeader from "@/components/landing/fitur/FiturHeader";
import FiturCard from "@/components/landing/fitur/FiturCard";
import ProfilPreview from "@/components/landing/fitur/ProfilPreview";
import MatchPreview from "@/components/landing/fitur/MatchPreview";
import ChatPreview from "@/components/landing/fitur/ChatPreview";

export const metadata = {
  title: "SkillMatch - Fitur",
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
    </section>
  );
}