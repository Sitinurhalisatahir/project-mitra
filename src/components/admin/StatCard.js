export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-indigo-50 text-brand-600",
  valueColor = "text-slate-900",
  loading = false,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {Icon ? <Icon className="w-5 h-5" /> : null}
        </div>
      </div>
      <div className="mt-2">
        {loading ? (
          <>
            <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-36 bg-slate-100 rounded animate-pulse mt-2" />
          </>
        ) : (
          <>
            <div className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>
              {value}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {subtitle}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

