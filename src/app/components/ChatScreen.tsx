import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Send,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageSquare,
  Pin,
} from "lucide-react";
import { toast } from "sonner";
import type { Conversation, Doc, DocId, Message } from "./types";
import { findAnswer } from "./answers";
import { CitationChip } from "./CitationChip";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const GREETING: Message = {
  id: "greet",
  role: "assistant",
  content: "Hi, I'm your AI assistant. Ask me anything about your processes.",
};

const STARTER_PROMPTS = [
  "What is the invoice approval process?",
  "How do we onboard a new vendor?",
  "Who approves high-value invoices?",
  "Show the approval chain for INV-20461",
];

const FOLLOWUPS: Record<string, string[]> = {
  invoice: ["Who approves high-value invoices?", "Check invoice status"],
  vendor: ["What compliance checks are required?", "Show approval chain"],
  refund: ["Who can approve a refund?", "Does refund need finance sign-off?"],
  purchase: ["What happens after a PO is issued?", "Is vendor registration mandatory?"],
  hierarchy: ["What thresholds trigger senior approval?"],
};

export function newConversation(): Conversation {
  return {
    id: uid(),
    title: "New chat",
    messages: [GREETING],
    updatedAt: Date.now(),
  };
}

export function ChatScreen({
  conversations,
  setConversations,
  activeId,
  setActiveId,
  docs,
  onOpenDoc,
  onOpenNetsuite,
  kbEdits,
}: {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  activeId: string;
  setActiveId: (id: string) => void;
  docs: Doc[];
  onOpenDoc: (file: DocId, page: number) => void;
  onOpenNetsuite: () => void;
  kbEdits: Partial<Record<DocId, string>>;
}) {
  const active = conversations.find((c) => c.id === activeId) || conversations[0];
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function newChat() {
    setConversations((prev) => {
      if (prev.length >= 10) {
        toast.error("Conversation limit reached", {
          description: "Delete a chat to start a new one (max 10).",
        });
        return prev;
      }
      const c = newConversation();
      setActiveId(c.id);
      return [c, ...prev];
    });
  }

  function startRename(id: string, currentTitle: string) {
    setRenamingId(id);
    setRenameVal(currentTitle);
    setMenuOpen(null);
  }

  function commitRename() {
    if (!renamingId) return;
    const id = renamingId;
    const v = renameVal.trim();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: v || c.title } : c))
    );
    setRenamingId(null);
  }

  function togglePin(id: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
    setMenuOpen(null);
  }

  function deleteChat(id: string) {
    const deleted = conversations.find((c) => c.id === id);
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      const next = remaining.length ? remaining : [newConversation()];
      if (id === active.id) setActiveId(next[0].id);
      return next;
    });
    setMenuOpen(null);
    toast("Conversation deleted", {
      description: deleted?.title,
      action: deleted && {
        label: "Undo",
        onClick: () =>
          setConversations((prev) => [deleted, ...prev.filter((c) => c.id !== deleted.id)]),
      },
    });
  }

  function regenerate(messageId: string) {
    const msgIndex = active.messages.findIndex((m) => m.id === messageId);
    if (msgIndex <= 0) return;
    const prompt = active.messages[msgIndex - 1]?.content ?? "";
    const activeIdLocal = active.id;
    setConversations((prev) =>
      prev.map((c) =>
        c.id !== activeIdLocal
          ? c
          : {
              ...c,
              messages: c.messages.map((m, i) =>
                i === msgIndex ? { ...m, loading: true, content: "", rating: undefined } : m
              ),
            }
      )
    );
    setTimeout(() => produceAnswer(prompt, activeIdLocal, messageId), 600);
  }

  function produceAnswer(q: string, activeIdLocal: string, targetId: string) {
    const entry = findAnswer(q, kbEdits);
    // streaming
    const words = entry.answer.split(/(\s+)/);
    let i = 0;
    setConversations((prev) =>
      prev.map((c) =>
        c.id !== activeIdLocal
          ? c
          : {
              ...c,
              messages: c.messages.map((m) =>
                m.id === targetId
                  ? {
                      ...m,
                      loading: false,
                      streaming: true,
                      content: "",
                      citations: undefined,
                      triggersNetsuite: entry.netsuite,
                    }
                  : m
              ),
            }
      )
    );
    const iv = window.setInterval(() => {
      i += 2;
      const chunk = words.slice(0, i).join("");
      const done = i >= words.length;
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== activeIdLocal
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === targetId
                    ? {
                        ...m,
                        content: chunk,
                        streaming: !done,
                        citations: done ? entry.citations : undefined,
                      }
                    : m
                ),
              }
        )
      );
      if (done) {
        window.clearInterval(iv);
        if (entry.netsuite) onOpenNetsuite();
      }
    }, 22);
  }

  function send(promptOverride?: string) {
    const q = (promptOverride ?? input).trim();
    if (!q) return;
    const activeIdLocal = active.id;
    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: q,
      createdAt: Date.now(),
    };
    const loadingMsg: Message = {
      id: uid(),
      role: "assistant",
      content: "",
      loading: true,
      createdAt: Date.now(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id !== activeIdLocal
          ? c
          : {
              ...c,
              updatedAt: Date.now(),
              title: c.messages.length <= 1 ? q.slice(0, 40) : c.title,
              messages: [...c.messages, userMsg, loadingMsg],
            }
      )
    );
    setInput("");
    setTimeout(() => produceAnswer(q, activeIdLocal, loadingMsg.id), 700);
  }

  function setRating(messageId: string, r: "up" | "down") {
    const activeIdLocal = active.id;
    setConversations((prev) =>
      prev.map((c) =>
        c.id !== activeIdLocal
          ? c
          : {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, rating: m.rating === r ? undefined : r } : m
              ),
            }
      )
    );
    if (r === "up") toast.success("Thanks for the feedback");
    else toast("Feedback noted", { description: "We'll use this to improve answers." });
  }

  const groupedConversations = useMemo(() => {
    const filtered = conversations.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    const pinned = filtered.filter((c) => c.pinned);
    const rest = filtered.filter((c) => !c.pinned);
    const now = new Date();
    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    };
    const today = startOfDay(now);
    const yest = today - 24 * 3600 * 1000;
    const weekAgo = today - 7 * 24 * 3600 * 1000;
    const buckets: { label: string; items: Conversation[] }[] = [
      { label: "Pinned", items: pinned },
      { label: "Today", items: [] },
      { label: "Yesterday", items: [] },
      { label: "Last 7 days", items: [] },
      { label: "Older", items: [] },
    ];
    for (const c of rest) {
      if (c.updatedAt >= today) buckets[1].items.push(c);
      else if (c.updatedAt >= yest) buckets[2].items.push(c);
      else if (c.updatedAt >= weekAgo) buckets[3].items.push(c);
      else buckets[4].items.push(c);
    }
    return buckets.filter((b) => b.items.length > 0);
  }, [conversations, search]);

  const showGreeting =
    active.messages.length === 1 && active.messages[0].id === "greet";

  const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
  const followups = useMemo(() => {
    if (!lastUser) return [];
    const q = lastUser.content.toLowerCase();
    for (const [k, v] of Object.entries(FOLLOWUPS)) if (q.includes(k)) return v;
    return [];
  }, [lastUser]);

  return (
    <div className="flex-1 flex min-h-0">
      {/* Sidebar */}
      <aside className="w-[272px] border-r border-[#E2E8F0] bg-white flex flex-col shrink-0">
        <div className="p-3 border-b border-[#E2E8F0] space-y-2.5">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md py-2 transition-colors"
          >
            <Plus size={14} />
            New chat
            <kbd className="ml-1 border border-white/30 rounded px-1 py-0.5 text-white/80 tabular-nums">
              ⌘⇧O
            </kbd>
          </button>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="w-full border border-[#E2E8F0] rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {groupedConversations.length === 0 && (
            <div className="px-4 py-8 text-center text-[#94A3B8]">No conversations</div>
          )}
          {groupedConversations.map((b) => (
            <div key={b.label} className="mb-3">
              <div className="px-4 py-1 text-[#94A3B8]">{b.label}</div>
              {b.items.map((c) => {
                const isActive = c.id === active.id;
                const isRenaming = renamingId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`group relative flex items-center justify-between rounded-md mx-2 px-3 py-2 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#F1F5F9] text-[#0F172A]"
                        : "text-[#475569] hover:bg-[#F8FAFC]"
                    }`}
                    onClick={() => !isRenaming && setActiveId(c.id)}
                  >
                    {isRenaming ? (
                      <input
                        autoFocus
                        value={renameVal}
                        onChange={(e) => setRenameVal(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-white border border-[#2563EB] rounded px-1.5 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <span className="truncate flex-1 flex items-center gap-1.5">
                        {c.pinned && <Pin size={10} className="text-[#94A3B8] shrink-0" />}
                        {c.title}
                      </span>
                    )}
                    {!isRenaming && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === c.id ? null : c.id);
                          }}
                          className={`p-0.5 text-[#94A3B8] hover:text-[#0F172A] transition-opacity ${
                            menuOpen === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {menuOpen === c.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-6 z-10 bg-white border border-[#E2E8F0] rounded-md py-1 w-36 animate-[fadeIn_100ms_ease-out]"
                          >
                            <SidebarMenuItem
                              label="Rename"
                              onClick={() => startRename(c.id, c.title)}
                            />
                            <SidebarMenuItem
                              label={c.pinned ? "Unpin" : "Pin"}
                              onClick={() => togglePin(c.id)}
                            />
                            <div className="my-1 h-px bg-[#EEF2F6]" />
                            <SidebarMenuItem
                              label="Delete"
                              destructive
                              onClick={() => deleteChat(c.id)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-[#E2E8F0] text-[#94A3B8] tabular-nums">
          {conversations.length} / 10 conversations
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <div ref={scrollRef} className="flex-1 overflow-auto">
          <div className="max-w-[760px] mx-auto px-6 py-8 space-y-6">
            {showGreeting ? (
              <GreetingBlock onPick={(p) => send(p)} />
            ) : (
              active.messages.map((m) => (
                <MessageBlock
                  key={m.id}
                  message={m}
                  docs={docs}
                  onOpenDoc={onOpenDoc}
                  onCopy={() => {
                    navigator.clipboard.writeText(m.content);
                    toast.success("Copied to clipboard");
                  }}
                  onRegenerate={() => regenerate(m.id)}
                  onRate={(r) => setRating(m.id, r)}
                />
              ))
            )}
            {followups.length > 0 && !active.messages.some((m) => m.loading || m.streaming) && (
              <div className="pt-2">
                <div className="text-[#94A3B8] mb-2">Suggested follow-ups</div>
                <div className="flex flex-wrap gap-2">
                  {followups.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="bg-white border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-1.5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[#E2E8F0] bg-white">
          <div className="max-w-[760px] mx-auto px-6 py-4">
            <div className="border border-[#E2E8F0] rounded-xl focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all bg-white">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about a process, vendor, or invoice…"
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 max-h-40 focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
              <div className="flex items-center justify-between px-3 pb-2">
                <div className="text-[#94A3B8] flex items-center gap-2">
                  <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">↵</kbd>
                  send
                  <span>·</span>
                  <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">⇧↵</kbd>
                  newline
                </div>
                <button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md px-3 py-1.5 flex items-center gap-1.5 transition-colors"
                >
                  <Send size={12} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SidebarMenuItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 hover:bg-[#F8FAFC] transition-colors ${
        destructive ? "text-[#DC2626]" : "text-[#475569] hover:text-[#0F172A]"
      }`}
    >
      {label}
    </button>
  );
}

function GreetingBlock({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="pt-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-[#2563EB]" />
        <span className="text-[#475569]">rag.cx assistant</span>
      </div>
      <h2 className="text-[#0F172A] mb-1" style={{ fontSize: 22 }}>
        Hi, I'm your AI assistant.
      </h2>
      <p className="text-[#475569] mb-6">
        Ask me anything about your processes, vendors, invoices, or approvals.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="text-left border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-white rounded-xl px-4 py-3 bg-white transition-colors group"
          >
            <div className="flex items-start gap-2.5">
              <MessageSquare
                size={14}
                className="text-[#94A3B8] group-hover:text-[#2563EB] mt-0.5 shrink-0 transition-colors"
              />
              <span className="text-[#0F172A]">{p}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBlock({
  message,
  docs,
  onOpenDoc,
  onCopy,
  onRegenerate,
  onRate,
}: {
  message: Message;
  docs: Doc[];
  onOpenDoc: (file: DocId, page: number) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onRate: (r: "up" | "down") => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-[#2563EB] text-white rounded-xl px-4 py-2.5 max-w-[80%] whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.loading) {
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-4 w-full space-y-2.5">
          <div className="h-3 w-1/3 bg-[#E2E8F0] rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-[#E2E8F0] rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-[#E2E8F0] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const done = !message.streaming;

  return (
    <div className="flex flex-col items-start gap-3 group">
      <div className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-4 w-full">
        <MarkdownLite text={message.content} />
        {message.streaming && (
          <span className="inline-block w-[2px] h-4 bg-[#2563EB] align-middle ml-0.5 animate-pulse" />
        )}
      </div>

      {done && (
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ToolbarBtn onClick={onCopy} label="Copy">
              <Copy size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={onRegenerate} label="Regenerate">
              <RotateCcw size={13} />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onRate("up")}
              label="Good answer"
              active={message.rating === "up"}
            >
              <ThumbsUp size={13} />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => onRate("down")}
              label="Bad answer"
              active={message.rating === "down"}
            >
              <ThumbsDown size={13} />
            </ToolbarBtn>
          </div>
          {message.citations && message.citations.length > 0 && (
            <span className="text-[#94A3B8] tabular-nums">
              Based on {message.citations.length} source
              {message.citations.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      )}

      {done && message.citations && message.citations.length > 0 && (
        <div className="w-full">
          <div className="text-[#94A3B8] mb-2">Sources</div>
          <div className="flex flex-wrap gap-2">
            {message.citations.map((c, i) => (
              <CitationChip
                key={i}
                citation={c}
                doc={docs.find((d) => d.id === c.file)}
                onOpen={() => onOpenDoc(c.file, c.page)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "text-[#2563EB] bg-[#EFF6FF]"
          : "text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
      }`}
    >
      {children}
    </button>
  );
}

function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let key = 0;

  function flushList() {
    if (listBuf.length) {
      out.push(
        <ul key={key++} className="list-disc pl-5 space-y-1 text-[#0F172A]">
          {listBuf.map((l, i) => (
            <li key={i}>{renderInline(l)}</li>
          ))}
        </ul>
      );
      listBuf = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*$/.test(line)) {
      flushList();
      out.push(<div key={key++} className="h-1" />);
      continue;
    }
    const num = line.match(/^(\d+)\.\s+(.*)/);
    const bul = line.match(/^[-*]\s+(.*)/);
    if (num) {
      flushList();
      out.push(
        <div key={key++} className="flex gap-2 text-[#0F172A]">
          <span className="text-[#475569] tabular-nums">{num[1]}.</span>
          <span>{renderInline(num[2])}</span>
        </div>
      );
    } else if (bul) {
      listBuf.push(bul[1]);
    } else {
      flushList();
      out.push(
        <p key={key++} className="text-[#0F172A]">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();
  return <div className="space-y-2">{out}</div>;
}

function renderInline(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <span key={i} className="text-[#0F172A]" style={{ fontWeight: 600 }}>
        {p.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
