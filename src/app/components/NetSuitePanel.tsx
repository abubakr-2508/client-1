import { useState } from "react";
import { X, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function NetSuitePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [syncedAgo, setSyncedAgo] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setSyncedAgo(0);
      setRefreshing(false);
      toast.success("NetSuite data refreshed");
    }, 700);
  }

  function copy(v: string, label: string) {
    navigator.clipboard.writeText(v);
    toast.success("Copied", { description: label });
  }

  return (
    <aside
      className={`fixed top-14 right-0 bottom-0 w-[380px] bg-white border-l border-[#E2E8F0] z-40 transition-transform duration-200 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-5 py-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#F1F5F9] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>
              <span className="text-[#0F172A]">NetSuite Data</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#475569] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F1F5F9]"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">
              Data retrieved from NetSuite · synced {syncedAgo}m ago
            </span>
            <button
              onClick={refresh}
              className="text-[#475569] hover:text-[#0F172A] p-1 rounded-md hover:bg-[#F1F5F9] transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <Card title="Invoice status">
            <Row
              label="Invoice #"
              value="INV-20461"
              copyable
              onCopy={(v) => copy(v, "Invoice number")}
            />
            <Row label="Status" value={<span className="text-[#16A34A]">Approved</span>} />
            <Row label="Amount" value={<span className="tabular-nums">$24,830.00</span>} />
            <Row label="Posted" value={<span className="tabular-nums">2026-04-21</span>} />
          </Card>

          <Card title="Approval chain">
            <Step name="Operations" status="Submitted" time="09:02" done />
            <Step name="Manager" status="Approved" time="10:18" done />
            <Step name="Finance" status="Approved" time="14:44" done />
            <Step name="Senior Mgmt" status="Not required" />
          </Card>

          <Card title="Vendor details">
            <Row label="Vendor" value="Acme Logistics Ltd." />
            <Row
              label="Vendor ID"
              value="V-0094"
              copyable
              onCopy={(v) => copy(v, "Vendor ID")}
            />
            <Row label="Compliance" value={<span className="text-[#16A34A]">Verified</span>} />
            <Row label="Onboarded" value={<span className="tabular-nums">2025-11-02</span>} />
          </Card>

          <button className="w-full border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md py-2 inline-flex items-center justify-center gap-1.5 transition-colors">
            <ExternalLink size={13} />
            View in NetSuite
          </button>
        </div>
      </div>
    </aside>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#E2E8F0] rounded-xl bg-white">
      <div className="px-4 py-2.5 border-b border-[#EEF2F6] text-[#0F172A]">{title}</div>
      <div className="p-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  onCopy?: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 group">
      <span className="text-[#475569]">{label}</span>
      <span className="text-[#0F172A] inline-flex items-center gap-1.5">
        {value}
        {copyable && typeof value === "string" && (
          <button
            onClick={() => onCopy?.(value)}
            className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#0F172A] transition-opacity"
            aria-label="Copy"
          >
            <Copy size={11} />
          </button>
        )}
      </span>
    </div>
  );
}

function Step({
  name,
  status,
  time,
  done,
}: {
  name: string;
  status: string;
  time?: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${done ? "bg-[#16A34A]" : "bg-[#94A3B8]"}`}
        />
        <span className="text-[#0F172A]">{name}</span>
      </div>
      <div className="flex items-center gap-2 text-[#475569]">
        <span>{status}</span>
        {time && <span className="text-[#94A3B8] tabular-nums">· {time}</span>}
      </div>
    </div>
  );
}
