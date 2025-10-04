"use client";
import { Button } from "./ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80">
        <Image
          src="/back.png"
          alt="BackMyBuild Logo"
          width={32}
          height={32}
          className="h-6 sm:h-8 w-auto"
        />
        <span className="font-semibold tracking-tight text-gray-900 text-base sm:text-lg">
          BackMyBuild
        </span>
      </Link>

      {/* Documentation button */}
      <Link href="https://docs.backmybuild.com" className="hover:opacity-80 shrink-0">
        <Button className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
          <BookOpen className="w-4 h-4" />
          Documentation
        </Button>
      </Link>
    </header>
  );
}
