'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, base, optimism } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'NFT Pulse',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'nft-pulse-demo',
  chains: [mainnet, polygon, arbitrum, base, optimism],
  ssr: true,
})
