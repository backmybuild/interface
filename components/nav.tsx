"use client";
import Link from "next/link";
import Image from "next/image";
import { NextPage } from "next";

type NavBarProps = {
  children: React.ReactNode;
};

export const NavBar: NextPage<NavBarProps> = ({ children }) => {
  return (
    <nav className="fixed left-1/2 top-6 z-40 -translate-x-1/2">
      {/* width wrapper: long on mobile, auto on sm+ */}
      <div className="mx-auto w-[92vw] max-w-[680px] sm:w-[90vw]">
        {/* glow follows width */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/60 blur-2xl dark:bg-white/10" />
        {/* glass pill */}
        <div
          className="flex items-center justify-between gap-3 rounded-full border border-black/10 bg-white/70 px-3 py-2 shadow-2xl backdrop-blur-xl backdrop-saturate-150
                     dark:border-white/10 dark:bg-white/10 sm:gap-4 sm:px-4"
        >
          {/* left: brand */}
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/" className="flex items-center gap-2 rounded-full">
              <Image
                src="/back.png"
                alt="back logo"
                width={28}
                height={28}
                className="h-8 w-15"
                priority
              />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </nav>
  );
};
