"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChatHeader from "@/components/mahasiswa/chat/ChatHeader";
import ConversationList from "@/components/mahasiswa/chat/ConversationList";
import ChatRoomHeader from "@/components/mahasiswa/chat/ChatRoomHeader";
import MessageList from "@/components/mahasiswa/chat/MessageList";
import MessageInput from "@/components/mahasiswa/chat/MessageInput";
import {
  getMahasiswaMe,
  getPercakapan,
  getRiwayatPesan,
  getProfilPengguna,
  kirimPesan,
} from "@/lib/frontend/api/mahasiswa";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserParam = searchParams.get("user");

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);

  // States
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Track scroll position in messages container
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceToBottom < 150;
  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = true) => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Fetch current user and conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await getPercakapan();
      const list = Array.isArray(res) ? res : [];
      setConversations(list);
      return list;
    } catch (err) {
      setConversationsError(err.message || "Gagal memuat percakapan");
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoadingConversations(true);
      setConversationsError(null);
      try {
        const [userRes, list] = await Promise.all([
          getMahasiswaMe(),
          loadConversations(),
        ]);

        if (!isMounted) return;
        setCurrentUser(userRes || null);

        // Check if query param exists
        if (targetUserParam) {
          const targetId = parseInt(targetUserParam, 10);
          if (Number.isFinite(targetId)) {
            const found = list.find((c) => Number(c.lawan_id) === targetId);
            if (found) {
              setSelectedUserId(targetId);
              setSelectedRecipient({
                pengguna_id: targetId,
                nama: found.lawan_nama,
                jurusan: found.jurusan || null,
              });
            } else {
              // Fetch user profile if not in current conversation list
              try {
                const profileRes = await getProfilPengguna(targetId);
                const p = profileRes;
                const stub = {
                  lawan_id: targetId,
                  lawan_nama: p.nama,
                  jurusan: p.jurusan || null,
                  angkatan: p.angkatan || null,
                  isi_pesan: "",
                  sent_at: new Date().toISOString(),
                  belum_dibaca: 0,
                };
                setConversations((prev) => [stub, ...prev]);
                setSelectedUserId(targetId);
                setSelectedRecipient({
                  pengguna_id: targetId,
                  nama: p.nama,
                  jurusan: p.jurusan || null,
                  angkatan: p.angkatan || null,
                });
              } catch {
                // If profile fails, default to first conversation if available
                if (list.length > 0) {
                  setSelectedUserId(list[0].lawan_id);
                  setSelectedRecipient({
                    pengguna_id: list[0].lawan_id,
                    nama: list[0].lawan_nama,
                    jurusan: list[0].jurusan || null,
                  });
                }
              }
            }
          }
        } else if (list.length > 0) {
          // Select first conversation by default
          setSelectedUserId(list[0].lawan_id);
          setSelectedRecipient({
            pengguna_id: list[0].lawan_id,
            nama: list[0].lawan_nama,
            jurusan: list[0].jurusan || null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setConversationsError(err.message || "Gagal memuat data awal");
        }
      } finally {
        if (isMounted) {
          setLoadingConversations(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [loadConversations, targetUserParam]);

  // Load message history when selectedUserId changes
  const fetchMessages = useCallback(
    async (userId, isPolling = false) => {
      if (!userId) {
        setMessages([]);
        return;
      }
      if (!isPolling) {
        setLoadingMessages(true);
        setMessagesError(null);
      }
      try {
        const res = await getRiwayatPesan(userId);
        const serverMessages = Array.isArray(res) ? res : [];

        setMessages((prev) => {
          // Preserve any optimistic messages that haven't finished sending
          const pendingOptimistic = prev.filter(
            (m) => m.isOptimistic || m.isFailed
          );

          // If count or last message changed, update and scroll
          const isSameLength = prev.length === serverMessages.length;
          const prevLastId = prev[prev.length - 1]?.pesan_id;
          const newLastId =
            serverMessages[serverMessages.length - 1]?.pesan_id;

          if (isPolling && isSameLength && prevLastId === newLastId) {
            return prev;
          }

          if (pendingOptimistic.length > 0) {
            return [...serverMessages, ...pendingOptimistic];
          }

          return serverMessages;
        });

        // Mark unread as 0 for this conversation in list
        setConversations((prev) =>
          prev.map((c) =>
            Number(c.lawan_id) === Number(userId)
              ? { ...c, belum_dibaca: 0 }
              : c
          )
        );

        if (!isPolling || isNearBottomRef.current) {
          setTimeout(() => scrollToBottom(false), 50);
        }
      } catch (err) {
        if (!isPolling) {
          setMessagesError(err.message || "Gagal memuat riwayat pesan");
        }
      } finally {
        if (!isPolling) {
          setLoadingMessages(false);
        }
      }
    },
    [scrollToBottom]
  );

  useEffect(() => {
    let ignore = false;
    if (selectedUserId) {
      inputRef.current?.focus();
      Promise.resolve().then(() => {
        if (!ignore) {
          fetchMessages(selectedUserId, false);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [selectedUserId, fetchMessages]);

  // Polling for messages (every 5 seconds)
  useEffect(() => {
    if (!selectedUserId) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMessages(selectedUserId, true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUserId, fetchMessages]);

  // Polling for conversation list (every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadConversations();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loadConversations]);

  // Select conversation handler
  function handleSelectConversation(userId) {
    if (userId === selectedUserId) return;
    setSelectedUserId(userId);

    const found = conversations.find((c) => Number(c.lawan_id) === Number(userId));
    if (found) {
      setSelectedRecipient({
        pengguna_id: userId,
        nama: found.lawan_nama,
        jurusan: found.jurusan || null,
        angkatan: found.angkatan || null,
      });
    }

    router.replace(`/chat?user=${userId}`, { scroll: false });
  }

  // Send message
  async function handleSendMessage(content) {
    if (!selectedUserId || !currentUser) return;

    const tempClientId = `client_${Date.now()}`;
    const optimisticMsg = {
      client_id: tempClientId,
      pengirim_id: currentUser.pengguna_id,
      penerima_id: selectedUserId,
      isi_pesan: content,
      sent_at: new Date().toISOString(),
      is_read: false,
      isOptimistic: true,
    };

    // Optimistically append
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(true), 20);

    // Optimistically update conversation snippet in list
    setConversations((prev) => {
      const idx = prev.findIndex(
        (c) => Number(c.lawan_id) === Number(selectedUserId)
      );
      if (idx !== -1) {
        const updated = {
          ...prev[idx],
          isi_pesan: content,
          sent_at: new Date().toISOString(),
          pengirim_id: currentUser.pengguna_id,
        };
        const rest = prev.filter(
          (c) => Number(c.lawan_id) !== Number(selectedUserId)
        );
        return [updated, ...rest];
      }
      return prev;
    });

    try {
      const serverMsg = await kirimPesan(selectedUserId, content);

      setMessages((prev) =>
        prev.map((m) => (m.client_id === tempClientId ? serverMsg : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.client_id === tempClientId
            ? { ...m, isOptimistic: false, isFailed: true }
            : m
        )
      );
    }
  }

  // Retry sending failed message
  async function handleRetryMessage(failedMsg) {
    if (!selectedUserId) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.client_id === failedMsg.client_id
          ? { ...m, isOptimistic: true, isFailed: false }
          : m
      )
    );

    try {
      const serverMsg = await kirimPesan(selectedUserId, failedMsg.isi_pesan);

      setMessages((prev) =>
        prev.map((m) =>
          m.client_id === failedMsg.client_id ? serverMsg : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.client_id === failedMsg.client_id
            ? { ...m, isOptimistic: false, isFailed: true }
            : m
        )
      );
    }
  }

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header Breadcrumb & Status */}
      <ChatHeader activeCount={conversations.length} />

      {/* Global Error Banner if conversations fail */}
      {conversationsError && (
        <div className="p-3 rounded-2xl bg-error-container text-on-error-container text-body-md flex items-center justify-between">
          <span>{conversationsError}</span>
          <button
            type="button"
            onClick={loadConversations}
            className="px-3 py-1 bg-error text-on-error rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Main Chat Card Canvas */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-12.5rem)] min-h-[580px]">
        {/* Left Column: Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedUserId={selectedUserId}
          currentUserId={currentUser?.pengguna_id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={handleSelectConversation}
          loading={loadingConversations}
        />

        {/* Right Column: Active Chat Room */}
        <section className="flex-1 flex flex-col bg-surface-bright min-w-0">
          <ChatRoomHeader recipient={selectedRecipient} />

          {messagesError && (
            <div className="p-2.5 mx-space-md mt-2 rounded-xl bg-error-container text-on-error-container text-xs flex items-center justify-between">
              <span>{messagesError}</span>
              <button
                type="button"
                onClick={() => fetchMessages(selectedUserId, false)}
                className="underline font-semibold cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          )}

          {loadingMessages ? (
            <div className="flex-1 flex flex-col gap-3 p-space-lg bg-surface animate-pulse">
              <div className="h-10 w-2/3 bg-surface-container-low rounded-2xl self-start" />
              <div className="h-14 w-1/2 bg-surface-container-low rounded-2xl self-end" />
              <div className="h-10 w-3/4 bg-surface-container-low rounded-2xl self-start" />
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUserId={currentUser?.pengguna_id}
              recipient={selectedRecipient}
              containerRef={messagesContainerRef}
              onRetry={handleRetryMessage}
              hasConversations={conversations.length > 0}
            />
          )}

          {selectedRecipient && (
            <MessageInput
              recipient={selectedRecipient}
              onSendMessage={handleSendMessage}
              disabled={loadingMessages}
              inputRef={inputRef}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col w-full gap-space-md animate-pulse">
          <div className="h-16 bg-surface-container-low rounded-2xl w-1/3" />
          <div className="h-[calc(100vh-12.5rem)] min-h-[580px] bg-surface-container-lowest rounded-2xl shadow-xl" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

