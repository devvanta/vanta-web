"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  when: string;
  unread: number;
  online: boolean;
  gradient: string;
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: "ana",
    name: "Ana Souza",
    handle: "@anapraia",
    lastMessage: "Bora no sunset domingo?",
    when: "14:22",
    unread: 2,
    online: true,
    gradient:
      "linear-gradient(135deg, rgba(255,211,0,0.35), rgba(8,6,4,0.95))",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Viu que saiu o line-up do Sunset Privilege?",
        time: "14:15",
      },
      {
        id: "2",
        from: "me",
        text: "Vi! A Ana Prado abrindo de novo ❤️",
        time: "14:16",
        read: true,
      },
      {
        id: "3",
        from: "them",
        text: "Tô pensando em ir. Tu vai?",
        time: "14:18",
      },
      {
        id: "4",
        from: "them",
        text: "Bora no sunset domingo?",
        time: "14:22",
      },
    ],
  },
  {
    id: "rafa",
    name: "Rafa Beats",
    handle: "@rafabeats",
    lastMessage: "Transferi o ingresso do samba ✅",
    when: "12:04",
    unread: 0,
    online: false,
    gradient: "linear-gradient(135deg, #28221a, #080604)",
    messages: [
      {
        id: "1",
        from: "me",
        text: "Rafa, me passa aquele ingresso do samba?",
        time: "11:40",
        read: true,
      },
      {
        id: "2",
        from: "them",
        text: "Fechou, só transferir pelo app",
        time: "11:55",
      },
      {
        id: "3",
        from: "them",
        text: "Transferi o ingresso do samba ✅",
        time: "12:04",
      },
    ],
  },
  {
    id: "mat",
    name: "Matheus Lopes",
    handle: "@matlps",
    lastMessage: "Tamo junto no techno quinta",
    when: "ontem",
    unread: 0,
    online: false,
    gradient:
      "linear-gradient(135deg, rgba(255,140,20,0.2), #080604)",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Tamo junto no techno quinta",
        time: "22:30",
      },
    ],
  },
  {
    id: "grupo",
    name: "Rolê de sexta",
    handle: "grupo · 7 pessoas",
    lastMessage: "Ju: Eu tô dentro, só confirma até 19h",
    when: "ontem",
    unread: 5,
    online: false,
    gradient:
      "linear-gradient(135deg, rgba(168,85,247,0.2), #080604)",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Galera, alguém vai no funk sexta?",
        time: "20:00",
      },
      {
        id: "2",
        from: "them",
        text: "Ju: Eu tô dentro, só confirma até 19h",
        time: "21:15",
      },
    ],
  },
];

export default function MensagensPage() {
  const [selectedId, setSelectedId] = useState<string>(conversations[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const selected = conversations.find((c) => c.id === selectedId)!;
  const filtered = conversations.filter((c) =>
    `${c.name} ${c.handle} ${c.lastMessage}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <div className="rounded-3xl border border-white/5 bg-card overflow-hidden h-[calc(100vh-12rem)] min-h-[540px]">
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-full">
        {/* Sidebar conversas */}
        <aside className="border-r border-white/5 flex flex-col min-h-0">
          <div className="p-5 border-b border-white/5">
            <h1 className="text-xl mb-3">Mensagens</h1>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar conversa..."
                className="w-full bg-input border border-white/5 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-auto no-scrollbar divide-y divide-white/5">
            {filtered.map((c) => {
              const active = selectedId === c.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full text-left p-4 flex items-start gap-3 cursor-pointer transition-colors duration-200",
                      active
                        ? "bg-gold/5 border-l-2 border-gold"
                        : "hover-real:bg-elevated/50 border-l-2 border-transparent",
                    )}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="h-11 w-11 rounded-full border border-white/10"
                        style={{ background: c.gradient }}
                      />
                      {c.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold truncate">
                          {c.name}
                        </p>
                        <span className="text-[0.65rem] text-text-muted shrink-0">
                          {c.when}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs line-clamp-1",
                          c.unread > 0
                            ? "text-text-primary font-medium"
                            : "text-text-muted",
                        )}
                      >
                        {c.lastMessage}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-gold text-black text-[0.6rem] font-bold shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Thread aberta */}
        <section className="flex flex-col min-h-0">
          <header className="p-5 border-b border-white/5 flex items-center gap-3">
            <div className="relative">
              <div
                className="h-10 w-10 rounded-full border border-white/10"
                style={{ background: selected.gradient }}
              />
              {selected.online && (
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{selected.name}</p>
              <p className="text-xs text-text-muted">
                {selected.online
                  ? "online agora"
                  : selected.handle === "grupo · 7 pessoas"
                    ? selected.handle
                    : `visto por último hoje`}
              </p>
            </div>
            <button className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-text-secondary hover-real:text-text-primary cursor-pointer transition-colors duration-200">
              <MoreVertical size={14} />
            </button>
          </header>

          <div className="flex-1 overflow-auto no-scrollbar p-5 space-y-3">
            {selected.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.from === "me" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "me"
                      ? "bg-gold text-black rounded-br-md"
                      : "bg-elevated border border-white/5 text-text-primary rounded-bl-md",
                  )}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-[0.6rem]",
                      m.from === "me" ? "text-black/60" : "text-text-muted",
                    )}
                  >
                    <span>{m.time}</span>
                    {m.from === "me" &&
                      (m.read ? (
                        <CheckCheck size={10} />
                      ) : (
                        <Check size={10} />
                      ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicator typing (mock) */}
            {selected.id === "ana" && (
              <div className="flex justify-start">
                <div className="bg-elevated border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="p-4 border-t border-white/5">
            <div className="flex items-end gap-2">
              <button className="h-10 w-10 rounded-xl border border-white/10 bg-elevated flex items-center justify-center text-text-muted hover-real:text-text-primary shrink-0 cursor-pointer transition-colors duration-200">
                <Paperclip size={14} />
              </button>
              <div className="flex-1 relative">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="w-full bg-input border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && draft.trim()) {
                      setDraft("");
                    }
                  }}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover-real:text-text-primary cursor-pointer transition-colors duration-200">
                  <Smile size={14} />
                </button>
              </div>
              <button
                onClick={() => draft.trim() && setDraft("")}
                disabled={!draft.trim()}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-95",
                  draft.trim()
                    ? "bg-gold text-black hover-real:brightness-110"
                    : "bg-elevated border border-white/10 text-text-muted cursor-not-allowed",
                )}
                aria-label="Enviar"
              >
                <Send size={14} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
