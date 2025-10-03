"use client";
import React, { useMemo, useState } from "react";

// Single-file, drop-in landing page component for Next.js + Tailwind.
// No external UI libs or animations (per your previous preferences).
// Replace handlers (onClaim, onSearch) with your real logic.

export default function BackMyBuildLanding() {
  const [handle, setHandle] = useState("");
  const [focused, setFocused] = useState(false);
  const isValid = useMemo(() => handle.trim().length >= 2, [handle]);

  const onClaim = () => {
    // TODO: route to your claim flow, e.g. /claim?query=
    if (!isValid) return;
    window.location.href = `/claim?query=${encodeURIComponent(handle.trim())}`;
  };

  const suggestionPills = [
    "imduchuyyy.eth",
    "jesse.base.eth",
    "@imduchuyyy",
    "0x4fff...a62f",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* bg flair */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl opacity-40 bg-gradient-to-r from-sky-200 via-cyan-100 to-indigo-200" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:pt-28">
          <div className="flex flex-col items-center text-center gap-6">
            <Badge>Live on Base</Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Claim a beautiful onchain profile in seconds
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-gray-600">
              BackMyBuild lets anyone create a lightweight, link-in-bio style page
              that receives tips in any token from any chain—auto‑settled to USDC on Base.
            </p>

            {/* Claim input */}
            <div className={`w-full max-w-2xl rounded-2xl border ${focused ? "border-gray-900 shadow-lg" : "border-gray-300 shadow-sm"} bg-white p-2 transition-shadow`}>
              <div className="flex items-center gap-2">
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Wallet / ENS / Base name / Warpcast @ / URL"
                  className="flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={onClaim}
                  disabled={!isValid}
                  className="rounded-xl bg-gray-900 px-4 py-3 text-white disabled:opacity-40"
                >
                  Get your page
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {suggestionPills.map((x) => (
                  <button
                    key={x}
                    onClick={() => setHandle(x)}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>

            {/* Social proof row (avatars or logos) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Works with</span>
              <LogoPill label="Farcaster" />
              <LogoPill label="ENS / Basenames" />
              <LogoPill label="USDC" />
              <LogoPill label="Ethereum" />
              <LogoPill label="Base" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature triptych */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Build your onchain identity"
            desc="Pick a memorable handle and unify your links, wallet, and socials in one place."
            imgAlt="Identity"
          />
          <FeatureCard
            title="Simplify tips & payouts"
            desc="Receive tips in any token on any chain—settled to Base automatically."
            imgAlt="Tips"
          />
          <FeatureCard
            title="Connect & collaborate"
            desc="Make it easy for supporters and other builders to discover and back you."
            imgAlt="Connect"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          <StepCard step={1} title="Claim" desc="Enter any address, ENS / basename, or @handle to spin up your page." />
          <StepCard step={2} title="Share" desc="Drop your link anywhere—your page fetches onchain + social data automatically." />
          <StepCard step={3} title="Get backed" desc="Fans tip in their preferred tokens; you receive on Base, clean and simple." />
        </ol>
      </section>

      {/* Promo / CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">Free forever to claim</h3>
              <p className="text-gray-600">Custom themes and cross‑chain swaps coming soon.</p>
            </div>
            <div className="flex gap-3">
              <a href="#faq" className="rounded-xl border border-gray-300 px-4 py-3 text-sm">Read FAQ</a>
              <button onClick={onClaim} disabled={!isValid} className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-40">Get your page</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-gray-200 bg-gray-50/60 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">FAQs</h2>
          <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            <FaqItem q="What is BackMyBuild?" a="A link‑in‑bio style profile for builders and creators to receive onchain tips. No setup, just paste a handle and go." />
            <FaqItem q="Which tokens/chains can supporters use?" a="Any token on any supported chain; we swap/bridge to settle on Base behind the scenes so you receive cleanly." />
            <FaqItem q="Is claiming a page free?" a="Yes. Claiming is free. We may charge small service fees only when a swap/bridge is required for a tip." />
            <FaqItem q="Do I need ENS or a Basename?" a="No, but they help. You can claim with an address, ENS/basename, Farcaster username, or standard URL." />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gray-900" />
            <span className="text-sm font-semibold">BackMyBuild</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-gray-600 sm:flex">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
            <a href="https://backmybuild.com" className="rounded-xl bg-gray-900 px-4 py-2 text-white">Launch app</a>
          </nav>
          <a href="https://backmybuild.com" className="sm:hidden rounded-xl bg-gray-900 px-3 py-2 text-white text-sm">Launch</a>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </span>
  );
}

function LogoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">{label}</span>
  );
}

function FeatureCard({ title, desc, imgAlt }: { title: string; desc: string; imgAlt: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6">
      <div className="mb-4 h-40 w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50" aria-label={imgAlt} />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold">{step}</span>
      <h4 className="mt-3 text-base font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details open={open} onToggle={() => setOpen(!open)} className="group p-5">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <span className="text-base font-medium text-gray-900">{q}</span>
        <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-600 group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="mt-3 text-sm leading-6 text-gray-600">{a}</p>
    </details>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BackMyBuild. Built by builders for builders.</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-gray-900" href="https://x.com/">Twitter</a>
            <a className="hover:text-gray-900" href="https://warpcast.com/">Farcaster</a>
            <a className="hover:text-gray-900" href="mailto:hello@backmybuild.com">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
