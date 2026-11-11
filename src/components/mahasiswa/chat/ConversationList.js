"use client";

import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations = [],
  selectedUserId = null,
  currentUserId = null,
  searchQuery = "",
  onSearchChange,
  onSelectConversation,
  loading = false,
}) {
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (c.lawan_nama || "").toLowerCase().includes(q);
    const msgMatch = (c.isi_pesan || "").toLowerCase().includes(q);
    const jurusanMatch = (c.jurusan || "").toLowerCase().includes(q);
    return nameMatch || msgMatch || jurusanMatch;
  });

  return (
    <aside className="w-full md:w-80 lg:w-96 flex flex-col bg-surface-container-lowest shrink-0 border-r border-outline-variant/20">
      {/* Column Header */}
      <div className="p-space-md pb-space-sm flex flex-col gap-space-sm bg-surface-container-lowest">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-title-lg text-on-surface font-bold">
              Percakapan
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-label-md font-bold">
              {conversations.length}
            </span>
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
            search
          </span>
          <input
            id="chat-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari rekan atau topik proyek..."
            className="w-full h-10 pl-10 pr-3 rounded-full bg-surface-container-low text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>

      {/* Scrollable Conversations List */}
      <div className="flex-1 overflow-y-auto px-space-xs py-space-xs flex flex-col gap-1">
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-20 rounded-[3rem] bg-surface-container-low animate-pulse"
              />
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-body-md text-on-surface-variant">
            {searchQuery.trim()
              ? `Tidak ditemukan percakapan dengan "${searchQuery}"`
              : "Belum ada percakapan"}
          </div>
        ) : (
          filteredConversations.map((c, index) => (
            <div key={c.lawan_id} className="flex flex-col">
              <ConversationItem
                conversation={c}
                isSelected={Number(selectedUserId) === Number(c.lawan_id)}
                currentUserId={currentUserId}
                onClick={() => onSelectConversation(c.lawan_id)}
              />
              {index < filteredConversations.length - 1 && (
                <div className="w-full h-px bg-outline-variant/20 my-0.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Subtle User Mini Bar / Quick Project Note */}
      <div className="p-space-sm bg-surface-container-low m-space-xs rounded-[3rem] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[18px]">
            group_add
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-label-md font-bold text-on-surface">
            Undang Teman Baru
          </p>
          <p className="text-label-md text-on-surface-variant truncate">
            Mulai percakapan via profil mahasiswa
          </p>
        </div>
      </div>
    </aside>
  );
}

