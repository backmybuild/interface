"use client";
import Link from "next/link";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Address, formatUnits, getAddress } from "viem";
import {
  arbitrum,
  base,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
  zksync,
} from "viem/chains";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { SocialIcon } from "@components/ui/social-icon";
import { getUserInfo, UserInfo } from "./get-user-info";
import { userInfo } from "os";

/** ---------- Types ---------- */
type Token = {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  logoURI: string;
  chainId: number;
  balance: string;        // raw (wei)
  balanceInUsd?: string;  // human ($)
};

/** ---------- Consts ---------- */
const BUNGEE_API_BASE_URL = "https://public-backend.bungee.exchange";
const USDC_BASE: Address = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

const CHAIN_BADGE: Record<number, { label: string; bg: string }> = {
  [mainnet.id]: { label: "ETH", bg: "bg-blue-600" },
  [base.id]: { label: "BASE", bg: "bg-sky-600" },
  [bsc.id]: { label: "BSC", bg: "bg-green-600" },
  [polygon.id]: { label: "POLY", bg: "bg-purple-600" },
  [optimism.id]: { label: "OP", bg: "bg-red-600" },
  [arbitrum.id]: { label: "ARB", bg: "bg-indigo-600" },
  [zksync.id]: { label: "ZKS", bg: "bg-blue-800" },
  [linea.id]: { label: "LINEA", bg: "bg-gray-800" },
  [scroll.id]: { label: "SCROLL", bg: "bg-gray-700" },
};

