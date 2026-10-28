import HeroSection from "@/components/landing/beranda/HeroSection";
import FeaturesPreview from "@/components/landing/beranda/FeaturesPreview";
import CategoriesSection from "@/components/landing/beranda/CategoriesSection";
import TestimonialsSection from "@/components/landing/beranda/TestimonialsSection";
import CtaBanner from "@/components/landing/beranda/CtaBanner";

export const metadata = {
  title: "SkillMatch - Platform Kolaborasi Proyek Mahasiswa",
  description: "Temukan rekan tim proyek, tugas kuliah, dan hackathon berdasarkan kecocokan skill, minat, dan ketersediaan waktu.",
};

export default function BerandaPage() {
  return (
    <>
      <HeroSection />
      <FeaturesPreview />
      <CategoriesSection />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
