"use client";
import React, { type ReactNode } from "react";
import { ProgressProvider } from "@bprogress/next/app";

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ProgressProvider
        height="4px"
        color="#baad93"
        options={{ showSpinner: false }}
        shallowRouting
      ></ProgressProvider>
      {children}
    </>
  );
};

export default ContextProvider;
