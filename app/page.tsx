"use client";
import { useState } from "react";
import { ArrowRight, Shield, Wallet, Globe2, Rocket, Gift, Repeat, CheckCircle2 } from "lucide-react";

// Light‑mode only landing page for Back
// USP: Accept crypto from any chain/token, settle to USDC on Base.
// Hero includes a single input for wallet/ENS/Base name/Warpcast username to claim a page.

export default function BackLanding() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState<string | null>(null);

  const onClaim = async () => {
    if (!handle.trim()) return;
    setLoading(true);
    // Fake async claim; replace with your API call
    await new Promise((r) => setTimeout(r, 800));
    setClaimed(handle.trim());
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0f172a] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-black text-white grid place-items-center font-bold">B</div>
            <span className="font-semibold tracking-tight">Back</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#claim" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90">
              Claim your page <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="claim" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium border border-emerald-200">
              Free forever • Settle to USDC on Base
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              Back the builders —
              <span className="block">Seamlessly. Anywhere.</span>
            </h1>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Claim a personal Back page in seconds. Supporters can send <b>any token on any chain</b>,
              you receive <b>USDC on Base</b>. Clean UX and gas‑efficient.
            </p>

            {/* Claim form */}
            <div className="mt-6 w-full max-w-xl">
              <label className="text-sm text-slate-700">Wallet / ENS / Base name / Warpcast username</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="vitalik.eth, imduchuyyy.base.eth, @huyduc, 0xabc..."
                  className="flex-1 h-12 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-slate-300"
                />
                <button
                  onClick={onClaim}
                  disabled={loading || !handle.trim()}
                  className="h-12 whitespace-nowrap rounded-2xl bg-black text-white px-5 text-[15px] font-medium inline-flex items-center gap-2 disabled:opacity-40"
                >
                  {loading ? "Claiming…" : "Claim"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {claimed && (
                <p className="mt-2 text-sm text-emerald-700">
                  <CheckCircle2 className="inline h-4 w-4 mr-1"/>
                  Page reserved for <span className="font-medium">{claimed}</span>. Next: connect wallet & publish.
                </p>
              )}
              <p className="mt-3 text-xs text-slate-500">
                By claiming, you agree to our Terms & Privacy. No KYC for tips. Your handle can be linked later.
              </p>
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="rounded-3xl border border-black/5 bg-white shadow-sm p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Example Page</div>
                  <div className="font-semibold">back.my/@huyduc</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-600">Live Preview</div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-black text-white grid place-items-center font-bold">HD</div>
                  <div>
                    <div className="font-semibold">Huy Đức</div>
                    <div className="text-xs text-slate-500">Crypto builder • Base</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
                    <div className="font-semibold">Any Chain</div>
                    <div className="text-xs text-slate-500">EVM / More</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
                    <div className="font-semibold">Any Token</div>
                    <div className="text-xs text-slate-500">ETH, USDC, …</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
                    <div className="font-semibold">Settle</div>
                    <div className="text-xs text-slate-500">USDC on Base</div>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-xl bg-black text-white h-11 flex items-center justify-center gap-2">
                  <Gift className="h-4 w-4"/> Donate
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Donors can tip from any EVM chain & token; we auto‑route, swap/bridge if needed, and you receive USDC on Base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Self‑custodial</div>
          <div className="flex items-center gap-2"><Globe2 className="h-4 w-4"/> Any chain/token</div>
          <div className="flex items-center gap-2"><Rocket className="h-4 w-4"/> 2‑minute setup</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-6">
          <Feature
            title="One input, zero friction"
            desc="Claim with wallet, ENS, Base name, or Warpcast @username. No forms, no waitlist."
          />
          <Feature
            title="Accept from anywhere"
            desc="Supporters can use any EVM chain and token. We route, swap, and bridge under the hood."
          />
          <Feature
            title="Settle to USDC on Base"
            desc="You always receive funds in USDC on Base for predictable accounting and low fees."
          />
          <Feature
            title="Creator‑first economics"
            desc="Claiming is free forever. Fees apply only to routing (swap/bridge) when donors need it."
          />
          <Feature
            title="Embed & share"
            desc="Add your Back page to bios, blogs, and profiles. Lightweight widget & API."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <Step no="1" title="Claim" text="Enter your wallet/ENS/Base/Warpcast and reserve your Back handle." />
            <Step no="2" title="Connect" text="Link wallet, set display name & socials, publish your page." />
            <Step no="3" title="Receive" text="Fans tip from any chain/token. We route & convert automatically." />
            <Step no="4" title="Settle" text="You receive USDC on Base. Track activity, export for accounting." />
          </div>

          <div className="mt-10 rounded-3xl border border-black/5 bg-slate-50 p-6">
            <div className="flex items-start gap-3 text-slate-700">
              <Repeat className="h-5 w-5 mt-0.5" />
              <p className="text-sm">
                Under the hood: intent router → (optional) swap/bridge → receive → consolidate to your USDC on Base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <FaqQ q="Is claiming really free forever?" a="Yes. Back pages are free to claim and keep. We only take a small routing fee when donors require swap/bridge." />
            <FaqQ q="Which chains and tokens are supported?" a="All major EVM chains and popular tokens. Non‑EVM is on the roadmap." />
            <FaqQ q="How do I get paid?" a="All donations settle to USDC on Base for low fees and clarity. Withdraw anytime from your dashboard." />
            <FaqQ q="Do donors need an account?" a="No account required. They can tip directly from their wallet or through our widget." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-black text-white grid place-items-center font-bold">B</div>
              <span className="font-semibold">Back</span>
            </div>
            <p className="mt-3 max-w-md">Back — built on Ethereum, lives on Base.</p>
          </div>
          <div className="md:text-right grid gap-2 content-center">
            <a href="#claim" className="inline-flex items-center gap-2 justify-self-end rounded-xl bg-black text-white px-4 py-2">
              Claim your page <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Back. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl bg-white border border-black/5 p-6 shadow-sm">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ no, title, text }: { no: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5">
      <div className="h-8 w-8 rounded-full bg-black text-white grid place-items-center text-sm font-semibold">{no}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{text}</div>
    </div>
  );
}

function FaqQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-black/5 bg-white">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between">
        <span className="font-medium">{q}</span>
        <ArrowRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 -mt-2 text-sm text-slate-600">{a}</div>}
    </div>
  );
}