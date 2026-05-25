import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'NFT Pulse — Multi-Chain NFT Intelligence', template: '%s — NFT Pulse' },
  description: 'Live NFT market data, trending collections, floor prices, and wallet tracking across Ethereum, Base and more.',
  keywords: ['NFT', 'NFT market', 'floor price', 'trending collections', 'Ethereum', 'Base', 'web3'],
  openGraph: {
    title: 'NFT Pulse — Multi-Chain NFT Intelligence',
    description: 'Live NFT market data, trending collections, floor prices, and wallet tracking.',
    type: 'website',
    siteName: 'NFT Pulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFT Pulse — Multi-Chain NFT Intelligence',
    description: 'Live NFT market data, trending collections, floor prices, and wallet tracking.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full bg-[#0a0a0a] text-white antialiased">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <Navbar />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
