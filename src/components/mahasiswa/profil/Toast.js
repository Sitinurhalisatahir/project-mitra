export default function Toast({ message, type = "success", show = false }) {
  const isError = type === "error";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 bg-surface-container-lowest text-on-surface px-5 py-3.5 rounded-full shadow-xl ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
      id="toast-notif"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center ${
          isError
            ? "bg-error-container text-on-error-container"
            : "bg-tertiary-fixed text-on-tertiary-fixed"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isError ? "error" : "check"}
        </span>
      </div>
      <span className="text-body-md font-semibold" id="toast-text">
        {message}
      </span>
    </div>
  );
}

