export default function BrandLogo() {
  return (
    <div className="flex items-center group cursor-pointer select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M2 7V4a2 2 0 0 1 2-2h3" />
            <path d="M22 7V4a2 2 0 0 0-2-2h-3" />
            <path d="M2 17v3a2 2 0 0 0 2 2h3" />
            <path d="M22 17v3a2 2 0 0 1-2 2h-3" />
          </svg>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-[#4F46E5]">
          SkillMatch
        </span>
      </div>
    </div>
  );
}