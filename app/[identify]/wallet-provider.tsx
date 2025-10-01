"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { base, mainnet, optimism, arbitrum, polygon, bsc, linea, scroll, zksync } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
const networks = [base, mainnet, optimism, arbitrum, polygon, bsc, linea, scroll, zksync];

//Set up the Wagmi Adapter (Config)
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "Back interface",
  description:
    "A confidential way to back builders. Build on @ethereum. Live on @base",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: [
    "https://raw.githubusercontent.com/backmybuild/interface/refs/heads/main/public/back-square-logo.png",
  ],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any,
  defaultNetwork: base,
  metadata: metadata,
  themeMode: "light",
  allowUnsupportedChain: true,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

const WalletProvider = ({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) => {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
