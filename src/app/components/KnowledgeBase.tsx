import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  ChevronRight,
  History,
  Users,
  Eye,
  Pencil,
  CircleDot,
  CheckCircle2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  FileText,
  Compass,
  Undo2,
  Handshake,
  ShoppingCart,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { DocId } from "./types";
import { DOC_TITLES } from "./data";

type KBPage = {
  id: DocId;
  icon: LucideIcon;
  section: string;
  lastEditedBy: string;
  lastEditedAt: string;
};

const PAGES: KBPage[] = [
  {
    id: "invoice_creation_process.pdf",
    icon: FileText,
    section: "Finance",
    lastEditedBy: "Priya N.",
    lastEditedAt: "2 hours ago",
  },
  {
    id: "approval_hierarchy.pdf",
    icon: Compass,
    section: "Finance",
    lastEditedBy: "Priya N.",
    lastEditedAt: "yesterday",
  },
  {
    id: "refund_process.pdf",
    icon: Undo2,
    section: "Finance",
    lastEditedBy: "Meera K.",
    lastEditedAt: "3 days ago",
  },
  {
    id: "vendor_onboarding_process.pdf",
    icon: Handshake,
    section: "Vendors",
    lastEditedBy: "Arjun S.",
    lastEditedAt: "last week",
  },
  {
    id: "purchase_order_workflow.pdf",
    icon: ShoppingCart,
    section: "Procurement",
    lastEditedBy: "Arjun S.",
    lastEditedAt: "2 weeks ago",
  },
];

const DEFAULT_BODY: Record<DocId, string> = {
  "invoice_creation_process.pdf": `## Overview
The invoice approval process follows four sequential stages across operations, manager review, finance verification, and posting.

## Process
1. **Creation** — Operations team creates the invoice and runs initial validation.
2. **Manager approval** — First-level approval is required before the invoice advances.
3. **Finance verification** — Finance performs financial review and mandatory approval.
4. **Final posting** — Once approvals are complete, the invoice is posted.

## Key rules
- No invoice proceeds without manager approval.
- Finance approval is mandatory before posting.
- Incomplete invoices are rejected at the validation stage.`,
  "approval_hierarchy.pdf": `## Overview
Approval is governed by role hierarchy and transaction value.

## Levels
- **Manager approval** is required for all invoices.
- **Finance** performs secondary approval before posting.
- **Senior management** approves high-value transactions.

## Thresholds
Approval levels increase with transaction value, and certain thresholds trigger additional approvals.`,
  "vendor_onboarding_process.pdf": `## Process
1. Vendor submits onboarding request with required documentation.
2. Compliance and KYC checks are performed.
3. Verified details are entered into the system.
4. Approval is granted after successful verification.
5. The vendor is activated for transactions.

## Key rules
- Missing documents halt onboarding.
- Compliance check is mandatory.
- Only approved vendors can be used in transactions.`,
  "refund_process.pdf": `## Process
1. Request is initiated and the refund reason is verified.
2. Manager approval is required before processing.
3. Finance disburses the refund and records it in the system.

## Key rules
- All refunds require validation.
- Approval is mandatory before processing.
- Finance handles final disbursement.`,
  "purchase_order_workflow.pdf": `## Process
1. Purchase request is created and reviewed by the manager.
2. A registered vendor is selected or assigned.
3. The purchase order is issued upon approval.
4. Order execution and delivery follow against the issued PO.

## Key rules
- No PO without approval.
- Vendor must be registered.
- Approval required before issuing PO.`,
};

