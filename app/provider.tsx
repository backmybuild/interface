"use client";
import React, { type ReactNode } from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ProgressProvider
        height="4px"
        color="#baad93"
        options={{ showSpinner: false }}
        shallowRouting
      ></ProgressProvider>
      <SpeedInsights />
      <Analytics />
      {children}
    </>
  );
};

export default ContextProvider;
