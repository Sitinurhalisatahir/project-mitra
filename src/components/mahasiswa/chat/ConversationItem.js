"use client";

import { getInitials, formatChatTimestamp } from "@/lib/frontend/utils/format";

const CONVERSATION_PALETTES = [
  { bg: "bg-primary-container", text: "text-on-primary" },
  { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed" },
  { bg: "bg-surface-container-high", text: "text-on-surface-variant" },
  { bg: "bg-surface-container-highest", text: "text-on-surface-variant" },
];

function getAvatarPalette(id) {
  const num = Number(id) || 0;
  return CONVERSATION_PALETTES[Math.abs(num) % CONVERSATION_PALETTES.length];
}

export default function ConversationItem({
  conversation,
  isSelected = false,
  currentUserId,
  onClick,
}) {
  const initials = getInitials(conversation.lawan_nama);
  const palette = getAvatarPalette(conversation.lawan_id);
  const formattedTime = formatChatTimestamp(conversation.sent_at);

  const isFromMe =
    conversation.pengirim_id != null &&
    currentUserId != null &&
    Number(conversation.pengirim_id) === Number(currentUserId);

  const snippetPrefix = isFromMe ? "Kamu: " : "";
  const snippet = conversation.isi_pesan
    ? `${snippetPrefix}${conversation.isi_pesan}`
    : "Belum ada pesan";

  const unreadCount = Number(conversation.belum_dibaca) || 0;

  if (isSelected) {
    return (
      <div
        onClick={onClick}
        className="relative flex items-center gap-3 p-space-sm rounded-[3rem] bg-surface-container text-on-surface cursor-pointer shadow-sm transition-all group border border-outline-variant/40"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-[3rem]" />
        <div className="relative shrink-0 ml-1">
          <div
            className={`w-12 h-12 rounded-full ${palette.bg} ${palette.text} text-title-lg font-bold flex items-center justify-center shadow-inner`}
          >
            {initials}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-body-lg font-bold text-on-surface truncate">
              {conversation.lawan_nama}
            </span>
            <span className="text-label-md font-semibold text-primary ml-1 shrink-0">
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed-dim/30 text-label-md text-primary font-semibold truncate max-w-[170px]">
              {conversation.jurusan || "Mahasiswa"}
            </span>
          </div>

          <p className="text-body-md text-on-surface font-medium truncate">
            {snippet}
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-label-md font-bold flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-3 p-space-sm rounded-[3rem] hover:bg-surface-container-low text-on-surface cursor-pointer transition-colors group"
    >
      <div className="relative shrink-0 ml-1">
        <div
          className={`w-12 h-12 rounded-full ${palette.bg} ${palette.text} text-title-lg font-bold flex items-center justify-center`}
        >
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-body-lg ${
              unreadCount > 0 ? "font-bold" : "font-semibold"
            } text-on-surface truncate`}
          >
            {conversation.lawan_nama}
          </span>
          <span className="text-label-md text-on-surface-variant ml-1 shrink-0">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-label-md text-on-surface-variant font-medium truncate max-w-[170px]">
            {conversation.jurusan || "Mahasiswa"}
          </span>
        </div>

        <p className="text-body-md text-on-surface-variant truncate">
          {snippet}
        </p>
      </div>

      {unreadCount > 0 && (
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-label-md font-bold flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        </div>
      )}
    </div>
  );
}

