import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare,
  FileText,
  BookOpen,
  Shield,
  Plus,
  Database,
  CornerDownLeft,
  Search,
} from "lucide-react";
import type { Conversation, Doc } from "./types";

type Tab = "assistant" | "kb" | "admin";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigation" | "Conversations" | "Documents" | "Actions";
  icon: React.ReactNode;
  run: () => void;
  keywords?: string;
};

export function CommandPalette({
  open,
  onClose,
  conversations,
  docs,
  onSelectConversation,
  onOpenDoc,
  onTab,
  onNewChat,
  onOpenNetsuite,
}: {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  docs: Doc[];
  onSelectConversation: (id: string) => void;
  onOpenDoc: (doc: Doc) => void;
  onTab: (t: Tab) => void;
  onNewChat: () => void;
  onOpenNetsuite: () => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const run = (fn: () => void) => () => {
      fn();
      onClose();
    };
    const actions: Item[] = [
      {
        id: "nav-assistant",
        label: "Go to Assistant",
        hint: "⌘1",
        group: "Navigation",
        icon: <MessageSquare size={14} />,
        run: run(() => onTab("assistant")),
      },
      {
        id: "nav-kb",
        label: "Go to Knowledge Base",
        hint: "⌘2",
        group: "Navigation",
        icon: <BookOpen size={14} />,
        run: run(() => onTab("kb")),
      },
      {
        id: "nav-admin",
        label: "Go to Admin",
        hint: "⌘3",
        group: "Navigation",
        icon: <Shield size={14} />,
        run: run(() => onTab("admin")),
      },
      {
        id: "act-new",
        label: "New chat",
        hint: "⌘⇧O",
        group: "Actions",
        icon: <Plus size={14} />,
        run: run(() => {
          onTab("assistant");
          onNewChat();
        }),
      },
      {
        id: "act-netsuite",
        label: "Open NetSuite panel",
        group: "Actions",
        icon: <Database size={14} />,
        run: run(() => {
          onTab("assistant");
          onOpenNetsuite();
        }),
      },
    ];
    const convItems: Item[] = conversations.map((c) => ({
      id: "conv-" + c.id,
      label: c.title,
      group: "Conversations",
      icon: <MessageSquare size={14} />,
      run: run(() => {
        onTab("assistant");
        onSelectConversation(c.id);
      }),
      keywords: c.messages.map((m) => m.content).join(" "),
    }));
    const docItems: Item[] = docs.map((d) => ({
      id: "doc-" + d.id,
      label: d.title,
      hint: d.id,
      group: "Documents",
      icon: <FileText size={14} />,
      run: run(() => onOpenDoc(d)),
      keywords: d.id,
    }));
    return [...actions, ...convItems, ...docItems];
  }, [conversations, docs, onTab, onNewChat, onSelectConversation, onOpenDoc, onOpenNetsuite, onClose]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) =>
      (i.label + " " + (i.hint ?? "") + " " + (i.keywords ?? ""))
        .toLowerCase()
        .includes(needle)
    );
  }, [items, q]);

  useEffect(() => {
    if (idx >= filtered.length) setIdx(Math.max(0, filtered.length - 1));
  }, [filtered, idx]);

  const grouped = useMemo(() => {
    const order: Item["group"][] = ["Navigation", "Actions", "Conversations", "Documents"];
    const groups = new Map<Item["group"], Item[]>();
    for (const i of filtered) {
      if (!groups.has(i.group)) groups.set(i.group, []);
      groups.get(i.group)!.push(i);
    }
    return order.filter((g) => groups.has(g)).map((g) => [g, groups.get(g)!] as const);
  }, [filtered]);

  const flatIndexFor = (item: Item) => filtered.indexOf(item);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-6 bg-[#0F172A]/30 animate-[fadeIn_120ms_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-[620px] overflow-hidden animate-[slideUp_160ms_ease-out]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
          <Search size={16} className="text-[#94A3B8]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                filtered[idx]?.run();
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search conversations, documents, actions…"
            className="flex-1 bg-transparent focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
          />
          <kbd className="text-[#94A3B8] border border-[#E2E8F0] rounded px-1.5 py-0.5 tabular-nums">
            Esc
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-[#94A3B8]">No results</div>
          ) : (
            grouped.map(([group, list]) => (
              <div key={group} className="mb-2">
                <div className="px-4 py-1.5 text-[#94A3B8]">{group}</div>
                <ul>
                  {list.map((item) => {
                    const active = flatIndexFor(item) === idx;
                    return (
                      <li key={item.id}>
                        <button
                          onMouseEnter={() => setIdx(flatIndexFor(item))}
                          onClick={() => item.run()}
                          className={`w-full text-left flex items-center gap-3 px-4 py-2 ${
                            active ? "bg-[#F1F5F9]" : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <span className="text-[#475569] shrink-0">{item.icon}</span>
                          <span className="flex-1 truncate text-[#0F172A]">
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="text-[#94A3B8] tabular-nums truncate max-w-[220px]">
                              {item.hint}
                            </span>
                          )}
                          {active && (
                            <CornerDownLeft size={12} className="text-[#94A3B8]" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#E2E8F0] px-4 py-2 flex items-center gap-4 text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">↑</kbd>
            <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">Esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
