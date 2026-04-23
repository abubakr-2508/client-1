export function BrandLogo({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const markSize = size === "sm" ? "h-6 w-6 rounded-[8px]" : "h-8 w-8 rounded-[10px]";
  const documentBox =
    size === "sm"
      ? "left-[6px] top-[4px] h-[13px] w-[10px] rounded-[2px]"
      : "left-[8px] top-[6px] h-[16px] w-[12px] rounded-[3px]";
  const fold =
    size === "sm"
      ? "right-[6px] top-[4px] h-[4px] w-[4px]"
      : "right-[8px] top-[6px] h-[5px] w-[5px]";
  const lineOne =
    size === "sm"
      ? "left-[8px] top-[8px] w-[6px]"
      : "left-[10px] top-[11px] w-[8px]";
  const lineTwo =
    size === "sm"
      ? "left-[8px] top-[11px] w-[5px]"
      : "left-[10px] top-[15px] w-[6px]";
  const wordmark = size === "sm" ? 18 : 21;

  return (
    <div className="inline-flex items-center gap-3">
      <div className={`relative border border-[#1849A9] bg-[#2563EB] ${markSize}`}>
        <span
          className={`absolute border border-white/90 bg-transparent ${documentBox}`}
        />
        <span
          className={`absolute border-t border-r border-white/90 bg-[#2563EB] ${fold}`}
        />
        <span className={`absolute h-px bg-white/90 ${lineOne}`} />
        <span className={`absolute h-px bg-white/80 ${lineTwo}`} />
      </div>
      <span
        className="text-[#0F172A] tracking-[-0.03em]"
        style={{ fontSize: wordmark, fontWeight: 600, lineHeight: 1 }}
      >
        rag.cx
      </span>
    </div>
  );
}
