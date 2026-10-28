export default function FormAlert({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-2xl bg-red-500/20 border border-red-300/40 px-4 py-3 text-sm text-red-100"
    >
      <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i>
      <span>{message}</span>
    </div>
  );
}