import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import type { Citation, Doc } from "./types";

export function CitationChip({
  citation,
  doc,
  onOpen,
}: {
  citation: Citation;
  doc?: Doc;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const section = doc?.sections[Math.min(citation.page - 1, (doc?.sections.length ?? 1) - 1)];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onOpen}
        className="group inline-flex items-center gap-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-md px-2 py-1 transition-colors"
      >
        <FileText size={12} className="text-[#475569]" />
        <span className="tabular-nums">{citation.file}</span>
        <span className="text-[#475569] tabular-nums">· p.{citation.page}</span>
      </button>

      {hover && doc && (
        <div className="absolute bottom-full left-0 mb-2 w-[340px] z-30 animate-[fadeIn_120ms_ease-out]">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 pointer-events-none">
            <div className="flex items-start justify-between mb-2 gap-3">
              <div className="min-w-0">
                <div className="text-[#0F172A] truncate">{doc.title}</div>
                <div className="text-[#94A3B8] tabular-nums">
                  {doc.id} · Page {citation.page} of {doc.pages}
                </div>
              </div>
              <ExternalLink size={14} className="text-[#94A3B8] shrink-0" />
            </div>
            {section && (
              <div className="border-t border-[#EEF2F6] pt-3">
                <div className="text-[#475569] mb-1.5">{section.heading}</div>
                <div className="text-[#0F172A] line-clamp-3">
                  {section.body[0]}
                </div>
              </div>
            )}
            <div className="mt-3 text-[#94A3B8]">Click to open full document</div>
          </div>
        </div>
      )}
    </div>
  );
}
