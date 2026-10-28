"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Apakah SkillMatch sepenuhnya gratis?",
    a: "Ya! SkillMatch dapat digunakan secara gratis oleh seluruh mahasiswa untuk membuat profil, mencari mitra, dan berdiskusi seputar proyek.",
  },
  {
    q: "Bagaimana cara kerja Smart Match Engine dalam mencocokkan mitra?",
    a: "Algoritma SkillMatch menganalisis kesesuaian antara keahlian teknis (skill tags), minat proyek, jurusan, serta kecocokan alokasi waktu luang mingguan antara calon mitra.",
  },
  {
    q: "Apakah saya bisa mencari rekan tim dari kampus atau universitas lain?",
    a: "Tentu! SkillMatch mendukung kolaborasi terbuka antar-mahasiswa dari berbagai kampus di seluruh Indonesia, sangat cocok untuk tim kompetisi nasional dan hackathon.",
  },
  {
    q: "Bagaimana jika ada anggota tim yang tidak aktif atau tidak responsif?",
    a: "SkillMatch menyediakan indikator status ketersediaan waktu dan verifikasi keaktifan profil, serta fitur pelaporan untuk menjaga ekosistem kolaborasi tetap sehat dan produktif.",
  },
];

export default function FiturFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-24 max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-3">
          <span className="material-symbols-outlined text-sm">help</span>
          <span>Pertanyaan Umum</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Sering Ditanyakan (FAQ)
        </h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Pertanyaan yang sering diajukan mengenai fitur dan penggunaan SkillMatch.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <span className="font-bold text-on-surface text-base">{faq.q}</span>
                <span className={`material-symbols-outlined text-primary-container text-xl transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

