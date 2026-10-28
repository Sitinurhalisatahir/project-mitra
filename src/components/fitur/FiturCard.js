export default function FiturCard({ icon, label, title, description, children }) {
  return (
    <div className="group relative flex flex-col justify-between p-space-lg rounded-[3rem] bg-surface-container-lowest shadow-[0_10px_30px_-6px_rgba(79,70,229,0.06),0_2px_8px_-2px_rgba(11,28,48,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.12)]">
      <div>
        <div className="flex items-center justify-between mb-space-lg">
          <div className="w-14 h-14 rounded-[2rem] bg-surface-container flex items-center justify-center text-primary-container transition-transform duration-300 group-hover:scale-105">
            <span
              className="material-symbols-outlined text-[30px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
          <span className="px-space-md py-space-xs rounded-full bg-surface-container-low text-primary-container text-label-md font-bold tracking-wider uppercase">
            {label}
          </span>
        </div>
        <h2 className="text-headline-md text-on-surface font-bold tracking-tight mb-space-xs">
          {title}
        </h2>
        <p className="text-body-md text-on-surface-variant leading-relaxed mb-space-lg">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}