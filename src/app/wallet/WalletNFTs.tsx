'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { getWalletNFTs, fmtEth, type NFTToken } from '@/lib/reservoir'
import { Wallet, ImageIcon, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function WalletNFTs() {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<NFTToken[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState('')
  const [input, setInput] = useState('')

  const fetchNFTs = async (addr: string) => {
    setLoading(true)
    try {
      const data = await getWalletNFTs(addr, 48)
      setNfts(data)
    } catch {
      setNfts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
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
  }

  if (!isConnected && !searched) {
    return (
      <div>
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search any wallet address (0x…)"
            className="flex-1 bg-[#111111] border border-[#1e1e1e] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a855f7] transition-colors placeholder:text-[#71717a]"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#a855f7] text-white text-sm font-semibold rounded-xl hover:bg-[#9333ea] transition-colors"
          >
            Search
          </button>
        </form>
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
            <Wallet className="w-7 h-7 text-[#71717a]" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Connect your wallet or search an address</p>
            <p className="text-sm text-[#71717a] mt-1">See NFT holdings on Ethereum mainnet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={address ?? 'Search any wallet address (0x…)'}
          className="flex-1 bg-[#111111] border border-[#1e1e1e] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a855f7] transition-colors placeholder:text-[#71717a] font-mono"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-[#a855f7] text-white text-sm font-semibold rounded-xl hover:bg-[#9333ea] transition-colors"
        >
          Search
        </button>
        {searched && (
          <button
            type="button"
            onClick={() => fetchNFTs(searched)}
            className="px-4 py-3 bg-[#1a1a1a] border border-[#1e1e1e] text-sm rounded-xl hover:bg-[#222] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </form>

      {searched && (
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xs text-[#71717a]">Showing NFTs for:</p>
          <a
            href={`https://etherscan.io/address/${searched}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-[#a855f7] hover:underline flex items-center gap-1"
          >
            {searched.slice(0, 10)}…{searched.slice(-6)} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="aspect-square skeleton" />
              <div className="p-2.5 space-y-1.5 bg-[#111111]">
                <div className="h-3 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && nfts.length === 0 && searched && (
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
            {nfts.map((t) => {
              const price = t.market?.floorAsk?.price?.amount?.native
              return (
                <Link
                  key={`${t.token.contract}-${t.token.tokenId}`}
                  href={`/collection/${t.token.contract}`}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#a855f7]/40 transition-all group"
                >
                  <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
                    {t.token.image ? (
                      <img
                        src={t.token.image}
                        alt={t.token.name ?? `#${t.token.tokenId}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#71717a]" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-medium truncate">{t.token.name ?? `#${t.token.tokenId}`}</p>
                    <p className="text-[10px] text-[#71717a] truncate mt-0.5">{t.token.collection?.name}</p>
                    {price && (
                      <p className="text-[10px] font-mono text-[#a855f7] mt-1">{fmtEth(price, 3)}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
