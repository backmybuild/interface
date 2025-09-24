"use client";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Address, Hex, hexToString, isAddress } from "viem";
import { SocialIcon } from "@components/ui/social-icon";

export type Profile = {
  displayName: string;
  address: Address;
  description: string;
  avatar: string;
  socials?: string[];
};

export const DonationInfo: NextPage = () => {
  const params = useParams();
  const identify = params.identify as string;
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await axios.get(
        `https://api.web3.bio/profile/${identify}`
      );

      const allLinks: string[] = [];

      for (const item of data) {
        if (!item.links) continue;
        for (const [_, val] of Object.entries(item.links)) {
          const handle = val as any;
          if (val && handle.link) {
            allLinks.push(handle.link);
          }
        }
      }

      // remove duplicates by link
      const uniqueLinks = Array.from(
        new Map(allLinks.map((l) => [l, l])).values()
      );

      const profile: Profile = {
        address: data[0].address as Address,
        displayName: data[0].displayName as string,
        avatar: data[0].avatar as string,
        description: data[0].description as string,
        socials: uniqueLinks.splice(0, 3), // max 6 links
      };

      setIsLoading(false);
      setProfile(profile);
    };
    if (identify) {
      try {
        fetchProfile();
      } catch (e) {
        setIsLoading(false);
      }
    }
  }, [identify]);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-b from-black via-zinc-950 to-black text-white flex items-center justify-center">
        <div className="text-white/70">Loading profile...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-b from-black via-zinc-950 to-black text-white flex items-center justify-center">
        <div className="text-white/70">Profile not found.</div>
        <Link className="ml-2 text-white/70" href="/">
          Go back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="h-svh bg-black text-white grid place-items-center transition-opacity duration-300">
      <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg px-4 h-full flex items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-center flex flex-col justify-center overflow-y-auto">
          <div className="flex flex-col items-center gap-5">
            <img
              src={profile.avatar || "/avatar.png"}
              alt={`${profile.displayName} avatar`}
              width={128}
              height={128}
              className="h-32 w-32 rounded-3xl object-cover ring-1 ring-white/20"
            />
            <div>
              <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
              <p className="text-base text-white/70 mt-2">
                {profile.description}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-center flex-wrap gap-4">
            {profile.socials?.map((s, i) => (
              <a
                key={i}
                href={s}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
              >
                <SocialIcon url={s} className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          {/* <DonateForm
            fullname={profile.fullname || ""}
            stealthKey={profile.key}
          /> */}
        </section>
      </div>
    </main>
  );
};
