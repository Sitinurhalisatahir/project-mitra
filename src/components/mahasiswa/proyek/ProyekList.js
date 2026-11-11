import ProyekCard from "./ProyekCard";

export default function ProyekList({
  proyekList = [],
  loading = false,
  error = null,
  onRetry,
  title = "Rekomendasi Untuk Anda",
}) {
  return (
    <section className="flex-1 flex flex-col gap-space-md min-w-0 w-full">
      <div className="flex items-center justify-between px-space-xs">
        <h2 className="text-title-lg text-on-surface font-bold">
          {title}
        </h2>
        <span className="text-label-md text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full font-medium">
          Menampilkan {proyekList.length} proyek cocok
        </span>
      </div>

      {error ? (
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <span className="text-xs text-red-600 font-medium">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Coba lagi
            </button>
          )}
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-space-md">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm h-64 animate-pulse"
            />
          ))}
        </div>
      ) : proyekList.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-[2rem] p-12 shadow-sm flex items-center justify-center text-center">
          <p className="text-body-md text-on-surface-variant font-normal">
            Belum ada proyek yang cocok
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-md">
          {proyekList.map((p) => (
            <ProyekCard key={p.proyek_id} proyek={p} />
          ))}
        </div>
      )}
    </section>
  );
}

