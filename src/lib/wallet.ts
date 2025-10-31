"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { defineChain } from "viem"

// Hedera Testnet chain (EVM)
export const hederaTestnet = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.hashio.io/api"] },
    public: { http: ["https://testnet.hashio.io/api"] },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/testnet" },
  },
})

export const wagmiConfig = getDefaultConfig({
  appName: "SkillSwap",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "skillswap-wallet-connect",
  chains: [hederaTestnet],
  transports: {
    [hederaTestnet.id]: http(hederaTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
})


