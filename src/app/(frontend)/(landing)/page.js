import HeroSection from "@/components/landing/beranda/HeroSection";
import FeaturesPreview from "@/components/landing/beranda/FeaturesPreview";

export const metadata = {
  title: "SkillMatch - Platform Kolaborasi Mahasiswa",
};

export default function BerandaPage() {
  return (
    <>
      <HeroSection />
      <FeaturesPreview />
    </>
  );
}