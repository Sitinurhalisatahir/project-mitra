import Link from "next/link";

const className =
  "group w-full h-14 mt-2 rounded-full bg-[#fea619] hover:bg-[#F59E0B] active:scale-[0.99] text-slate-900 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all duration-200 cursor-pointer text-base disabled:opacity-70 disabled:cursor-not-allowed";

const style = {
  background: "linear-gradient(rgb(255, 192, 33) 0%, rgb(245, 158, 11) 100%)",
};

export default function AuthButton({ children, loading = false, href, ...props }) {
  const content = (
    <>
      <span>{loading ? "Memproses..." : children}</span>
      <i
        className={`fa-solid ${
          loading ? "fa-spinner fa-spin" : "fa-arrow-right"
        } text-sm transition-transform duration-200 group-hover:translate-x-1`}
      ></i>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={className}
      style={style}
      type="submit"
      disabled={loading}
      {...props}
    >
      {content}
    </button>
  );
}