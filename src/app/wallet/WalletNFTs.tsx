'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import type { AlchemyNFT } from '@/lib/reservoir'
import { Wallet, ImageIcon, ExternalLink, RefreshCw, Search } from 'lucide-react'
import Link from 'next/link'

async function fetchNFTsFromAPI(address: string): Promise<AlchemyNFT[]> {
  const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? 'demo'
  try {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=48`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.ownedNfts ?? []
  } catch {
    return []
  }
}

function NFTCard({ nft }: { nft: AlchemyNFT }) {
  const img = nft.image?.cachedUrl ?? nft.image?.thumbnailUrl ?? nft.image?.originalUrl ?? ''
  const name = nft.name ?? `#${nft.tokenId}`
  const collection = nft.collection?.name ?? nft.contract?.name ?? 'Unknown'
  const contractAddr = nft.contract?.address ?? ''

  return (
    <Link href={`/collection/${collection.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#a855f7]/40 transition-all group">
        <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[#71717a]" />
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-[11px] font-medium truncate">{name}</p>
          <p className="text-[10px] text-[#71717a] truncate mt-0.5">{collection}</p>
          {contractAddr && (
            <a
              href={`https://etherscan.io/token/${contractAddr}?a=${nft.tokenId}`}
              target="_blank" rel="noopener noreferrer"
              className="text-[9px] text-[#71717a] hover:text-[#a855f7] flex items-center gap-0.5 mt-1 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Etherscan
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function WalletNFTs() {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<AlchemyNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState('')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const fetchNFTs = async (addr: string) => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchNFTsFromAPI(addr)
      setNfts(data)
    } catch {
      setError(true)
      setNfts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (address && !searched) {
      setSearched(address)
      fetchNFTs(address)
    }
  }, [address])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const addr = input.trim()
    if (!addr) return
    setSearched(addr)
    fetchNFTs(addr)
    setInput('')
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConnected ? `${address?.slice(0, 10)}… (connected)` : 'Enter wallet address (0x…)'}
            className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-[#a855f7] transition-colors placeholder:text-[#71717a] font-mono"
          />
        </div>
        <button type="submit" className="px-5 py-3 bg-[#a855f7] text-white text-sm font-semibold rounded-xl hover:bg-[#9333ea] transition-colors">
          Search
        </button>
        {searched && (
          <button type="button" onClick={() => fetchNFTs(searched)} className="px-4 py-3 bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl hover:bg-[#222] transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </form>

      {!isConnected && !searched && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
            <Wallet className="w-7 h-7 text-[#71717a]" />
          </div>
          <div>
            <p className="font-semibold">Connect wallet or search an address</p>
            <p className="text-sm text-[#71717a] mt-1">See Ethereum mainnet NFT holdings for any wallet</p>
          </div>
        </div>
      )}

      {searched && (
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xs text-[#71717a]">Showing NFTs for:</p>
          <a href={`https://etherscan.io/address/${searched}`} target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-[#a855f7] hover:underline flex items-center gap-1">
            {searched.slice(0, 10)}…{searched.slice(-6)} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-[#111111] border border-[#1e1e1e]">
              <div className="aspect-square skeleton" />
              <div className="p-2.5 space-y-1.5">
                <div className="h-3 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && searched && (
        <div className="bg-[#1a0a0a] border border-[#ef4444]/30 rounded-xl p-6 text-center">
          <p className="text-sm text-[#ef4444]">Failed to load NFTs. Alchemy API may be rate limited.</p>
          <button onClick={() => fetchNFTs(searched)} className="mt-3 text-xs text-[#71717a] hover:text-white underline">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && nfts.length === 0 && searched && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
          <p className="text-sm text-[#71717a]">No NFTs found for this wallet</p>
          <p className="text-xs text-[#3a3a3a] mt-1">Only Ethereum mainnet NFTs are shown</p>
        </div>
      )}

      {!loading && nfts.length > 0 && (
        <>
          <p className="text-xs text-[#71717a] mb-4">{nfts.length} NFT{nfts.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {nfts.map((nft) => (
              <NFTCard key={`${nft.contract.address}-${nft.tokenId}`} nft={nft} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
