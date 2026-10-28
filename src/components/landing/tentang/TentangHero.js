import Link from "next/link";
import TentangIllustration from "./TentangIllustration";

const points = [
  {
    icon: "psychology",
    iconBox: "bg-surface-container text-primary-container",
    hover: "group-hover:text-primary",
    title: "Keahlian Spesifik",
    desc: "Sesuai kebutuhan tim & proyek yang jelas",
  },
  {
    icon: "emoji_events",
    iconBox: "bg-secondary-fixed text-on-secondary-fixed-variant",
    hover: "group-hover:text-secondary",
    title: "Minat & Visi",
    desc: "Satu tujuan untuk kompetisi & tugas kuliah",
  },
  {
    icon: "schedule",
    iconBox: "bg-tertiary-fixed text-tertiary",
    hover: "group-hover:text-tertiary",
    title: "Waktu Terukur",
    desc: "Komitmen waktu sinkron antar anggota",
  },
];

export default function TentangHero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-gutter py-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
        <div className="lg:col-span-6 flex flex-col items-start gap-space-lg">
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed text-primary text-pill-tag shadow-sm">
            <span className="material-symbols-outlined text-base">diversity_3</span>
            <span>Latar Belakang &amp; Solusi</span>
          </div>

          <div className="flex flex-col gap-space-sm">
            <h1 className="text-display-lg text-on-surface tracking-tight font-extrabold leading-tight">
              Kenapa <span className="text-primary-container">SkillMatch?</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Mencari rekan tim untuk tugas kuliah, proyek, atau kompetisi masih sering
              dilakukan secara informal melalui grup WhatsApp, media sosial, atau dari
              mulut ke mulut. Cara ini membuat mahasiswa sulit menemukan rekan dengan
              keahlian yang benar-benar dibutuhkan, dan informasi lowongan tim mudah
              hilang di tengah banyaknya pesan. SkillMatch hadir untuk mempertemukan
              mahasiswa berdasarkan keahlian, minat, dan ketersediaan waktu, agar proses
              pembentukan tim menjadi lebih mudah dan tepat sasaran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md w-full pt-space-xs">
            {points.map((p) => (
              <div
                key={p.title}
                className="group bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-space-xs"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p.iconBox}`}>
                  <span className="material-symbols-outlined text-xl">{p.icon}</span>
                </div>
                <span className={`text-title-lg text-on-surface transition-colors ${p.hover}`}>
                  {p.title}
                </span>
                <p className="text-body-md text-on-surface-variant">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-space-md pt-space-sm">
            <Link
              href="/register"
              className="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full text-pill-tag bg-primary-container text-on-primary hover:bg-primary transition-all duration-200 shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:-translate-y-0.5"
            >
              <span>Mulai Temukan Tim</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              href="/fitur"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full text-pill-tag text-on-surface-variant hover:text-primary transition-colors"
            >
              <span>Jelajahi Fitur</span>
              <span className="material-symbols-outlined text-base">east</span>
            </Link>
          </div>
        </div>

        <TentangIllustration />
      </div>
    </div>
  );
}