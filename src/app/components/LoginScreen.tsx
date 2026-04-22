import { useMemo, useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock, ArrowRight, Sparkles } from "lucide-react";

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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Left brand panel */}
      <aside className="hidden lg:flex w-[46%] border-r border-[#DBE4F1] bg-[#EDF2FA] relative flex-col justify-between p-12 text-[#0F172A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#2563EB]" />
          <span className="text-[#0F172A]">rag.cx</span>
        </div>

        <div className="max-w-[480px]">
          <div className="inline-flex items-center gap-1.5 text-[#475569] border border-[#DBE4F1] bg-white/70 rounded-full px-2.5 py-1 mb-6">
            <Sparkles size={12} className="text-[#2563EB]" />
            AI-powered process assistant
          </div>

          <h1
            className="text-[#0F172A] leading-none mb-3 tracking-tight"
            style={{ fontSize: 88, fontWeight: 700 }}
          >
            RAG.CX
          </h1>
          <p className="text-[#334155] mb-8" style={{ fontSize: 20 }}>
            RAG for Customer Experience
          </p>

          <p className="text-[#64748B] mb-8 max-w-[440px]">
            rag.cx connects your documents, knowledge base, and NetSuite data into a
            single assistant your team can trust.
          </p>

          <ul className="space-y-3">
            <Bullet>Answers cited to the exact page of every document</Bullet>
            <Bullet>Live NetSuite status, approvals, and vendor lookups</Bullet>
            <Bullet>Editable knowledge base that updates answers instantly</Bullet>
          </ul>
        </div>

        <div className="flex items-center gap-4 text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} /> SOC 2 Type II
          </span>
          <span className="h-3 w-px bg-[#DBE4F1]" />
          <span>GDPR ready</span>
          <span className="h-3 w-px bg-[#DBE4F1]" />
          <span>SSO · SAML</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded bg-[#2563EB]" />
            <span className="text-[#0F172A]">rag.cx</span>
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
              <span className="bg-[#F8FAFC] px-3 text-[#94A3B8]">
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
                  placeholder="••••••••"
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
                  Signing in…
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

        <footer className="mt-12 text-[#94A3B8] flex items-center gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#475569]">
            Terms
          </a>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#475569]">
            Privacy
          </a>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <span>© 2026 rag.cx</span>
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[#0F172A]">
      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
      <span>{children}</span>
    </li>
  );
}
