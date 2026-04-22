import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Search,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { Doc } from "./types";

type SortKey = "title" | "status" | "updated";

export function AdminScreen({
  docs,
  onView,
  onReindex,
  onOpenDrawer,
}: {
  docs: Doc[];
  onView: (d: Doc) => void;
  onReindex: (id: string) => void;
  onOpenDrawer: (d: Doc) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Doc["status"]>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "updated",
    dir: "desc",
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState<{ name: string; progress: number }[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const visibleDocs = useMemo(() => {
    let rows = docs.filter((d) => d.id.toLowerCase().includes(query.toLowerCase()));
    if (status !== "all") rows = rows.filter((d) => d.status === status);
    rows = [...rows].sort((a, b) => {
      const k = sort.key;
      const av = a[k] as string;
      const bv = b[k] as string;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [docs, query, status, sort]);

  const counts = useMemo(() => {
    return {
      total: docs.length,
      indexed: docs.filter((d) => d.status === "indexed").length,
      pending: docs.filter((d) => d.status === "pending").length,
      failed: docs.filter((d) => d.status === "failed").length,
    };
  }, [docs]);

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }

  function simulateUpload(files: File[] | FileList) {
    const arr = Array.from(files);
    const items = arr.map((f) => ({ name: f.name, progress: 0 }));
    setUploading((prev) => [...prev, ...items]);
    items.forEach((it) => {
      const start = Date.now();
      const iv = window.setInterval(() => {
        const pct = Math.min(100, ((Date.now() - start) / 1800) * 100);
        setUploading((prev) =>
          prev.map((u) => (u.name === it.name ? { ...u, progress: pct } : u))
        );
        if (pct >= 100) {
          window.clearInterval(iv);
          setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.name !== it.name));
            toast.success("Upload complete", {
              description: `${it.name} queued for indexing`,
            });
          }, 300);
        }
      }, 100);
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) simulateUpload(e.dataTransfer.files);
  }

  const allSelected =
    visibleDocs.length > 0 && visibleDocs.every((d) => selected.has(d.id));

  return (
    <div className="flex-1 overflow-auto bg-[#F8FAFC]">
      <div className="max-w-[1180px] mx-auto px-8 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#0F172A]" style={{ fontSize: 22 }}>
              Documents
            </h1>
            <p className="text-[#475569]">
              Manage documents indexed for the AI assistant.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md px-3 py-2 transition-colors cursor-pointer">
            <Upload size={14} />
            Upload document
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && simulateUpload(e.target.files)}
            />
          </label>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Total" value={counts.total} icon={<FileText size={14} />} />
          <StatCard
            label="Indexed"
            value={counts.indexed}
            tone="#16A34A"
            icon={<CheckCircle2 size={14} />}
          />
          <StatCard
            label="Pending"
            value={counts.pending}
            tone="#D97706"
            icon={<Clock size={14} />}
          />
          <StatCard
            label="Failed"
            value={counts.failed}
            tone="#DC2626"
            icon={<AlertCircle size={14} />}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`mb-6 border-2 border-dashed rounded-xl p-6 flex items-center justify-between transition-colors ${
            dragActive
              ? "border-[#2563EB] bg-[#EFF6FF]"
              : "border-[#E2E8F0] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#2563EB] flex items-center justify-center">
              <Upload size={16} />
            </div>
            <div>
              <div className="text-[#0F172A]">Drop PDF, DOCX, or TXT files to index</div>
              <div className="text-[#94A3B8]">
                Max 20 MB per file · up to 50 files at a time
              </div>
            </div>
          </div>
          <label className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-3 py-1.5 cursor-pointer transition-colors">
            Browse files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && simulateUpload(e.target.files)}
            />
          </label>
        </div>

        {uploading.length > 0 && (
          <div className="mb-6 border border-[#E2E8F0] rounded-xl bg-white divide-y divide-[#EEF2F6]">
            {uploading.map((u) => (
              <div key={u.name} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#0F172A] truncate">{u.name}</span>
                  <span className="text-[#475569] tabular-nums">
                    {Math.round(u.progress)}%
                  </span>
                </div>
                <div className="h-1 bg-[#F1F5F9] rounded overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border border-[#E2E8F0] rounded-xl bg-white overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
            <div className="relative flex-1 max-w-[320px]">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by file name"
                className="w-full border border-[#E2E8F0] rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
              />
            </div>
            <div className="flex items-center gap-1">
              {(["all", "indexed", "pending", "failed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                    status === s
                      ? "bg-[#F1F5F9] text-[#0F172A]"
                      : "text-[#475569] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {selected.size > 0 && (
                <>
                  <span className="text-[#475569] tabular-nums">
                    {selected.size} selected
                  </span>
                  <button
                    onClick={() => {
                      selected.forEach((id) => onReindex(id));
                      toast.success(`Reindex queued for ${selected.size} items`);
                      setSelected(new Set());
                    }}
                    className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-2.5 py-1 inline-flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Reindex
                  </button>
                </>
              )}
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
              <tr>
                <th className="w-10 pl-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelected(new Set(visibleDocs.map((d) => d.id)));
                      else setSelected(new Set());
                    }}
                    className="accent-[#2563EB]"
                  />
                </th>
                <SortableTh
                  label="File name"
                  active={sort.key === "title"}
                  dir={sort.dir}
                  onClick={() => toggleSort("title")}
                />
                <SortableTh
                  label="Status"
                  active={sort.key === "status"}
                  dir={sort.dir}
                  onClick={() => toggleSort("status")}
                />
                <SortableTh
                  label="Updated"
                  active={sort.key === "updated"}
                  dir={sort.dir}
                  onClick={() => toggleSort("updated")}
                />
                <th className="text-left px-6 py-3">AI Status</th>
                <th className="text-right pr-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#EEF2F6] last:border-0">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-3 w-2/3 bg-[#E2E8F0] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : visibleDocs.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-[#94A3B8]">
                      No documents match your filters.
                    </td>
                  </tr>
                )
                : visibleDocs.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-[#EEF2F6] last:border-0 hover:bg-[#F8FAFC] cursor-pointer group transition-colors"
                      onClick={() => onOpenDrawer(d)}
                    >
                      <td className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(d.id)}
                          onChange={(e) => {
                            const next = new Set(selected);
                            if (e.target.checked) next.add(d.id);
                            else next.delete(d.id);
                            setSelected(next);
                          }}
                          className="accent-[#2563EB]"
                        />
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-[#0F172A] tabular-nums">{d.id}</div>
                        <div className="text-[#94A3B8] tabular-nums">
                          {d.title} · {d.sizeKb} KB
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusPill status={d.status} />
                      </td>
                      <td className="px-6 py-3.5 text-[#475569] tabular-nums">
                        {d.updated}
                      </td>
                      <td className="px-6 py-3.5 text-[#475569]">
                        Indexed for AI responses
                      </td>
                      <td
                        className="px-6 py-3.5 pr-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onView(d)}
                            className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-2.5 py-1 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              onReindex(d.id);
                              toast.success("Reindex queued", { description: d.id });
                            }}
                            className="border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md px-2.5 py-1 inline-flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw size={12} />
                            Reindex
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortableTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="text-left px-6 py-3">
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 ${
          active ? "text-[#0F172A]" : "text-[#475569]"
        } hover:text-[#0F172A] transition-colors`}
      >
        {label}
        <ArrowUpDown
          size={12}
          className={active ? (dir === "asc" ? "rotate-180" : "") : "opacity-50"}
        />
      </button>
    </th>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-[#E2E8F0] rounded-xl bg-white p-4">
      <div className="flex items-center gap-1.5 text-[#475569] mb-2">
        <span style={{ color: tone }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-[#0F172A] tabular-nums" style={{ fontSize: 22 }}>
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Doc["status"] }) {
  const map = {
    indexed: { label: "Indexed", color: "#16A34A", bg: "#F0FDF4" },
    pending: { label: "Pending", color: "#D97706", bg: "#FFFBEB" },
    failed: { label: "Failed", color: "#DC2626", bg: "#FEF2F2" },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}
