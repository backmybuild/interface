"use client";
import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { BookOpen } from "lucide-react";
import { Button } from "@components/ui/button";

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

  // --- Floating Items ---
  type FloatingName = { kind: "name"; text: string; avatar: string; top: string; left: string; delay?: number };
  type FloatingTip = { kind: "tip"; from: string; to: string; amount: string; avatarFrom: string; avatarTo: string; top: string; left: string; delay?: number };
  const floatingItems: Array<FloatingName | FloatingTip> = [
    { kind: "name", text: "vitalik.eth", avatar: avatar("vitalik.eth"), top: "10%", left: "65%", delay: 0.1 },
    { kind: "name", text: "frankfurt.base.eth", avatar: avatar("frankfurt"), top: "80%", left: "40%", delay: 0.2 },
    { kind: "name", text: "alice.base.eth", avatar: avatar("alice"), top: "18%", left: "45%", delay: 0.3 },
    { kind: "name", text: "satoshi.base.eth", avatar: avatar("satoshi"), top: "60%", left: "10%", delay: 0.4 },
    { kind: "name", text: "wilsoncusack.base.eth", avatar: avatar("wilsoncusack"), top: "65%", left: "70%", delay: 0.5 },
    { kind: "tip", from: "imduchuyyy.eth", to: "minhtuong.eth", amount: "$10", avatarFrom: avatar("imduchuyyy"), avatarTo: avatar("minhtuong"), top: "40%", left: "70%", delay: 0.2 },
    { kind: "tip", from: "0x4fff...a62f", to: "wilsoncusack.base.eth", amount: "$5", avatarFrom: avatar("0x4fff"), avatarTo: avatar("wilsoncusack"), top: "25%", left: "5%", delay: 0.6 },
  ];

  function avatar(seed: string) {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
  }

  return (
    <main className="relative min-h-svh bg-white text-gray-900 overflow-hidden flex flex-col items-center justify-center">
      {/* Animated floating items (hidden on small screens) */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.25, 0.9, 0.25], y: [0, -8, 0] }}
            transition={{ duration: 6 + (i % 3), delay: item.delay ?? 0, repeat: Infinity, repeatType: "mirror" }}
            className="absolute group cursor-pointer"
            style={{ top: item.top, left: item.left }}
            whileHover={{ scale: 1.05 }}
          >
            {item.kind === "name" ? (
              <Link href={`/${item.text}`}>
              <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white/80 px-4 py-2 text-sm sm:text-base text-gray-700 shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md group-hover:font-semibold">
                <Image src={item.avatar} alt="avatar" height="6" width="6" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                <span>{item.text}</span>
              </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white/90 px-4 py-2 text-sm sm:text-base text-gray-700 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md group-hover:font-semibold">
                <Image src={item.avatarFrom} alt="from" height="6" width="6" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                <span>{item.from}</span>
                <span className="text-gray-400">→</span>
                <Image src={item.avatarTo} alt="to" height="6" width="6" className="h-6 w-6 sm:h-8 sm:w-9 rounded-full" />
                <span>{item.to}</span>
                <span className="ml-2 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs sm:text-sm font-semibold">
                  {item.amount}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 z-10 text-sm sm:text-base gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Image src="/back-square-logo.png" height="6" width="6" alt="BackMyBuild Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
          <span className="font-semibold tracking-tight text-gray-900">BackMyBuild</span>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6">
          <Link href="https://docs.backmybuild.com" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Button className="flex items-center gap-2 hover:cursor-pointer">
              <BookOpen className="w-4 h-4 inline-block mr-1" />
              Documentation
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 mt-16 sm:mt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">Simplify onchain tipping.</h1>
            <p className="text-gray-500 text-xs sm:text-base max-w-sm sm:max-w-xl">
              Claim your BackMyBuild name — receive tips from any chain, any token.
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
        <motion.div initial={{ y: 10 }} animate={{ y: [0, 4, 0] }} transition={{ delay: 1, duration: 2, repeat: Infinity }} className="mt-6 text-[10px] sm:text-xs flex items-center gap-1 text-gray-500">
          <span>ENS, Base Name, Farcaster handlers, and more...</span>
        </motion.div>
      </section>
    </main>
  );
}

export default LandingPage;
