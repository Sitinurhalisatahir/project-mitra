export default function ChatPreview() {
  return (
    <div className="p-space-md rounded-[2rem] bg-surface-container-low/70 flex flex-col gap-space-sm mt-space-sm">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container font-bold text-label-md">
              ND
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-container shadow-[0_0_0_2px_#ffffff]"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-body-md text-on-surface font-bold leading-tight">Nadia Dwi</span>
            <span className="text-label-md text-tertiary-container font-medium">Online</span>
          </div>
        </div>
        <span className="text-label-md text-on-surface-variant">Baru saja</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="self-start max-w-[85%] p-2.5 rounded-2xl rounded-tl-sm bg-surface-container-lowest text-on-surface shadow-sm text-body-md">
          Halo! Tertarik kolaborasi untuk proyek UI/UX Hackathon minggu depan?
        </div>
        <div className="self-end max-w-[85%] p-2.5 rounded-2xl rounded-tr-sm bg-primary-container text-on-primary shadow-sm text-body-md">
          Tentu, portofolio kamu sangat cocok. Mari diskusikan detailnya!
        </div>
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <span className="inline-flex items-center gap-1 text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary-container">done_all</span>
          Pesan terkirim instan
        </span>
        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-label-md">
          Terhubung
        </span>
      </div>
    </div>
  );
}