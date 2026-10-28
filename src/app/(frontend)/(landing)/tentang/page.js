import TentangHero from "@/components/landing/tentang/TentangHero";
import TentangValues from "@/components/landing/tentang/TentangValues";
import TentangAudience from "@/components/landing/tentang/TentangAudience";

export const metadata = {
  title: "SkillMatch - Tentang Kami",
  description: "Kenali latar belakang, visi, misi, dan nilai utama SkillMatch dalam memajukan kolaborasi mahasiswa di Indonesia.",
};

export default function TentangPage() {
  return (
    <>
      <TentangHero />
      <TentangValues />
      <TentangAudience />
    </>
  );
}
