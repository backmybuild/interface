"use client"

export type Tip = {
  fromName: string;
  message?: string;
  amountUsd?: number; // display in USD for simplicity
  txHash: string;
  chainExplorer?: string; // e.g., https://basescan.org/tx/
};

export type Profile = {
  avatar: string | null;
  fullName: string;
  address: string; // used to build default link if needed
  backLink: string; // e.g. https://backmybuild.com/imduchuyyy
};

// Simple helpers
const formatUsd = (n?: number) =>
  typeof n === "number" ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—";

const shorten = (s: string, left = 6, right = 4) =>
  s.length > left + right + 3 ? `${s.slice(0, left)}…${s.slice(-right)}` : s;

const CopyButton = ({ text, label = "Copy link" }: { text: string; label?: string }) => {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      alert("Copied!");
    }
  };
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
      aria-label={label}
      title={label}
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      {label}
    </button>
  );
};

const ShareButton = ({ url, text = "Check my BackMyBuild!" }: { url: string; text?: string }) => {
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "BackMyBuild", text, url });
      } catch {}
    } else {
      // fallback: copy
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };
  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
      Share
    </button>
  );
};

export default function BackDashboard({
  profile = {
    avatar: null,
    fullName: "Anonymous Builder",
    address: "0x0000000000000000000000000000000000000000",
    backLink: "https://backmybuild.com/anon",
  },
  tips = [],
}: {
  profile?: Profile;
  tips?: Tip[];
}) {
  const explorer = (t: Tip) =>
    t.chainExplorer ? `${t.chainExplorer.replace(/\/$/, "")}/${t.txHash}` : `https://basescan.org/tx/${t.txHash}`;

  return (
    <main className="min-h-svh bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header / Profile Card */}
        <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  profile.avatar ||
                  "https://www.gravatar.com/avatar/?s=200&d=identicon"
                }
                alt={`${profile.fullName} avatar`}
                className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{profile.fullName}</h1>
                <a
                  href={profile.backLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-blue-600 hover:underline break-all"
                >
                  {profile.backLink}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CopyButton text={profile.backLink} />
              <ShareButton url={profile.backLink} />
            </div>
          </div>
        </section>

        {/* Recent Tips */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent tips</h2>
          </div>

          {tips.length === 0 ? (
            <div className="text-sm text-gray-500">No tips yet. Share your link to get your first tip ✨</div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Message</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {tips.map((t, i) => (
                    <tr key={t.txHash + i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{t.fromName || "Anonymous"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[32ch] truncate" title={t.message}>{t.message || "—"}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatUsd(t.amountUsd)}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        <a
                          href={explorer(t)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50"
                        >
                          <span className="font-mono">{shorten(t.txHash)}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Example: developer notes */}
        <details className="mt-6 text-sm text-gray-500">
          <summary className="cursor-pointer select-none">Integration notes</summary>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Pass <code>profile</code> and <code>tips</code> props from your data layer (e.g., Wagmi + your API).</li>
            <li>Set <code>chainExplorer</code> per tip if not on Base; defaults to BaseScan.</li>
            <li>Replace <code>alert()</code> with your toast system.</li>
            <li>Wrap this component in your Next.js page (e.g., <code>app/(dashboard)/page.tsx</code>).</li>
          </ul>
        </details>
      </div>
    </main>
  );
}
