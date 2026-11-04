import LamaranItem from "./LamaranItem";

export default function LamaranPanel({ items = [], loading = false, error = null, onRetry }) {
  const displayItems = items.slice(0, 4);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md">
          <h2 className="text-headline-md text-on-surface font-bold">
            Aktivitas Lamaran Terbaru
          </h2>
          <span className="text-pill-tag bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-semibold">
            {displayItems.length} Lamaran Terakhir
          </span>
        </div>

        {error ? (
          <div className="p-4 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-xs text-red-600">{error}</span>
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
          <div className="flex flex-col gap-space-sm">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-surface-container-low/60 animate-pulse"
              />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-center">
            <p className="text-body-md text-on-surface-variant">Belum ada lamaran</p>
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {displayItems.map((item) => (
              <LamaranItem key={item.aplikasi_id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