export function KnowledgeBase({
  edits,
  onSave,
  initialPage,
  onPageConsumed,
}: {
  edits: Partial<Record<DocId, string>>;
  onSave: (id: DocId, content: string) => void;
  initialPage?: DocId | null;
  onPageConsumed?: () => void;
}) {
  const [activeId, setActiveId] = useState<DocId>(initialPage ?? PAGES[0].id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [published, setPublished] = useState<Record<DocId, boolean>>({});
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPage) {
      setActiveId(initialPage);
      onPageConsumed?.();
    }
  }, [initialPage]);

  const activePage = PAGES.find((p) => p.id === activeId)!;
  const current = edits[activeId] ?? DEFAULT_BODY[activeId];
  const hasDraftChanges = !!edits[activeId];
  const isPublished = published[activeId] ?? false;

  useEffect(() => {
    setEditing(false);
    setDraft(current);
    setSavedAt(null);
  }, [activeId]);

  // Autosave with debounce while editing
  useEffect(() => {
    if (!editing) return;
    const t = setTimeout(() => {
      if (draft !== current) {
        onSave(activeId, draft);
        setSavedAt(Date.now());
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draft, editing]);

  function publish() {
    setPublished((prev) => ({ ...prev, [activeId]: true }));
    toast.success("Published", {
      description: "Assistant answers will reflect this update.",
    });
  }

  function startEdit() {
    setDraft(current);
    setEditing(true);
    setTimeout(() => taRef.current?.focus(), 10);
  }

  function insertAtCursor(prefix: string, suffix = "") {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const before = value.slice(0, s);
    const mid = value.slice(s, e) || "text";
    const after = value.slice(e);
    const next = before + prefix + mid + suffix + after;
    setDraft(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = (before + prefix + mid).length;
      ta.setSelectionRange(pos, pos);
    });
  }

  const groupedPages = useMemo(() => {
    const filtered = PAGES.filter((p) => {
      const body = edits[p.id] ?? DEFAULT_BODY[p.id];
      const needle = query.toLowerCase();
      return (
        !needle ||
        DOC_TITLES[p.id].toLowerCase().includes(needle) ||
        body.toLowerCase().includes(needle) ||
        p.id.toLowerCase().includes(needle)
      );
    });
    const map = new Map<string, KBPage[]>();
    for (const p of filtered) {
      if (!map.has(p.section)) map.set(p.section, []);
      map.get(p.section)!.push(p);
    }
    return Array.from(map.entries());
  }, [query, edits]);

  const headings = useMemo(() => {
    const text = editing ? draft : current;
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("## "))
      .map((l) => l.replace(/^##\s+/, ""));
  }, [editing, draft, current]);

  const savedAgo = useSavedAgo(savedAt);

  return (
    <div className="flex-1 flex min-h-0 bg-[#F8FAFC]">
      {/* Left tree */}
      <aside className="w-[280px] border-r border-[#E2E8F0] bg-white shrink-0 flex flex-col">
        <div className="p-3 border-b border-[#E2E8F0]">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages"
              className="w-full border border-[#E2E8F0] rounded-md pl-7.5 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-colors"
              style={{ paddingLeft: 30 }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {groupedPages.length === 0 && (
            <div className="px-4 py-6 text-center text-[#94A3B8]">No results</div>
          )}
          {groupedPages.map(([section, items]) => (
            <Section key={section} label={section}>
              {items.map((p) => {
                const isActive = p.id === activeId;
                const pub = published[p.id];
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`group w-full text-left flex items-center gap-2 mx-2 px-2 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-[#F1F5F9] text-[#0F172A]"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }`}
                    style={{ width: "calc(100% - 16px)" }}
                  >
                    <Icon size={14} className="shrink-0 text-[#64748B]" />
                    <span className="truncate flex-1">{DOC_TITLES[p.id]}</span>
                    {edits[p.id] && !pub && (
                      <CircleDot
                        size={10}
                        className="text-[#D97706] shrink-0"
                        aria-label="Unpublished changes"
                      />
                    )}
                  </button>
                );
              })}
            </Section>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-[#E2E8F0] text-[#94A3B8] tabular-nums">
          {PAGES.length} pages
        </div>
      </aside>

      {/* Center content */}
      <section className="flex-1 overflow-auto">
        <div className="max-w-[880px] mx-auto px-10 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[#94A3B8] mb-5">
            <span>Knowledge Base</span>
            <ChevronRight size={12} />
            <span>{activePage.section}</span>
            <ChevronRight size={12} />
            <span className="text-[#475569]">{DOC_TITLES[activeId]}</span>
          </nav>

          {/* Title row */}
          <div className="flex items-start justify-between gap-6 mb-2">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#475569] shrink-0">
                <activePage.icon size={18} />
              </div>
              <div className="min-w-0">
                <h1 className="text-[#0F172A]" style={{ fontSize: 26, lineHeight: 1.2 }}>
                  {DOC_TITLES[activeId]}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-[#94A3B8]">
                  <span className="inline-flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px]">
                      {activePage.lastEditedBy.charAt(0)}
                    </div>
                    Edited by {activePage.lastEditedBy} · {activePage.lastEditedAt}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">{activePage.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <PublishPill published={isPublished} dirty={hasDraftChanges && !isPublished} />
              {editing && savedAgo && (
                <span className="text-[#94A3B8] inline-flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#16A34A]" /> {savedAgo}
                </span>
              )}
              <button
                onClick={() => setHistoryOpen((v) => !v)}
                className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md p-1.5 inline-flex items-center gap-1.5 transition-colors"
                aria-label="Version history"
                title="Version history"
              >
                <History size={13} />
              </button>
              {!editing ? (
                <>
                  <button
                    onClick={publish}
                    disabled={!hasDraftChanges && isPublished}
                    className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublished && !hasDraftChanges ? "Published" : "Publish"}
                  </button>
                  <button
                    onClick={startEdit}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md px-3 py-1.5 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setDraft(current);
                    }}
                    className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-1.5 transition-colors"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-[#EEF2F6] my-6" />

          {/* Content */}
          {editing ? (
            <div>
              <FormattingToolbar onAction={insertAtCursor} />
              <textarea
                ref={taRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[420px] border border-[#E2E8F0] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] text-[#0F172A] bg-white font-mono"
                style={{ fontSize: 13, lineHeight: 1.7 }}
              />
              <div className="mt-2 text-[#94A3B8] flex items-center gap-3">
                <span>Markdown supported · autosaves as draft</span>
                <span>·</span>
                <span>
                  <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">⌘B</kbd> bold
                </span>
                <span>
                  <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5">⌘I</kbd> italic
                </span>
              </div>
            </div>
          ) : (
            <article className="flex gap-10">
              <div className="flex-1 min-w-0 max-w-[600px]">
                <Rendered text={current} />

                <div className="mt-10 pt-6 border-t border-[#EEF2F6] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <Users size={12} /> No comments yet
                  </div>
                  <div className="flex items-center gap-2 text-[#94A3B8]">
                    <FileText size={12} />
                    Source document: <span className="tabular-nums">{activeId}</span>
                  </div>
                </div>
              </div>

              {headings.length > 0 && (
                <aside className="w-[180px] shrink-0 sticky top-0 self-start">
                  <div className="text-[#94A3B8] mb-2">On this page</div>
                  <ul className="space-y-1.5 border-l border-[#EEF2F6]">
                    {headings.map((h) => (
                      <li key={h}>
                        <a
                          href={`#h-${slugify(h)}`}
                          className="block pl-3 py-0.5 text-[#475569] hover:text-[#0F172A] border-l-2 border-transparent hover:border-[#2563EB] -ml-px transition-colors"
                        >
                          {h}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </article>
          )}
        </div>
      </section>

      {/* Version history drawer */}
      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="px-4 py-1 text-[#94A3B8] tracking-wide uppercase" style={{ fontSize: 11 }}>
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function PublishPill({ published, dirty }: { published: boolean; dirty: boolean }) {
  if (dirty) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[#D97706] bg-[#FFFBEB]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        Draft changes
      </span>
    );
  }
  if (published) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[#16A34A] bg-[#F0FDF4]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[#475569] bg-[#F1F5F9]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
      Draft
    </span>
  );
}

function FormattingToolbar({
  onAction,
}: {
  onAction: (prefix: string, suffix?: string) => void;
}) {
  const btn =
    "p-1.5 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors";
  return (
    <div className="mb-2 border border-[#E2E8F0] rounded-lg bg-white p-1 inline-flex items-center gap-0.5">
      <button onClick={() => onAction("## ")} className={btn} title="Heading">
        <Heading2 size={14} />
      </button>
      <button onClick={() => onAction("**", "**")} className={btn} title="Bold">
        <Bold size={14} />
      </button>
      <button onClick={() => onAction("*", "*")} className={btn} title="Italic">
        <Italic size={14} />
      </button>
      <span className="w-px h-4 bg-[#E2E8F0] mx-1" />
      <button onClick={() => onAction("- ")} className={btn} title="Bulleted list">
        <List size={14} />
      </button>
      <button onClick={() => onAction("1. ")} className={btn} title="Numbered list">
        <ListOrdered size={14} />
      </button>
      <button onClick={() => onAction("> ")} className={btn} title="Callout">
        <Quote size={14} />
      </button>
    </div>
  );
}

function Rendered({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let key = 0;
  let listBuf: { ordered: boolean; items: string[] } | null = null;

  function flushList() {
    if (!listBuf) return;
    const Tag = listBuf.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={key++}
        className={`${listBuf.ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1.5 text-[#0F172A]`}
      >
        {listBuf.items.map((l, i) => (
          <li key={i}>{renderInline(l)}</li>
        ))}
      </Tag>
    );
    listBuf = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();
    if (/^\s*$/.test(line)) {
      flushList();
      continue;
    }
    const h2 = line.match(/^##\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    const ol = line.match(/^(\d+)\.\s+(.*)/);
    const ul = line.match(/^[-*]\s+(.*)/);
    const quote = line.match(/^>\s+(.*)/);

    if (h2) {
      flushList();
      const title = h2[1];
      blocks.push(
        <h2
          key={key++}
          id={"h-" + slugify(title)}
          className="text-[#0F172A] mt-8 mb-3"
          style={{ fontSize: 18, fontWeight: 600 }}
        >
          {title}
        </h2>
      );
    } else if (h3) {
      flushList();
      blocks.push(
        <h3
          key={key++}
          className="text-[#0F172A] mt-5 mb-2"
          style={{ fontSize: 15, fontWeight: 600 }}
        >
          {h3[1]}
        </h3>
      );
    } else if (ol) {
      if (!listBuf || !listBuf.ordered) {
        flushList();
        listBuf = { ordered: true, items: [] };
      }
      listBuf.items.push(ol[2]);
    } else if (ul) {
      if (!listBuf || listBuf.ordered) {
        flushList();
        listBuf = { ordered: false, items: [] };
      }
      listBuf.items.push(ul[1]);
    } else if (quote) {
      flushList();
      blocks.push(
        <div
          key={key++}
          className="border-l-2 border-[#2563EB] bg-[#EFF6FF] rounded-r-md px-4 py-2.5 my-2 text-[#0F172A]"
        >
          {renderInline(quote[1])}
        </div>
      );
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="text-[#0F172A] my-2" style={{ lineHeight: 1.65 }}>
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();
  return <div>{blocks}</div>;
}

function renderInline(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <span key={i} style={{ fontWeight: 600 }} className="text-[#0F172A]">
          {p.slice(2, -2)}
        </span>
      );
    }
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
      return (
        <em key={i} className="text-[#0F172A]">
          {p.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function useSavedAgo(at: number | null) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!at) return;
    const iv = setInterval(() => force((v) => v + 1), 5000);
    return () => clearInterval(iv);
  }, [at]);
  if (!at) return "";
  const secs = Math.floor((Date.now() - at) / 1000);
  if (secs < 5) return "Saved just now";
  if (secs < 60) return `Saved ${secs}s ago`;
  return `Saved ${Math.floor(secs / 60)}m ago`;
}

function HistoryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const versions = [
    { v: "v6", who: "Priya N.", when: "2 hours ago", summary: "Updated approval flow wording", current: true },
    { v: "v5", who: "Priya N.", when: "yesterday", summary: "Added key rules section" },
    { v: "v4", who: "Arjun S.", when: "Mar 28, 2026", summary: "Reorganized process steps" },
    { v: "v3", who: "Meera K.", when: "Feb 14, 2026", summary: "Initial published version" },
  ];
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#0F172A]/20 transition-opacity duration-200 z-40 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-14 right-0 bottom-0 w-[380px] bg-white border-l border-[#E2E8F0] z-40 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-[#0F172A]">
              <History size={14} /> Version history
            </div>
            <button
              onClick={onClose}
              className="text-[#475569] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F1F5F9]"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2.5">
            {versions.map((v) => (
              <div
                key={v.v}
                className={`border rounded-xl p-3.5 transition-colors ${
                  v.current ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0] hover:border-[#94A3B8]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#0F172A] tabular-nums">{v.v}</span>
                  {v.current ? (
                    <span className="text-[#2563EB]">Current</span>
                  ) : (
                    <button className="text-[#475569] hover:text-[#0F172A]">Restore</button>
                  )}
                </div>
                <div className="text-[#475569] mb-1">{v.summary}</div>
                <div className="text-[#94A3B8]">
                  {v.who} · {v.when}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[#E2E8F0] text-[#94A3B8]">
            <Eye size={12} className="inline mr-1.5 -mt-0.5" />
            Previewing latest version
          </div>
        </div>
      </aside>
    </>
  );
}
