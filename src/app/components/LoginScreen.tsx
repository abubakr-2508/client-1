import { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const editorialSerif =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("operator@rag.cx");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const canSubmit = emailValid && password.length >= 1 && !loading;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    setTimeout(() => onLogin(), 600);
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F8FAFC] text-[#0F172A] flex">
      <aside className="hidden lg:flex w-[45%] border-r border-[#D9E2EC] bg-[#EEF3F9] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(#DCE6F0 1px, transparent 1px), linear-gradient(90deg, #DCE6F0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-y-0 right-0 w-px bg-[#D9E2EC]" />
        <div className="absolute right-12 top-16 h-[320px] w-[320px] rounded-full border border-[#DCE5EF] bg-white/15" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 xl:p-10">
          <BrandLogo />

          <div className="flex-1 flex flex-col justify-center pl-8 xl:pl-12">
            <div className="max-w-[620px]">
              <h1
                className="text-[#0F172A] tracking-[-0.05em] leading-[0.94] max-w-[560px]"
                style={{
                  fontFamily: editorialSerif,
                  fontSize: 86,
                  fontWeight: 700,
                }}
              >
                RAG.CX
              </h1>

              <div
                className="text-[#0F172A] mt-3 max-w-[520px]"
                style={{ fontSize: 26, lineHeight: 1.2 }}
              >
                RAG for Customer Experience
              </div>

              <p
                className="text-[#475569] mt-4 max-w-[470px]"
                style={{ fontSize: 18, lineHeight: 1.6 }}
              >
                Reliable answers for process-driven teams.
              </p>
            </div>

            <div className="mt-9 max-w-[540px] space-y-5">
              <ValueRow title="Documents unified" />
              <ValueRow title="Knowledge kept current" />
              <ValueRow title="Operations made clearer" />
            </div>
          </div>

          <div className="max-w-[760px] pt-5 border-t border-[#D5DFEA]">
            <div className="flex items-center gap-4 text-[#94A3B8]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} /> SOC 2 Type II
              </span>
              <span className="h-3 w-px bg-[#D5DFEA]" />
              <span>GDPR ready</span>
              <span className="h-3 w-px bg-[#D5DFEA]" />
              <span>SSO and SAML</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-white overflow-hidden">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-8">
            <BrandLogo />
          </div>

          <h2 className="text-[#0F172A] mb-1" style={{ fontSize: 22 }}>
            Sign in to your workspace
          </h2>
          <p className="text-[#475569] mb-7">
            Use your work email or continue with SSO.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <SSOButton
              label="Google"
              icon={
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                  <path
                    fill="#4285F4"
                    d="M21.6 12.22c0-.68-.06-1.34-.17-1.97H12v3.73h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.28z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96l3.34-2.58z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.88c1.47 0 2.79.5 3.83 1.5l2.87-2.87A10 10 0 0 0 3.06 7.52L6.4 10.1C7.19 7.74 9.4 5.88 12 5.88z"
                  />
                </svg>
              }
            />
            <SSOButton
              label="Microsoft"
              icon={
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                  <rect x="2" y="2" width="9" height="9" fill="#F25022" />
                  <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
                  <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
                  <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
                </svg>
              }
            />
            <SSOButton label="Okta" icon={<span className="text-[#0F172A]">O</span>} />
          </div>

          <div className="relative my-5">
            <div className="h-px bg-[#E2E8F0]" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-[#94A3B8]">
                or continue with email
              </span>
            </span>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <Field
              label="Work email"
              error={email.length > 0 && !emailValid ? "Enter a valid email" : ""}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white border border-[#E2E8F0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-colors"
                aria-invalid={email.length > 0 && !emailValid}
              />
            </Field>

            <Field
              label="Password"
              trailing={
                <a
                  href="#"
                  className="text-[#2563EB] hover:text-[#1D4ED8]"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot?
                </a>
              }
            >
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  className="w-full bg-white border border-[#E2E8F0] rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-1"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#2563EB]"
              />
              Remember this device for 30 days
            </label>

            {error && (
              <div className="text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md py-2.5 transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-1.5 text-[#94A3B8]">
            <Lock size={11} />
            Secured with enterprise-grade encryption.
          </div>
        </div>

        <footer className="mt-10 text-[#94A3B8] flex items-center gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#475569]">
            Terms
          </a>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#475569]">
            Privacy
          </a>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <span>(c) 2026 rag.cx</span>
        </footer>
      </main>
    </div>
  );
}

function Field({
  label,
  trailing,
  error,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#475569]">{label}</span>
        {trailing}
      </div>
      {children}
      {error && <div className="mt-1 text-[#DC2626]">{error}</div>}
    </label>
  );
}

function SSOButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] rounded-md py-2 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ValueRow({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D8E2EE] bg-white/75">
        <CheckCircle2 size={13} className="text-[#2563EB]" />
      </span>
      <div className="text-[#0F172A]" style={{ fontSize: 18, lineHeight: 1.45 }}>
        {title}
      </div>
    </div>
  );
}
