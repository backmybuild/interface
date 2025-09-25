"use client";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "./search";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${searchQuery.trim()}`);
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Support Creators with Crypto
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            Back makes it easy for builders to receive crypto donations from their community. 
            No setup required, always free, and you keep 100% of donations converted to USDC on Base.
          </p>
        </div>

        <SearchInput />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span>⚡</span>
            </div>
            <h3 className="mb-2">Instant Setup</h3>
            <p className="text-sm text-muted-foreground">
              No configuration needed. Your profile is ready immediately.
            </p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span>🔗</span>
            </div>
            <h3 className="mb-2">Any Chain, Any Token</h3>
            <p className="text-sm text-muted-foreground">
              Accept donations in any cryptocurrency across all chains.
            </p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span>💰</span>
            </div>
            <h3 className="mb-2">100% Yours</h3>
            <p className="text-sm text-muted-foreground">
              Keep all donations. Receive USDC on Base with zero fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}