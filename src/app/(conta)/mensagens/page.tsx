"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  MessageCircle,
  Search,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type InboxEntry = {
  partnerId: string;
  partnerNome: string;
  partnerFoto: string | null;
  lastText: string;
  lastTs: string;
  unreadCount: number;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
};

function timeLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  if (diff < 7 * 86400000) {
    const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    return dias[d.getDay()];
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function MensagensPage() {
  const [inbox, setInbox] = useState<InboxEntry[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Init: get user + inbox
  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch inbox
      const { data: rawMessages } = await supabase
        .from("messages")
        .select("id, sender_id, recipient_id, text, created_at, is_read, deleted_at")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(200);

      if (!rawMessages) { setLoading(false); return; }

      // Group by partner
      const map = new Map<string, InboxEntry>();
      for (const row of rawMessages) {
        const partnerId = row.sender_id === user.id ? row.recipient_id : row.sender_id;
        if (!map.has(partnerId)) {
          map.set(partnerId, {
            partnerId,
            partnerNome: "",
            partnerFoto: null,
            lastText: row.text,
            lastTs: row.created_at,
            unreadCount: 0,
          });
        }
        if (row.recipient_id === user.id && !row.is_read) {
          map.get(partnerId)!.unreadCount++;
        }
      }

      // Fetch partner profiles
      const partnerIds = [...map.keys()];
      if (partnerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, nome, avatar_url")
          .in("id", partnerIds);

        if (profiles) {
          for (const p of profiles) {
            const entry = map.get(p.id);
            if (entry) {
              entry.partnerNome = p.nome || "Usuário";
              entry.partnerFoto = p.avatar_url;
            }
          }
        }
      }

      setInbox(Array.from(map.values()));
      setLoading(false);
    }

    load();
  }, []);

  // Load history when active partner changes
  useEffect(() => {
    if (!activePartnerId || !userId) return;

    const supabase = createClient();

    async function loadHistory() {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, recipient_id, text, created_at, is_read")
        .or(
          `and(sender_id.eq.${userId},recipient_id.eq.${activePartnerId}),and(sender_id.eq.${activePartnerId},recipient_id.eq.${userId})`
        )
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
        .limit(100);

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            senderId: m.sender_id,
            text: m.text,
            createdAt: m.created_at,
            isRead: m.is_read ?? false,
          }))
        );
      }

      // Mark as read
      await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("recipient_id", userId)
        .eq("sender_id", activePartnerId)
        .eq("is_read", false);

      // Update inbox unread count
      setInbox((prev) =>
        prev.map((e) =>
          e.partnerId === activePartnerId ? { ...e, unreadCount: 0 } : e
        )
      );
    }

    loadHistory();
  }, [activePartnerId, userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!draft.trim() || !userId || !activePartnerId) return;

    const text = draft.trim();
    setDraft("");

    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .insert({ sender_id: userId, recipient_id: activePartnerId, text })
      .select()
      .single();

    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          senderId: data.sender_id,
          text: data.text,
          createdAt: data.created_at,
          isRead: false,
        },
      ]);

      // Update inbox
      setInbox((prev) => {
        const updated = prev.map((e) =>
          e.partnerId === activePartnerId
            ? { ...e, lastText: text, lastTs: data.created_at }
            : e
        );
        return updated;
      });
    }
  }, [draft, userId, activePartnerId]);

  const activePartner = inbox.find((e) => e.partnerId === activePartnerId);
  const filteredInbox = searchQ
    ? inbox.filter((e) =>
        e.partnerNome.toLowerCase().includes(searchQ.toLowerCase())
      )
    : inbox;

  return (
    <div className="space-y-6">
      <header>
        <span className="kicker mb-3 inline-block">mensagens</span>
        <h1 className="text-3xl md:text-4xl leading-tight mb-3">
          Chat com a <span className="text-gold">galera</span>.
        </h1>
        <p className="text-text-secondary">
          Conversas 1:1 com seus amigos. Combine o rolê sem sair do app.
        </p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">
          Carregando conversas...
        </div>
      ) : inbox.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
          <MessageCircle size={24} className="text-gold mx-auto mb-4" />
          <h3 className="text-lg mb-2">Nenhuma conversa</h3>
          <p className="text-text-muted text-sm">
            Suas mensagens com amigos aparecem aqui.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-card overflow-hidden min-h-[500px]">
          <div className="grid md:grid-cols-[320px_1fr] h-[600px]">
            {/* Conversation list */}
            <div className="border-r border-white/5 flex flex-col">
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Buscar conversa..."
                    className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none"
                  />
                </div>
              </div>
              <ul className="flex-1 overflow-auto no-scrollbar">
                {filteredInbox.map((entry) => {
                  const active = activePartnerId === entry.partnerId;
                  return (
                    <li key={entry.partnerId}>
                      <button
                        onClick={() => setActivePartnerId(entry.partnerId)}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-200 cursor-pointer border-b border-white/5",
                          active
                            ? "bg-gold/10"
                            : "hover-real:bg-elevated/50"
                        )}
                      >
                        {entry.partnerFoto ? (
                          <img
                            src={entry.partnerFoto}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-full shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,211,0,0.3), #080604)",
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold truncate">
                              {entry.partnerNome || "Usuário"}
                            </p>
                            <span className="text-[0.6rem] text-text-subtle shrink-0">
                              {timeLabel(entry.lastTs)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-xs text-text-muted truncate">
                              {entry.lastText}
                            </p>
                            {entry.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-gold text-black text-[0.55rem] font-bold shrink-0">
                                {entry.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Chat area */}
            <div className="flex flex-col">
              {activePartner ? (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                    {activePartner.partnerFoto ? (
                      <img
                        src={activePartner.partnerFoto}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,211,0,0.3), #080604)",
                        }}
                      />
                    )}
                    <p className="text-sm font-semibold">
                      {activePartner.partnerNome}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-3 no-scrollbar">
                    {messages.map((m) => {
                      const isMe = m.senderId === userId;
                      return (
                        <div
                          key={m.id}
                          className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5",
                              isMe
                                ? "bg-gold text-black rounded-br-md"
                                : "bg-elevated text-text-primary rounded-bl-md"
                            )}
                          >
                            <p className="text-sm leading-relaxed">
                              {m.text}
                            </p>
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1",
                                isMe ? "justify-end" : "justify-start"
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[0.6rem]",
                                  isMe
                                    ? "text-black/50"
                                    : "text-text-subtle"
                                )}
                              >
                                {new Date(m.createdAt).toLocaleTimeString(
                                  "pt-BR",
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                              {isMe &&
                                (m.isRead ? (
                                  <CheckCheck
                                    size={12}
                                    className="text-black/50"
                                  />
                                ) : (
                                  <Check
                                    size={12}
                                    className="text-black/50"
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Mensagem..."
                        className="flex-1 bg-input border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!draft.trim()}
                        className="h-10 w-10 rounded-xl bg-gold text-black flex items-center justify-center hover-real:brightness-110 transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <MessageCircle
                      size={32}
                      className="text-gold/30 mx-auto mb-3"
                    />
                    <p className="text-sm">
                      Selecione uma conversa pra começar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
