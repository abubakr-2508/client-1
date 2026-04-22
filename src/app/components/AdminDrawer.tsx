import { X, RefreshCw, ExternalLink, History } from "lucide-react";
import type { Doc } from "./types";
import { toast } from "sonner";

export function AdminDrawer({
  doc,
  onClose,
  onView,
  onReindex,
}: {
  doc: Doc | null;
  onClose: () => void;
  onView: (d: Doc) => void;
  onReindex: (id: string) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none ${doc ? "" : ""}`}
      aria-hidden={!doc}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0F172A]/20 transition-opacity duration-200 ${
          doc ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute top-0 right-0 h-full w-[420px] bg-white border-l border-[#E2E8F0] transition-transform duration-200 ease-out pointer-events-auto ${
          doc ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {doc && (
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="text-[#0F172A] truncate">{doc.title}</div>
                <div className="text-[#94A3B8] truncate tabular-nums">{doc.id}</div>
              </div>
              <button
                onClick={onClose}
                className="text-[#475569] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F1F5F9]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto px-5 py-5 space-y-6">
              <section>
                <div className="text-[#475569] mb-2">Metadata</div>
                <div className="border border-[#E2E8F0] rounded-xl divide-y divide-[#EEF2F6]">
                  <Row label="Status" value={<StatusDot status={doc.status} />} />
                  <Row label="Pages" value={<span className="tabular-nums">{doc.pages}</span>} />
                  <Row label="Size" value={<span className="tabular-nums">{doc.sizeKb} KB</span>} />
                  <Row label="Owner" value={doc.owner} />
                  <Row label="Updated" value={<span className="tabular-nums">{doc.updated}</span>} />
                  <Row label="AI Status" value="Indexed for AI responses" />
                </div>
              </section>

              <section>
                <div className="text-[#475569] mb-2 flex items-center gap-1.5">
                  <History size={12} /> Version history
                </div>
                <ul className="border border-[#E2E8F0] rounded-xl divide-y divide-[#EEF2F6]">
                  {[
                    { v: "v4", who: doc.owner, when: doc.updated, tag: "Current" },
                    { v: "v3", who: "Arjun S.", when: "2026-03-28", tag: "" },
                    { v: "v2", who: "Priya N.", when: "2026-02-14", tag: "" },
                  ].map((x) => (
                    <li key={x.v} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0F172A] tabular-nums">{x.v}</span>
                        <span className="text-[#475569]">{x.who}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#94A3B8] tabular-nums">{x.when}</span>
                        {x.tag && (
                          <span className="text-[#2563EB] bg-[#EFF6FF] rounded-md px-1.5 py-0.5">
                            {x.tag}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="text-[#475569] mb-2">Indexing log</div>
                <div className="border border-[#E2E8F0] rounded-xl p-4 space-y-1.5 text-[#475569]">
                  <LogLine t="04:12:08" msg="Reindex started" />
                  <LogLine t="04:12:09" msg="Parsed 4 pages · extracted 27 chunks" />
                  <LogLine t="04:12:10" msg="Embeddings generated" />
                  <LogLine t="04:12:11" msg="Index commit ok" />
                </div>
              </section>
            </div>

            <div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center gap-2 shrink-0">
              <button
                onClick={() => onView(doc)}
                className="flex-1 border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-2 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={14} /> View document
              </button>
              <button
                onClick={() => {
                  onReindex(doc.id);
                  toast.success("Reindex queued", { description: doc.id });
                }}
                className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-2 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={14} /> Reindex
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-[#475569]">{label}</span>
      <span className="text-[#0F172A]">{value}</span>
    </div>
  );
}

function StatusDot({ status }: { status: Doc["status"] }) {
  const map = {
    indexed: { label: "Indexed", color: "#16A34A" },
    pending: { label: "Pending", color: "#D97706" },
    failed: { label: "Failed", color: "#DC2626" },
  } as const;
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      <span>{s.label}</span>
    </span>
  );
}

function LogLine({ t, msg }: { t: string; msg: string }) {
  return (
    <div className="flex gap-3">
      <span className="tabular-nums text-[#94A3B8]">{t}</span>
      <span>{msg}</span>
    </div>
  );
}
