import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";

type Tab = "assistant" | "kb" | "admin";

export function TopNav({
  active,
  onChange,
  onLogout,
  onOpenPalette,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  onLogout: () => void;
  onOpenPalette: () => void;
}) {
  const tabs: { id: Tab; label: string; hint: string }[] = [
    { id: "assistant", label: "Assistant", hint: "⌘1" },
    { id: "kb", label: "Knowledge Base", hint: "⌘2" },
    { id: "admin", label: "Admin", hint: "⌘3" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  return (
    <header className="h-14 border-b border-[#E2E8F0] bg-white flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2563EB]" />
          <span className="text-[#0F172A]">rag.cx</span>
        </div>
        <span className="h-5 w-px bg-[#E2E8F0]" />
        <button className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0F172A] rounded-md px-2 py-1 hover:bg-[#F8FAFC] transition-colors">
          <span>Acme Ops</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <nav className="absolute left-1/2 -translate-x-1/2 h-full flex items-center gap-1">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative h-full flex items-center px-3 transition-colors ${
                isActive
                  ? "text-[#0F172A]"
                  : "text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              <span>{t.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#2563EB] rounded-t" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPalette}
          className="inline-flex items-center gap-2 border border-[#E2E8F0] hover:border-[#94A3B8] rounded-md pl-2 pr-1.5 py-1 text-[#475569] hover:text-[#0F172A] transition-colors"
        >
          <Search size={14} />
          <span>Search</span>
          <kbd className="border border-[#E2E8F0] rounded px-1 py-0.5 text-[#94A3B8] tabular-nums">
            ⌘K
          </kbd>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
              <span>P</span>
            </div>
            <ChevronDown size={14} className="text-[#94A3B8]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-xl py-1.5 z-40 animate-[fadeIn_100ms_ease-out]">
              <div className="px-3 py-2 border-b border-[#EEF2F6]">
                <div className="text-[#0F172A]">Priya N.</div>
                <div className="text-[#94A3B8]">operator@rag.cx</div>
              </div>
              <MenuItem icon={<UserRound size={14} />} label="Profile" />
              <MenuItem icon={<Settings size={14} />} label="Settings" />
              <div className="my-1 h-px bg-[#EEF2F6]" />
              <MenuItem
                icon={<LogOut size={14} />}
                label="Sign out"
                onClick={onLogout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
    >
      <span className="text-[#94A3B8]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export type { Tab };
