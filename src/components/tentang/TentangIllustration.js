export default function TentangIllustration() {
  return (
    <div className="lg:col-span-6 relative flex justify-center items-center">
      <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-fixed/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg bg-surface-container-lowest p-space-md rounded-3xl shadow-xl flex flex-col items-center overflow-hidden">
        <div className="w-full relative rounded-2xl overflow-hidden bg-surface-container-low aspect-square flex items-center justify-center p-space-sm">
          <img
            alt="Kolaborasi Mahasiswa SkillMatch"
            className="w-full h-full object-contain drop-shadow-sm select-none"
            src="/images/tentang.png"
          />
        </div>

        <div className="absolute top-space-lg left-space-lg bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-md flex items-center gap-space-xs transition-transform duration-300 hover:scale-105">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <span className="text-pill-tag text-on-surface">Kolaborasi Tepat Sasaran</span>
        </div>

        <div className="absolute bottom-space-lg right-space-lg bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-md flex items-center gap-space-xs transition-transform duration-300 hover:scale-105">
          <span className="material-symbols-outlined text-primary-container text-base">mark_chat_read</span>
          <span className="text-pill-tag text-on-surface">Bebas Repot Grup Chat</span>
        </div>
      </div>
    </div>
  );
}