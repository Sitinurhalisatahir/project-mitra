export default function FiturHeader() {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-xl">
      <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed text-primary text-pill-tag shadow-sm mb-space-md">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
        <span>Fitur Unggulan</span>
      </div>
      <h1 className="text-display-lg text-on-surface tracking-tight font-extrabold mb-space-sm">
        Fitur Utama <span className="text-primary-container">SkillMatch</span>
      </h1>
      <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
        Tiga fitur inti yang membantu mahasiswa menemukan mitra proyek yang tepat
      </p>
    </div>
  );
}