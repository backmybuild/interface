"use client";
import React, { type ReactNode } from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ProgressProvider
        height="4px"
        color="#baad93"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <SpeedInsights />
      <Analytics />
      <Toaster />
      {children}
    </>
  );
};

export default ContextProvider;
