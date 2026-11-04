export default function SummaryCard({
  value,
  title,
  description,
  icon,
  iconBgClass,
  iconColorClass,
  loading,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between">
      <div className="flex flex-col justify-between h-full">
        <div>
          {loading ? (
            <div className="w-16 h-12 bg-surface-container rounded-lg animate-pulse mb-space-xs" />
          ) : (
            <span className="text-display-lg text-on-surface font-extrabold leading-none block mb-space-xs">
              {value}
            </span>
          )}
          <h2 className="text-title-lg text-on-surface font-semibold">{title}</h2>
        </div>
        {loading ? (
          <div className="w-36 h-4 bg-surface-container rounded animate-pulse mt-space-sm" />
        ) : (
          <p className="text-body-md text-on-surface-variant mt-space-sm">
            {description}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center ${iconColorClass} shrink-0 shadow-sm`}
      >
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
    </div>
  );
}

