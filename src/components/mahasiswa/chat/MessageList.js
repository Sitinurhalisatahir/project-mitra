"use client";

import Link from "next/link";
import {
  getInitials,
  formatMessageTime,
  formatChatDayDivider,
} from "@/lib/frontend/utils/format";

function getLocalDateKey(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function MessageList({
  messages = [],
  currentUserId,
  recipient,
  containerRef,
  onRetry,
  hasConversations = true,
}) {
  if (!recipient) {
    if (hasConversations) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-space-lg gap-2 bg-surface">
          <span className="material-symbols-outlined text-[48px] text-outline">
            chat_bubble_outline
          </span>
          <p className="text-body-md text-on-surface-variant">
            Pilih percakapan untuk mulai mengobrol
          </p>
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-space-lg gap-3 bg-surface">
        <span className="material-symbols-outlined text-[48px] text-outline">
          chat_bubble_outline
        </span>
        <p className="text-body-md text-on-surface-variant max-w-md">
          Belum ada percakapan. Mulai dari tombol Ajak Kolaborasi di Proyek Saya
          atau lewat profil mahasiswa.
        </p>
        <Link
          href="/proyek"
          className="px-4 py-2 rounded-2xl bg-primary text-on-primary text-body-md font-semibold hover:bg-primary-container transition-colors"
        >
          Cari Proyek
        </Link>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-space-lg bg-surface">
        <p className="text-body-md text-on-surface-variant">
          Belum ada pesan. Mulai percakapan dengan {recipient.nama}.
        </p>
      </div>
    );
  }

  const recipientInitials = getInitials(recipient.nama);

  return (
    <div
      ref={containerRef}
      id="message-container"
      className="flex-1 overflow-y-auto px-space-md sm:px-space-xl py-space-lg flex flex-col gap-3 bg-surface"
    >
      {messages.map((m, index) => {
        const isIncoming =
          m.pengirim_id != null &&
          currentUserId != null &&
          Number(m.pengirim_id) !== Number(currentUserId);

        const currentDateKey = getLocalDateKey(m.sent_at);
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const prevDateKey = prevMessage
          ? getLocalDateKey(prevMessage.sent_at)
          : null;
        const isNewDay = currentDateKey !== prevDateKey;

        const isContinuation =
          !isNewDay &&
          prevMessage &&
          Number(prevMessage.pengirim_id) === Number(m.pengirim_id);

        return (
          <div key={m.pesan_id || m.client_id || index} className="flex flex-col">
            {/* Centered Date Chip */}
            {isNewDay && (
              <div className="flex items-center justify-center my-space-xs">
                <span className="px-4 py-1 rounded-full bg-surface-container-high text-label-md text-on-surface-variant font-semibold shadow-sm">
                  {formatChatDayDivider(m.sent_at)}
                </span>
              </div>
            )}

            {/* Thin Divider Line between successive messages within the same day */}
            {!isNewDay && index > 0 && (
              <div className="w-full flex items-center gap-2 py-1">
                <div className="h-px bg-outline-variant/30 w-full" />
              </div>
            )}

            {/* Incoming Message (Left) */}
            {isIncoming ? (
              <div
                className={`flex items-end gap-2.5 max-w-xl self-start ${
                  isContinuation ? "ml-10" : ""
                }`}
              >
                {!isContinuation && (
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary text-label-md font-bold flex items-center justify-center shrink-0 mb-1">
                    {recipientInitials}
                  </div>
                )}
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-surface-container-low text-on-surface rounded-2xl px-space-md py-3 shadow-sm text-body-md leading-relaxed border border-outline-variant/30 whitespace-pre-wrap break-words">
                    {m.isi_pesan}
                  </div>
                  <span className="text-label-md text-on-surface-variant px-1">
                    {formatMessageTime(m.sent_at)}
                  </span>
                </div>
              </div>
            ) : (
              /* Outgoing Message (Right) */
              <div className="flex flex-col gap-1 items-end max-w-xl self-end mt-1">
                <div className="bg-surface-container-lowest text-on-surface rounded-2xl px-space-md py-3 shadow-sm text-body-md leading-relaxed whitespace-pre-wrap break-words">
                  {m.isi_pesan}
                </div>
                <div className="flex items-center gap-1 text-label-md text-on-surface-variant px-1">
                  <span>{formatMessageTime(m.sent_at)}</span>
                  <span>•</span>
                  {m.isOptimistic ? (
                    <span className="text-primary font-semibold text-label-md">
                      Mengirim...
                    </span>
                  ) : m.isFailed ? (
                    <span className="text-error font-semibold text-label-md flex items-center gap-1">
                      Gagal terkirim.{" "}
                      <button
                        type="button"
                        onClick={() => onRetry(m)}
                        className="underline font-bold cursor-pointer"
                      >
                        Coba lagi
                      </button>
                    </span>
                  ) : m.is_read ? (
                    <span className="text-tertiary font-semibold flex items-center gap-0.5">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        done_all
                      </span>{" "}
                      Dibaca
                    </span>
                  ) : (
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">
                        done_all
                      </span>{" "}
                      Terkirim
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

