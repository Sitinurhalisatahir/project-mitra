export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="w-full max-w-[490px] relative">
      {/* Card Container */}
      <div
        className="w-full bg-[#4F46E5] rounded-[36px] p-8 sm:p-11 shadow-2xl shadow-indigo-600/30 relative overflow-hidden transition-all duration-300"
        style={{
          background:
            "linear-gradient(rgb(79, 70, 229) 0%, rgb(67, 56, 202) 60%, rgb(59, 50, 179) 100%)",
          boxShadow:
            "rgba(79, 70, 229, 0.45) 0px 30px 60px -15px, rgba(0, 0, 0, 0.1) 0px 15px 30px -10px",
        }}
      >
        {/* Subtle Decorative Card Shimmer Circles */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Section inside Card */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl text-white font-extrabold tracking-tight mb-2.5">
            {title}
          </h1>
          <p className="text-base text-indigo-100/85 leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}