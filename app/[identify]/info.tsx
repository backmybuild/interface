"use client";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Address, Chain, createPublicClient, erc20Abi, formatUnits, parseUnits, PublicClient, http, getAddress } from "viem";
import { SocialIcon } from "@components/ui/social-icon";
import { useAccount, useWriteContract, useSignTypedData, useSwitchChain, useSendTransaction } from "wagmi";
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
import { useAppKit } from "@reown/appkit/react";
import toast from "react-hot-toast";
import { getUserInfo, UserInfo } from "./get-user-info";

type Token = {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  logoURI: string;
  chainId: number;
  balance: string;
  balanceInUsd?: string;
};

const BUNGEE_API_BASE_URL = "https://public-backend.bungee.exchange";
const USDC_BASE: Address = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
const FEE_TAKER: Address = "0x4fff0f708c768a46050f9b96c46c265729d1a62f"

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

const CHAIN_CLIENT: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [bsc.id]: bsc,
  [polygon.id]: polygon,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [zksync.id]: zksync,
  [scroll.id]: scroll,
  [linea.id]: linea,
}

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

const formatUint = (
  raw: string | number | bigint,
  decimals: number,
  max = 6
) => {
  try {
    const asBigInt =
      typeof raw === "bigint"
        ? raw
        : BigInt(
          // raw can be number or numeric string; coerce cleanly
          typeof raw === "number" ? Math.trunc(raw).toString() : String(raw)
        );
    const human = formatUnits(asBigInt, decimals); // string like "12.3456789"
    return formatDecimal(human, max); // reuse your truncation helper
  } catch {
    // fallback if API already returns human-readable string
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

const formatAddress = (addr: string) => {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
};

const formatDecimal = (v: string, max = 6) => {
  if (!v) return "";
  const cleaned = v.replace(/[^0-9.]/g, "");
  const [head, ...rest] = cleaned.split(".");
  const dec = rest.join("");
  return dec ? `${head}.${dec.slice(0, max)}` : head;
};

export const DonationInfo: NextPage = () => {
  const params = useParams();
  const identify = params.identify as string;
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()
  const { open } = useAppKit();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [sendStep, setSendStep] = useState<string | null>(null);

  const [amount, setAmount] = useState("15");
  const [tokens, setTokens] = useState<Token[]>([]);
  const amt = useMemo(() => (amount ? Number(amount) : NaN), [amount]);
  const isValid = !Number.isNaN(amt) && amt > 0;

  // token selection via modal
  const [selectedToken, setSelectedToken] = useState<Token | null>(); // default USDC
  const [showTokenModal, setShowTokenModal] = useState(false);

  const fetchDonorTokenBalances = async (donorAddress: Address) => {
    const url = `${BUNGEE_API_BASE_URL}/api/v1/tokens/list`;
    const params = {
      userAddress: donorAddress,
      chainIds: Object.keys(CHAIN_CLIENT).join(","),
    };

    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${url}?${queryParams}`);
    const data = await response.json();

    if (!data.success) return;

    const tokenList = [];

    for (const tokenByChain of Object.entries(data.result)) {
      for (const token of tokenByChain[1] as any[]) {
        if (token.balanceInUsd > 0) {
          tokenList.push(token);
        }
      }
    }

    setTokens(
      tokenList.sort((a, b) => (b.balanceInUsd ?? 0) - (a.balanceInUsd ?? 0))
    );

    return data;
  };

  useEffect(() => {
    if (!isConnected || !address) return;
    fetchDonorTokenBalances(address as Address);
  }, [isConnected, address]);

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

  const sendAmount = useMemo(() => {
    if (!selectedToken) return 0;
    if (Number.isNaN(amt) || amt <= 0) return 0;

    const { balance, balanceInUsd } = selectedToken;

    const balNum = Number(formatUnits(BigInt(balance), selectedToken.decimals));
    const balUsdNum = Number(balanceInUsd ?? "0");

    // bail if no balance or no price info
    if (!balNum || !balUsdNum) return 0;

    // USD price of one token
    const pricePerToken = balUsdNum / balNum;
    if (pricePerToken <= 0) return 0;

    // how many tokens needed for amt USD
    const tokensNeeded = amt / pricePerToken;

    return tokensNeeded; // float value, e.g. 12.3456 tokens
  }, [amt, selectedToken]);

  const requestQuote = async (token: Token, amountUi: string) => {
    const url = `${BUNGEE_API_BASE_URL}/api/v1/bungee/quote`;
    const quoteParamsNative = {
      userAddress: address,
      feeTakerAddress: FEE_TAKER,
      feeBps: "200", // 2%
      originChainId: token.chainId,
      destinationChainId: base.id,
      inputToken: token.address,
      inputAmount: parseUnits(amountUi, token.decimals),
      receiverAddress: profile?.address,
      outputToken: getAddress(USDC_BASE),
      enableManual: true,
      excludeBridges: "cctp",
      refuel: false
    };


    const queryParams = new URLSearchParams(quoteParamsNative as any);
    const fullUrl = `${url}?${queryParams}`;

    const response = await fetch(fullUrl);
    const data = await response.json();
    const serverReqId = response.headers.get("server-req-id");
    if (!data.success) {
      throw new Error(
        `Quote error: ${data.statusCode}: ${data.message}. server-req-id: ${serverReqId}`
      );
    }

    if (!data.result.manualRoutes || data.result.manualRoutes.length === 0) {
      throw new Error(`No route found.`);
    }

    const quote = data.result.manualRoutes[0]

    const quoteId = quote.quoteId;
    const requestType = quote.requestType;
    let witness = null;
    let signTypedData = null;
    if (quote.signTypedData) {
      signTypedData = quote.signTypedData;
      if (signTypedData.values && signTypedData.values.witness) {
        witness = signTypedData.values.witness;
      }
    }
    const approvalData = quote.approvalData;
    return {
      quoteId,
      requestType,
      witness,
      signTypedData,
      approvalData,
      fullResponse: data,
    };
  };

  const buildTransaction = async (quoteId: any) => {
    const response = await fetch(
      `${BUNGEE_API_BASE_URL}/api/v1/bungee/build-tx?quoteId=${quoteId}`
    );
    const data = await response.json();
    const serverReqId = response.headers.get("server-req-id");

    if (!data.success) {
      throw new Error(
        `Build TX error: ${data.statusCode}: ${data.message}. server-req-id: ${serverReqId}`
      );

    }
    return data.result;
  }

  const checkStatus = async (requestHash: any) => {
    const response = await fetch(
      `${BUNGEE_API_BASE_URL}/api/v1/bungee/status?requestHash=${requestHash}`
    );
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Status error: ${data.error?.message || "Unknown error"}`);
    }
    return data.result[0];
  }

  const handleTip = async (token: Token, amountUi: string) => {
    try {
      setSendStep("Switching chain...");
      await switchChainAsync?.({
        chainId: token.chainId,
      });
      const chain = CHAIN_CLIENT[token.chainId];
      if (!chain) throw new Error("Unsupported chain for token");
      const client: PublicClient = createPublicClient({
        chain,
        transport: http(),
      }) as PublicClient;
      setSendStep("Requesting quote...");
      const { quoteId, requestType, witness, signTypedData, approvalData } = await requestQuote(token, amountUi);
      if (approvalData) {
        const currentAllowance = await client.readContract({
          address: approvalData.tokenAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [
            approvalData.userAddress,
            approvalData.spenderAddress === "0"
              ? "0x000000000022D473030F116dDEE9F6B43aC78BA3" // Permit2 default
              : approvalData.spenderAddress,
          ],
        });

        if (BigInt(currentAllowance) < BigInt(approvalData.amount)) {
          console.log("Sufficient allowance already exists.");
          setSendStep(`Approving ${token.symbol}...`);
          const hash = await writeContractAsync({
            address: approvalData.tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [
              approvalData.spenderAddress === "0"
                ? "0x000000000022D473030F116dDEE9F6B43aC78BA3"
                : approvalData.spenderAddress,
              approvalData.amount,
            ],
          });

          await toast.promise(
            client.waitForTransactionReceipt({ hash }),
            {
              loading: `Approving ${token.symbol}...`,
              success: `Approved ${token.symbol} for spending.`,
              error: (err) => `Approval error: ${err.message || err.toString()}`,
            }
          );
        }
      }

      setSendStep("Building transaction...");
      const { txData } = await buildTransaction(quoteId);

      if (!txData) throw new Error("No transaction data from build-tx");

      setSendStep("Sending transaction...");
      const txHash = await sendTransactionAsync({
        to: txData.to,
        data: txData.data,
        value: txData.value ? BigInt(txData.value) : undefined,
      });

      setSendStep("Waiting for confirmation...");
      await toast.promise(
        client.waitForTransactionReceipt({ hash: txHash }),
        {
          loading: `Sending ${token.symbol}...`,
          success: `Sent ${token.symbol} successfully!`,
          error: (err) => `Transaction error: ${err.message || err.toString()}`,
        }
      );
    } catch (e: any) {
      console.error("Error in handleTip:", e);
      toast.error(`Error: ${e.message || e.toString()}`);
    }
    setSendStep(null);
  };

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
    <main className="h-svh bg-gray-50 text-gray-900 grid place-items-center">
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

          {/* Amount + token picker button */}
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm text-gray-700"
            >
              Support {profile.displayName}
            </label>

            {/* quick amounts */}
            <div className="flex gap-2 mb-3">
              {[5, 15, 25].map((val) => {
                const selected = amount === val.toString();
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition
                      ${selected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                      }`}
                    aria-pressed={selected}
                  >
                    ${val}
                  </button>
                );
              })}
              <div className="w-[100px]">
                <input
                  type="number"
                  id="amount"
                  inputMode="decimal"
                  placeholder={`Custom (${selectedToken?.symbol})`}
                  value={amount}
                  onChange={(e) => setAmount(formatDecimal(e.target.value))}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 text-center"
                />
              </div>
            </div>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {isConnected ? (
              <div>
                {/* pay-with token button → opens modal */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Pay with
                  </span>

                  <button
                    type="button"
                    className="w-[120px] inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                    aria-haspopup="dialog"
                    onClick={() => open()}
                  >
                    {formatAddress(address as string)}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTokenModal(true)}
                  className="mb-3 w-full inline-flex items-center justify-between gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm hover:bg-gray-100"
                  aria-haspopup="dialog"
                  aria-expanded={showTokenModal}
                >
                  {selectedToken ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <ChainBadge chainId={selectedToken.chainId} />
                        <img
                          src={selectedToken.logoURI}
                          alt={selectedToken.symbol}
                          className="h-5 w-5 rounded-sm"
                        />
                        <span className="font-medium">
                          {selectedToken.symbol}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        Balance{" "}
                        {formatUint(
                          BigInt(selectedToken.balance),
                          selectedToken.decimals
                        )}{" "}
                        {selectedToken.balanceInUsd && (
                          <>({fmtUSD(selectedToken.balanceInUsd)})</>
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select a token</span>
                  )}
                </button>

                {/* Tip button */}
                <button
                  disabled={!isValid || !selectedToken || sendAmount <= 0 || !!sendStep}
                  onClick={() =>
                    handleTip(selectedToken!, sendAmount.toString())
                  }
                  className="mt-1 w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-40 px-4 py-3"
                >
                  {sendStep ? sendStep : selectedToken
                    ? `Send 
                  ${isValid
                      ? `${formatDecimal(sendAmount.toString(), 6)} ${selectedToken.symbol
                      }`
                      : "--"
                    }`
                    : "Select a token"}
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="mt-1 w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-40 px-4 py-3"
                  onClick={() => open()}
                >
                  Connect wallet to tip
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 text-center text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-center text-xs underline decoration-dotted hover:opacity-80"
            >
              Powered by Back
            </Link>
          </div>
        </section>
      </div>

      {/* TOKEN MODAL */}
      {showTokenModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowTokenModal(false);
          }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowTokenModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Choose a token</h2>
              <button
                onClick={() => setShowTokenModal(false)}
                className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {tokens &&
                tokens.map((t) => (
                  <li key={t.symbol + t.address + t.chainId}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left"
                      onClick={() => {
                        setSelectedToken(t);
                        setShowTokenModal(false);
                      }}
                    >
                      {/* Chain icon/badge */}
                      <ChainBadge chainId={t.chainId} />

                      <img
                        src={t.logoURI}
                        alt={t.symbol}
                        className="h-7 w-7 rounded-sm"
                      />
                      {/* Name + address */}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {t.symbol}{" "}
                          <span className="text-gray-500">• {t.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {t.address.slice(0, 6)}…{t.address.slice(-4)}
                        </div>
                      </div>

                      {/* Balance + USD */}
                      <div className="text-right leading-tight">
                        <div className="text-sm font-medium text-gray-900">
                          {formatUint(BigInt(t.balance), t.decimals)}
                        </div>
                        {t.balanceInUsd && (
                          <div className="text-xs text-gray-500">
                            {fmtUSD(t.balanceInUsd)}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
            </ul>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setShowTokenModal(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
