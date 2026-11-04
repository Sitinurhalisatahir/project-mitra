export default function CariHeader() {
  return (
    <div className="flex flex-col gap-space-xs mb-space-lg">
      <div className="flex items-center gap-space-sm">
        <span className="text-headline-xl text-on-surface font-extrabold tracking-tight">
          Cari Proyek
        </span>
        <span className="inline-flex items-center px-space-sm py-0.5 rounded-full bg-primary-fixed text-primary text-label-md font-semibold">
          Explore
        </span>
      </div>
      <p className="text-body-lg text-on-surface-variant max-w-3xl font-normal">
        Temukan proyek kolaborasi kampus yang sesuai dengan keahlian, minat, dan ketersediaan waktumu.
      </p>
    </div>
  );
}

