"use client";

import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${searchQuery.trim()}`);
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
      <div className="relative">
        <div className="flex items-center bg-background border rounded-lg shadow-lg overflow-hidden">
          <div className="flex-1 flex items-center px-4">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground mr-3 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
            )}
            <Input
              type="text"
              placeholder="Search your profile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 text-lg"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="m-2 px-8 py-3 rounded-md"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-5">
        {isLoading
          ? "Searching on-chain for profile data..."
          : "Search by Ethereum Address, ENS, Base Name, Farcaster Handle..."}
      </p>
    </form>
  );
};
