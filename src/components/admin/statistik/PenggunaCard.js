import CardFooterNote from "./CardFooterNote";

export default function PenggunaCard({
  totalMahasiswa = 0,
  terverifikasi = 0,
  menungguVerifikasi = 0,
  adminCount = 0,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm animate-pulse">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="w-28 h-6 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-12 w-28 bg-slate-200 rounded" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-28 rounded-full bg-slate-200" />
              <div className="h-7 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-8 bg-slate-200 rounded" />
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 h-10 w-full bg-slate-100 rounded-full" />
      </div>
    );
  }

  const persenVerifikasi =
    totalMahasiswa > 0 ? Math.round((terverifikasi / totalMahasiswa) * 100) : 0;

  return (
    <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">groups</span>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-tertiary text-label-md font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            {terverifikasi.toLocaleString("id-ID")} terverifikasi
          </span>
        </div>

        {/* Label & Big Number */}
        <div className="space-y-1 mb-6">
          <h2 className="text-title-lg text-on-surface-variant font-semibold tracking-normal">
            Jumlah Pengguna Aktif
          </h2>
          <div className="text-display-lg text-on-surface font-extrabold tracking-tight">
            {totalMahasiswa.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Micro-stats / Breakdown Section */}
        <div className="space-y-4 pt-4">
          {/* Badges breakdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {totalMahasiswa.toLocaleString("id-ID")} Mahasiswa
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              {adminCount.toLocaleString("id-ID")} Admin
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-on-surface-variant text-label-md">
              <span className="font-medium">Akun Terverifikasi</span>
              <span className="font-bold text-on-surface">
                {persenVerifikasi}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${persenVerifikasi}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <CardFooterNote
        icon="school"
        iconColor="text-primary"
        text={`${menungguVerifikasi.toLocaleString("id-ID")} akun menunggu verifikasi`}
      />
    </div>
  );
}

