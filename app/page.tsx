"use client";
import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { Header } from "@components/header";
import { TypeAnimation } from "react-type-animation";

// --- Floating Chip ---
type FloatingName = {
  text: string;
  avatar: string;
  top: string;   // % or css length
  left: string;  // % or css length
  delay?: number;
  amplitude?: number; // px drift amplitude
};

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

// re-usable chip
const FloatingChip: React.FC<{ item: FloatingName; i: number; small?: boolean }> = ({ item, i, small }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{
      opacity: [0.25, 0.9, 0.25],
      y: [0, -8, 0],
      x: [0, (item.amplitude ?? 10), 0],
    }}
    transition={{
      duration: 6 + (i % 3),
      delay: item.delay ?? 0,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    className="absolute"
    style={{ top: item.top, left: item.left }}
    whileHover={{ scale: 1.03, rotate: 0.2 }}
  >
    <Link href={`/${item.text.includes("Farcaster") ? item.text.substring(item.text.indexOf("@"), 10) : item.text}`} className="pointer-events-auto">
      <div
        className={[
          "flex items-center gap-2 rounded-full",
          "border border-white/60 bg-white/70 backdrop-blur-md",
          "shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
          "ring-1 ring-black/[0.02]",
          "hover:shadow-[0_10px_36px_rgba(0,0,0,0.10)]",
          small ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-sm",
          "text-gray-700"
        ].join(" ")}
      >
        <Image
          src={item.avatar}
          alt="avatar"
          width={small ? 20 : 28}
          height={small ? 20 : 28}
          className={small ? "h-5 w-5 rounded-full" : "h-7 w-7 rounded-full"}
        />
        <span className="font-medium">{item.text}</span>
        {/* subtle badge shimmer */}
        <span className="ml-1 inline-block rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 px-2 py-[2px] text-[10px] font-semibold text-emerald-700">
          live
        </span>
      </div>
    </Link>
  </motion.div>
);


const LandingPage: NextPage = () => {
  const [handle, setHandle] = useState("");
  const [focused, setFocused] = useState(false);
  const isValid = useMemo(() => handle.trim().length >= 2, [handle]);

  const onClaim = useCallback(() => {
    if (!isValid) return;
    const h = handle.trim().replace(/^@/, "");
    window.location.href = `/${encodeURIComponent(h)}`;
  }, [handle, isValid]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onClaim();
  };

  type FloatingName = { text: string; avatar: string; top: string; left: string; delay?: number };

  const floatingItemsDesktop: FloatingName[] = [
    { text: "vitalik.eth", avatar: "https://euc.li/vitalik.eth", top: "12%", left: "55%" },
    { text: "alice.base.eth", avatar: "https://effigy.im/a/0x20200525E8fDB3A622EeC773b59A963b6CaC5e9b.png", top: "22%", left: "25%" },
    { text: "Farcaster: @dwr", avatar: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original", top: "35%", left: "80%" },
    { text: "jesse.base.eth", avatar: "https://zku9gdedgba48lmr.public.blob.vercel-storage.com/basenames/avatar/jesse.base.eth/1722020142962/cryptopunk-diuDROjlL5OLY6EcC5keHTsNAiWMSL.png", top: "55%", left: "12%" },
    { text: "satoshi.base.eth", avatar: avatar("satoshi"), top: "68%", left: "70%" },
    { text: "frankfurt.base.eth", avatar: avatar("frankfurt"), top: "78%", left: "27%" },
    { text: "imduchuyyy.eth", avatar: "https://euc.li/imduchuyyy.eth", top: "40%", left: "5%" },
    { text: "bruce.base.eth", avatar: avatar("bruce"), top: "88%", left: "42%" },
  ];

  const floatingItemsMobile: FloatingName[] = [
    { text: "vitalik.eth", avatar: avatar("vitalik"), top: "18%", left: "40%" },
    { text: "alice.base.eth", avatar: avatar("alice"), top: "28%", left: "10%" },
    { text: "buildernet.eth", avatar: avatar("buildernet"), top: "65%", left: "75%" },
    { text: "satoshi.base.eth", avatar: avatar("satoshi"), top: "70%", left: "25%" },
    { text: "wilsoncusack.base.eth", avatar: avatar("wilsoncusack"), top: "80%", left: "60%" },
  ];


  return (
    <div className="min-h-dvh bg-white text-gray-900">
      {/* Header */}
      <Header />
      <main className="relative min-h-dvh bg-white text-gray-900 overflow-hidden flex flex-col items-center justify-center">
        {/* Animated floating items (hidden on small screens) */}
        {/* Mobile layer */}
        <div className="absolute inset-0 pointer-events-none sm:hidden">
          {floatingItemsMobile.map((item, i) => (
            <FloatingChip key={`m-${i}`} item={item} i={i} small />
          ))}
        </div>

        {/* Desktop layer */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {floatingItemsDesktop.map((item, i) => (
            <FloatingChip key={`d-${i}`} item={item} i={i} />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex flex-col items-center gap-1">
              <TypeAnimation
                className="text-4xl font-bold mb-4"
                sequence={[
                  "Save your profile links.",
                  1500,
                  "Save your supports.",
                  1500,
                  "Save your stories.",
                  1500,
                ]}
                wrapper="span"
                speed={50}
                style={{ display: "inline-block" }}
                repeat={Infinity}
              />
              <p className="text-gray-500 text-xs sm:text-base max-w-sm sm:max-w-xl">
                Claim your profile page — receive tips from
                <span className="font-semibold text-gray-900"> any chain </span>
                and
                <span className="font-semibold text-gray-900"> any token</span>.
              </p>
            </div>

            {/* Center Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-6 sm:mt-10 w-full">
              <div className="relative mx-auto w-full max-w-xs sm:max-w-2xl">
                <div className={`relative flex items-center rounded-full border bg-gradient-to-r from-sky-100 via-white to-emerald-100 shadow-md sm:shadow-lg transition-all duration-300 ${focused ? "ring-2 ring-sky-300" : "border-gray-200"}`}>
                  <input
                    type="text"
                    placeholder="Search for a name..."
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent text-sm sm:text-lg md:text-xl px-4 sm:px-6 py-3 sm:py-4 rounded-full outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={onClaim}
                    disabled={!isValid}
                    className="absolute right-2 sm:right-4 flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white hover:scale-[1.05] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll Hint */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 2 }} className="mt-6 text-[10px] sm:text-xs flex items-center gap-1 text-gray-500">
            <span>ENS, Base Name, Farcaster handlers, and more...</span>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
