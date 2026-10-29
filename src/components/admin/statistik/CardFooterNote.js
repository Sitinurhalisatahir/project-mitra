export default function CardFooterNote({
  icon,
  iconColor = "text-primary",
  text,
}) {
  return (
    <div className="mt-8 pt-4 flex items-center gap-2 text-on-surface-variant text-body-md bg-surface-container-low/50 px-3.5 py-2.5 rounded-full">
      <span className={`material-symbols-outlined text-[18px] shrink-0 ${iconColor}`}>
        {icon}
      </span>
      <span className="truncate">{text}</span>
    </div>
  );
}

