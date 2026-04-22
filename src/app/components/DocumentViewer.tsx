import { useEffect, useState } from "react";
import { X, Copy, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Doc } from "./types";

export function DocumentViewer({
  doc,
  page,
  mode,
  onClose,
  onOpenInKB,
}: {
  doc: Doc;
  page: number;
  mode: "chat" | "admin";
  onClose: () => void;
  onOpenInKB: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(page);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [doc.id, page]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight")
        setCurrentPage((p) => Math.min(doc.pages, p + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc.pages, onClose]);

  const highlightIndex =
    mode === "chat" ? Math.min(currentPage - 1, doc.sections.length - 1) : -1;

  function copyCitation() {
    const text = `${doc.id} · Page ${currentPage}`;
    navigator.clipboard.writeText(text);
    toast.success("Citation copied", { description: text });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0F172A]/30 animate-[fadeIn_120ms_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-[980px] flex flex-col animate-[slideUp_160ms_ease-out] overflow-hidden"
        style={{ height: "82vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] shrink-0">
          <div className="min-w-0">
            <div className="text-[#0F172A] truncate">{doc.title}</div>
            <div className="text-[#94A3B8] tabular-nums truncate">{doc.id}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCitation}
              className="inline-flex items-center gap-1.5 border border-[#E2E8F0] hover:border-[#94A3B8] text-[#475569] hover:text-[#0F172A] rounded-md px-2.5 py-1 transition-colors"
            >
              <Copy size={12} />
              Copy citation
            </button>
            <button
              onClick={onOpenInKB}
              className="inline-flex items-center gap-1.5 border border-[#E2E8F0] hover:border-[#94A3B8] text-[#475569] hover:text-[#0F172A] rounded-md px-2.5 py-1 transition-colors"
            >
              <BookOpen size={12} />
              Open in KB
            </button>
            <button
              onClick={onClose}
              className="ml-1 text-[#475569] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F1F5F9]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-header */}
        <div className="px-5 py-2.5 border-b border-[#EEF2F6] flex items-center justify-between shrink-0 bg-[#F8FAFC]">
          <div className="text-[#475569]">
            {mode === "chat"
              ? "Answer extracted from document"
              : "Full document preview"}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[#94A3B8] tabular-nums">
              Page {currentPage} of {doc.pages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(doc.pages, p + 1))}
              disabled={currentPage >= doc.pages}
              className="p-1 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* TOC */}
          <aside className="w-[220px] border-r border-[#E2E8F0] bg-[#F8FAFC] overflow-auto py-3 shrink-0">
            <div className="px-4 py-1 text-[#94A3B8]">Contents</div>
            <ul>
              {doc.sections.map((s, i) => {
                const active = i === highlightIndex;
                return (
                  <li key={s.heading}>
                    <button
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-full text-left px-4 py-1.5 transition-colors ${
                        active
                          ? "bg-white text-[#0F172A] border-l-2 border-[#2563EB] pl-[14px]"
                          : "text-[#475569] hover:bg-white hover:text-[#0F172A]"
                      }`}
                    >
                      {s.heading}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Content */}
          <div className="flex-1 overflow-auto px-10 py-8">
            {loading ? (
              <div className="space-y-3 max-w-[620px]">
                <div className="h-4 w-1/3 bg-[#E2E8F0] rounded animate-pulse" />
                <div className="h-3 w-full bg-[#E2E8F0] rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-[#E2E8F0] rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-[#E2E8F0] rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-6 max-w-[680px]">
                {doc.sections.map((s, i) => (
                  <section
                    key={s.heading}
                    className={`relative ${
                      i === highlightIndex ? "pl-4" : ""
                    }`}
                  >
                    {i === highlightIndex && (
                      <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded bg-[#2563EB]" />
                    )}
                    <h3 className="text-[#0F172A] mb-2">{s.heading}</h3>
                    <ul className="space-y-1.5">
                      {s.body.map((b, j) => (
                        <li key={j} className="text-[#475569]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
