export default function AuthInput({
  icon,
  iconColor = "text-[#4F46E5]",
  error,
  rightSlot,
  ...props
}) {
  return (
    <div>
      <div className="relative flex items-center">
        <div
          className={`absolute left-5 ${iconColor} flex items-center justify-center pointer-events-none text-base`}
        >
          <i className={icon}></i>
        </div>
        <input
          className={`w-full h-14 pl-[3.25rem] ${
            rightSlot ? "pr-12" : "pr-6"
          } rounded-full bg-white text-slate-700 placeholder:text-slate-400 font-medium outline-none focus:ring-4 focus:ring-amber-300/60 shadow-sm transition-all duration-200 text-sm sm:text-base`}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {rightSlot}
      </div>
      {error && <p className="mt-1.5 px-5 text-xs text-red-200">{error}</p>}
    </div>
  );
}