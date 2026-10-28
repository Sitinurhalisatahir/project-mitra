export default function AuthNotice({ children }) {
  return (
    <div className="flex items-center gap-2 pt-1 px-1">
      <i className="fa-solid fa-circle-info text-amber-300 text-xs shrink-0"></i>
      <p className="text-xs text-amber-200/95 leading-snug font-normal">
        {children}
      </p>
    </div>
  );
}