import Link from "next/link";

const categories = [
  {
    icon: "code",
    title: "Web & Frontend",
    desc: "React, Next.js, Vue, Tailwind CSS",
    badge: "180+ Mitra",
    color: "from-blue-500/10 to-indigo-500/10 text-primary-container",
  },
  {
    icon: "palette",
    title: "UI/UX & Product Design",
    desc: "Figma, Wireframing, User Research",
    badge: "120+ Mitra",
    color: "from-pink-500/10 to-rose-500/10 text-rose-600",
  },
  {
    icon: "smartphone",
    title: "Mobile Development",
    desc: "Flutter, React Native, Kotlin, Swift",
    badge: "95+ Mitra",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600",
  },
  {
    icon: "psychology",
    title: "AI & Data Science",
    desc: "Python, TensorFlow, PyTorch, Data Viz",
    badge: "110+ Mitra",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
  },
  {
    icon: "science",
    title: "Riset & PKM Ilmiah",
    desc: "Kajian Literatur, Metodologi, Olah Data",
    badge: "80+ Mitra",
    color: "from-purple-500/10 to-violet-500/10 text-purple-600",
  },
  {
    icon: "sports_esports",
    title: "Game Dev & IoT",
    desc: "Unity, Arduino, ESP32, Unreal Engine",
    badge: "65+ Mitra",
    color: "from-cyan-500/10 to-sky-500/10 text-cyan-600",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full bg-surface py-20 border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-3">
              <span className="material-symbols-outlined text-sm">category</span>
              <span>Bidang Keahlian</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Eksplorasi Proyek Berdasarkan Bidang
            </h2>
            <p className="text-on-surface-variant text-base mt-2 max-w-xl">
              Temukan rekan dengan spesialisasi yang saling melengkapi untuk beragam jenis proyek akademik maupun kompetisi.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-container hover:text-primary transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>Lihat Semua Bidang</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.title}
              href="/register"
              className="group bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm hover:shadow-md hover:border-primary-container/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}>
                    <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold">
                    {c.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary-container transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary-container">
                <span>Cari Mitra</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  east
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

