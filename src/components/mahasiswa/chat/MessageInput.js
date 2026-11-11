"use client";

import { useState } from "react";

export default function MessageInput({
  recipient,
  onSendMessage,
  disabled = false,
  inputRef,
}) {
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!recipient || disabled) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    if (trimmed.length > 2000) {
      setErrorMsg("Pesan terlalu panjang (maksimal 2000 karakter)");
      return;
    }

    setErrorMsg(null);
    setText("");
    onSendMessage(trimmed);
  }

  return (
    <div className="p-space-md bg-surface-container-lowest shadow-sm z-10 shrink-0 border-t border-outline-variant/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-2" id="chat-form">
        {/* Input Text Area/Field */}
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            id="message-input"
            type="text"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (errorMsg && e.target.value.length <= 2000) {
                setErrorMsg(null);
              }
            }}
            disabled={disabled || !recipient}
            placeholder={
              recipient
                ? `Tulis pesan untuk ${recipient.nama}...`
                : "Pilih percakapan terlebih dahulu..."
            }
            className="w-full h-12 px-4 rounded-full bg-surface border border-outline-variant/40 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !recipient || !text.trim()}
          className="h-12 px-space-lg rounded-full bg-secondary-container hover:brightness-105 active:scale-95 text-on-secondary-container text-body-md font-bold flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Kirim</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>

      {errorMsg && (
        <p className="text-xs text-red-600 px-space-sm pt-1">{errorMsg}</p>
      )}

      {/* Helpful Context Hint */}
      <div className="flex items-center justify-between px-space-sm pt-2">
        <p className="text-label-md text-on-surface-variant">
          Tekan{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[10px]">
            Enter
          </kbd>{" "}
          untuk mengirim pesan ke percakapan ini.
        </p>
        <span className="text-label-md text-tertiary flex items-center gap-1 font-semibold">
          <span className="material-symbols-outlined text-[14px]">lock</span>{" "}
          Percakapan pribadi
        </span>
      </div>
    </div>
  );
}