/** ---------- UI helpers ---------- */
const ChainBadge = ({ chainId }: { chainId: number }) => {
  const meta = CHAIN_BADGE[chainId] ?? { label: "L1", bg: "bg-gray-500" };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white ${meta.bg}`}
      aria-label={`Chain ${meta.label}`}
      title={meta.label}
    >
      {meta.label}
    </span>
  );
};

const formatDecimal = (v: string, max = 6) => {
  if (!v) return "";
  const cleaned = v.replace(/[^0-9.]/g, "");
  const [head, ...rest] = cleaned.split(".");
  const dec = rest.join("");
  return dec ? `${head}.${dec.slice(0, max)}` : head;
};

const formatUint = (
  raw: string | number | bigint,
  decimals: number,
  max = 6
) => {
  try {
    const asBigInt =
      typeof raw === "bigint"
        ? raw
        : BigInt(typeof raw === "number" ? Math.trunc(raw).toString() : String(raw));
    const human = formatUnits(asBigInt, decimals);
    return formatDecimal(human, max);
  } catch {
    return typeof raw === "string" ? formatDecimal(raw, max) : String(raw);
  }
};

const fmtUSD = (usd?: string) => {
  if (!usd) return "";
  const n = Number(usd);
  if (Number.isNaN(n)) return "";
  return n >= 1000
    ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const formatAddress = (addr: string) => addr.slice(0, 6) + "…" + addr.slice(-4);

/** ---------- Component ---------- */
export const DonationInfo: NextPage = () => {
  const params = useParams();
  const identify = params.identify as string;

  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserInfo | null>(null);

  const [amount, setAmount] = useState("15");
  const [senderName, setSenderName] = useState("");
  const [note, setNote] = useState("");
  const NOTE_MAX = 280;

  // tokens + selection
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Main "Tip" modal state
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipMethod, setTipMethod] = useState<"card" | "crypto">("crypto");

  // Inside Crypto tab: show/hide token list
  const [showTokenList, setShowTokenList] = useState(false);

  const amt = useMemo(() => (amount ? Number(amount) : NaN), [amount]);
  const isValid = !Number.isNaN(amt) && amt > 0;

  // Derive token amount from USD target (display only; you will wire execution)
  const sendAmount = useMemo(() => {
    if (!selectedToken) return 0;
    if (Number.isNaN(amt) || amt <= 0) return 0;

    const balNum = Number(formatUnits(BigInt(selectedToken.balance), selectedToken.decimals));
    const balUsdNum = Number(selectedToken.balanceInUsd ?? "0");
    if (!balNum || !balUsdNum) return 0;

    const pricePerToken = balUsdNum / balNum;
    if (pricePerToken <= 0) return 0;

    return amt / pricePerToken; // float tokens needed
  }, [amt, selectedToken]);

  /** ------- Data fetching (profile + donor balances) ------ */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = await getUserInfo(identify);
        setProfile(userInfo);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (identify) fetchProfile();
  }, [identify]);

  const fetchDonorTokenBalances = async (donorAddress: Address) => {
    // Keep your existing Bungee list call, purely for UI population
    const url = `${BUNGEE_API_BASE_URL}/api/v1/tokens/list`;
    const params = {
      userAddress: donorAddress,
      // cover many chains; you can fine-tune
      chainIds: [
        mainnet.id,
        base.id,
        bsc.id,
        polygon.id,
        optimism.id,
        arbitrum.id,
        zksync.id,
        linea.id,
        scroll.id,
      ].join(","),
    };

    const queryParams = new URLSearchParams(params as any);
    const response = await fetch(`${url}?${queryParams}`);
    const data = await response.json();

    if (!data?.success) return;

    const tokenList: Token[] = [];
    for (const tokenByChain of Object.values<any>(data.result)) {
      for (const token of tokenByChain as any[]) {
        if (token.balanceInUsd > 0) {
          tokenList.push(token);
        }
      }
    }

    tokenList.sort((a, b) => (Number(b.balanceInUsd ?? 0) - Number(a.balanceInUsd ?? 0)));
    setTokens(tokenList);

    // Optionally preselect top token
    if (!selectedToken && tokenList.length > 0) {
      setSelectedToken(tokenList[0]);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchDonorTokenBalances(address as Address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  /** ------- UI-only handlers (you wire the real actions) ------ */
  const handleOpenTip = () => setIsTipModalOpen(true);
  const handleCloseTip = () => {
    setIsTipModalOpen(false);
    setTipMethod("crypto");
    setShowTokenList(false);
  };

  const handleSendWithCard = () => {
    // TODO: wire your card payment flow here
    // e.g. open card checkout, then close modal on success
    console.log("Pay with card:", { amount, senderName, note, identify });
  };

  const handleSendWithCrypto = () => {
    // TODO: wire your on-chain flow here (quote/build/tx/status)
    if (!selectedToken || !isValid) return;
    console.log("Pay with crypto:", {
      usdAmount: amount,
      token: selectedToken,
      tokenAmount: sendAmount,
      senderName,
      note,
      receiver: profile?.address ? getAddress(profile.address) : undefined,
      outputToken: USDC_BASE,
    });
  };

  /** ----------------- Skeleton & Layout ----------------- */
  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-gray-50 text-gray-700 flex items-center justify-center">
        <div>Loading profile...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen w-full bg-gray-50 text-gray-700 flex items-center justify-center">
        <div className="flex items-center">
          <span>Profile not found.</span>
          <Link className="ml-2 underline hover:opacity-80" href="/">
            Go back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-svh text-gray-900 grid place-items-center">
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg px-4 h-full flex items-center">
        <section className="w-full rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg text-center flex flex-col justify-center overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col items-center gap-5">
            <img
              src={
                profile.avatar ||
                "https://www.gravatar.com/avatar/[email_hash]?s=200&d=identicon"
              }
              alt={`${profile.displayName} avatar`}
              width={128}
              height={128}
              className="h-32 w-32 rounded-3xl object-cover ring-1 ring-gray-200"
            />
            <div>
              <h1 className="text-2xl font-semibold">
                <Link
                  href={`https://basescan.org/address/${profile.address}`}
                  target="_blank"
                  className="underline"
                >
                  {profile.displayName}
                </Link>
              </h1>
              <p className="text-base text-gray-600 mt-2">
                {profile.description}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-5 flex justify-center flex-wrap gap-4">
            {profile.socials?.map((s, i) => (
              <a
                key={i}
                href={s}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-3 hover:bg-gray-50"
              >
                <SocialIcon url={s} className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Amount + quick picks (kept outside; modal handles payment method + token) */}
          <div>
            <label htmlFor="amount" className="mb-2 block text-sm text-gray-700">
              Support {profile.displayName}
            </label>

            <div className="flex gap-2 mb-3">
              {[5, 15, 25].map((val) => {
                const selected = amount === val.toString();
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      selected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                    }`}
                    aria-pressed={selected}
                  >
                    ${val}
                  </button>
                );
              })}
              <div className="w-[110px]">
                <input
                  type="number"
                  id="amount"
                  inputMode="decimal"
                  placeholder="Custom"
                  value={amount}
                  onChange={(e) => setAmount(formatDecimal(e.target.value))}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 text-center"
                />
              </div>
            </div>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Sender info */}
            <div className="mt-4 text-left">
              <input
                id="senderName"
                type="text"
                placeholder="Your Name (optional)"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div className="mt-3 text-left">
              <textarea
                id="note"
                rows={3}
                placeholder="Say thanks, leave feedback, or a short note… (optional)"
                value={note}
                onChange={(e) => {
                  const v = e.target.value;
                  setNote(v.length <= NOTE_MAX ? v : v.slice(0, NOTE_MAX));
                }}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none"
              />
            </div>

            {/* Open Tip Modal */}
            <button
              type="button"
              onClick={handleOpenTip}
              className="mt-5 w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 px-4 py-3"
            >
              Tip {profile.displayName} {isValid ? `$${amount}` : ""}
            </button>
          </div>

          <div className="mt-2 text-center text-xs">
            <Link
              href="/dashboard"
              target="_blank"
              className="text-center text-xs underline decoration-dotted hover:opacity-80"
            >
              Open dashboard to create your own page
            </Link>
          </div>
        </section>
      </div>

      {/* ------- TIP MODAL (Card | Crypto) ------- */}
      {isTipModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tip"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCloseTip();
          }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseTip} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-200 p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Send a tip</h2>
              <button
                onClick={handleCloseTip}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Amount summary */}
            <div className="mb-3 text-sm text-gray-600">
              You’re tipping <span className="font-medium">{profile.displayName}</span> —{" "}
              <span className="font-semibold">${amount || "--"}</span>
            </div>

            {/* Tabs 
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipMethod("card")}
                className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                  tipMethod === "card"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                }`}
                aria-pressed={tipMethod === "card"}
              >
                Pay with card
              </button>
              <button
                type="button"
                onClick={() => setTipMethod("crypto")}
                className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                  tipMethod === "crypto"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                }`}
                aria-pressed={tipMethod === "crypto"}
              >
                Pay with crypto
              </button>
            </div>

            {tipMethod === "card" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Card number"
                  />
                  <input
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Name on card"
                  />
                  <input className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    placeholder="MM/YY"
                  />
                  <input
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    placeholder="CVC"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendWithCard}
                  disabled={!isValid}
                  className="w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-40 px-4 py-3"
                >
                  Pay ${amount} with card
                </button>
              </div>
            )}
            */}

            {/* ---- CRYPTO TAB ---- */}
            {tipMethod === "crypto" && (
              <div className="space-y-4">
                {/* Connect wallet */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Wallet</span>
                  {isConnected && address ? (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      {formatAddress(address)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Connect wallet
                    </button>
                  )}
                </div>

                {/* Token selector (inline list toggle) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTokenList((s) => !s)}
                    className="mb-2 w-full inline-flex items-center justify-between gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm hover:bg-gray-50"
                    aria-expanded={showTokenList}
                    aria-controls="token-list"
                  >
                    {selectedToken ? (
                      <div className="flex items-center gap-2">
                        <ChainBadge chainId={selectedToken.chainId} />
                        <img
                          src={selectedToken.logoURI}
                          alt={selectedToken.symbol}
                          className="h-5 w-5 rounded-sm"
                        />
                        <span className="font-medium">{selectedToken.symbol}</span>
                        <span className="text-gray-500">
                          • {formatUint(BigInt(selectedToken.balance), selectedToken.decimals)}
                        </span>
                        {selectedToken.balanceInUsd && (
                          <span className="text-gray-500">
                            ({fmtUSD(selectedToken.balanceInUsd)})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Select a token</span>
                    )}
                    <span aria-hidden>▾</span>
                  </button>

                  {showTokenList && (
                    <div
                      id="token-list"
                      className="max-h-72 overflow-y-auto rounded-2xl border border-gray-200"
                    >
                      <ul className="divide-y divide-gray-100">
                        {tokens.map((t) => (
                          <li key={t.symbol + t.address + t.chainId}>
                            <button
                              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left"
                              onClick={() => {
                                setSelectedToken(t);
                                setShowTokenList(false);
                              }}
                            >
                              <ChainBadge chainId={t.chainId} />
                              <img
                                src={t.logoURI}
                                alt={t.symbol}
                                className="h-7 w-7 rounded-sm"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                  {t.symbol} <span className="text-gray-500">• {t.name}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {t.address.slice(0, 6)}…{t.address.slice(-4)}
                                </div>
                              </div>
                              <div className="text-right leading-tight">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatUint(BigInt(t.balance), t.decimals)}
                                </div>
                                {t.balanceInUsd && (
                                  <div className="text-xs text-gray-500">{fmtUSD(t.balanceInUsd)}</div>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Summary + Send */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Tip amount</span>
                    <span className="font-semibold">${amount || "--"}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Paying in</span>
                    <span className="font-semibold">
                      {selectedToken
                        ? `${formatDecimal(sendAmount.toString(), 6)} ${selectedToken.symbol}`
                        : "--"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendWithCrypto}
                  disabled={!isValid || !selectedToken}
                  className="w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-40 px-4 py-3"
                >
                  {selectedToken ? `Send ${formatDecimal(sendAmount.toString(), 6)} ${selectedToken.symbol}` : "Select a token"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
