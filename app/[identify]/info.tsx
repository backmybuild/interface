"use client";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { SocialIcon } from "@components/ui/social-icon";

export type Profile = {
  displayName: string;
  address: Address;
  description: string;
  avatar: string;
  socials?: string[];
};

type Token = {
  symbol: string;
  name: string;
  address: Address; // mock
  decimals: number;
  logo: string;
  balance: string; // mock human-readable balance
};

const TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ether",
    address: "0x0000000000000000000000000000000000000000" as Address,
    decimals: 18,
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    balance: "0.2145",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address, // Base USDC
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    balance: "126.43",
  },
  {
    symbol: "DAI",
    name: "Dai",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb" as Address, // Base DAI
    decimals: 18,
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
    balance: "58.00",
  },
];

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

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [amount, setAmount] = useState("5");
  const amt = useMemo(() => (amount ? Number(amount) : NaN), [amount]);
  const isValid = !Number.isNaN(amt) && amt > 0;

  // token selection via modal
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[1]); // default USDC
  const [showTokenModal, setShowTokenModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `https://api.web3.bio/profile/${identify}`
        );

        const allLinks: string[] = [];
        for (const item of data) {
          if (!item.links) continue;
          for (const [, val] of Object.entries(item.links)) {
            const handle = val as any;
            if (handle?.link) allLinks.push(handle.link);
          }
        }
        const uniqueLinks = Array.from(
          new Map(allLinks.map((l) => [l, l])).values()
        );

        const p: Profile = {
          address: data[0].address as Address,
          displayName: data[0].displayName as string,
          avatar: data[0].avatar as string,
          description: data[0].description as string,
          socials: uniqueLinks.splice(0, 3),
        };

        setProfile(p);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (identify) fetchProfile();
  }, [identify]);

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
              src={profile.avatar || "/avatar.png"}
              alt={`${profile.displayName} avatar`}
              width={128}
              height={128}
              className="h-32 w-32 rounded-3xl object-cover ring-1 ring-gray-200"
            />
            <div>
              <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
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
              {[1, 5, 10].map((val) => {
                const selected = amount === val.toString();
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition
                      ${
                        selected
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                      }`}
                    aria-pressed={selected}
                  >
                    {val}
                  </button>
                );
              })}
              <div className="w-[140px]">
                <input
                  type="number"
                  id="amount"
                  inputMode="decimal"
                  placeholder={`Custom (${selectedToken.symbol})`}
                  value={amount}
                  onChange={(e) => setAmount(formatDecimal(e.target.value))}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 text-center"
                />
              </div>
            </div>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* pay-with token button → opens modal */}
            <button
              type="button"
              onClick={() => setShowTokenModal(true)}
              className="mb-3 w-full inline-flex items-center justify-between gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm hover:bg-gray-100"
              aria-haspopup="dialog"
              aria-expanded={showTokenModal}
            >
              <div className="flex items-center gap-2">
                <img
                  src={selectedToken.logo}
                  alt={selectedToken.symbol}
                  className="h-5 w-5 rounded-sm"
                />
                <span className="font-medium">{selectedToken.symbol}</span>
              </div>
              <span className="text-gray-500">
                Balance {selectedToken.balance}
              </span>
            </button>

            {/* Tip button */}
            <button
              disabled={!isValid}
              className="mt-1 w-full rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-40 px-4 py-3"
            >
              Send {amount || "0"} {selectedToken.symbol}
            </button>
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

            <div className="text-xs text-gray-500 mb-3">
              These balances are mock values. Replace with wallet reads.
            </div>

            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {TOKENS.map((t) => (
                <li key={t.symbol}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left"
                    onClick={() => {
                      setSelectedToken(t);
                      setShowTokenModal(false);
                    }}
                  >
                    <img
                      src={t.logo}
                      alt={t.symbol}
                      className="h-7 w-7 rounded-sm"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {t.symbol}{" "}
                        <span className="text-gray-500">• {t.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.address.slice(0, 6)}…{t.address.slice(-4)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {t.balance}
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
