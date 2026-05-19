export const dynamic = 'force-dynamic'

import { getTopCollections, fmtEth, fmtUsd, type Collection } from '@/lib/reservoir'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

function Chg({ v }: { v: number | undefined }) {
  const val = v ?? 0
  const pos = val >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{Math.abs(val).toFixed(1)}%
    </span>
  )
}

export default async function CollectionsPage() {
  const collections = await getTopCollections(50)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Collections</h1>
        <p className="text-sm text-[#71717a] mt-1">Top 50 NFT collections by market cap — CoinGecko</p>
      </div>

      {collections.length === 0 && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center text-[#71717a] text-sm">
          Unable to load data. CoinGecko may be rate limiting. Please refresh.
        </div>
      )}

      {collections.length > 0 && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
                  <th className="px-5 py-3 text-left font-medium">#</th>
                  <th className="px-3 py-3 text-left font-medium">Collection</th>
                  <th className="px-3 py-3 text-right font-medium">Floor</th>
                  <th className="px-3 py-3 text-right font-medium">24h Change</th>
                  <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Vol 24h</th>
                  <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Market Cap</th>
                  <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Sales 24h</th>
                  <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Supply</th>
                  <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Owners</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col: Collection, i: number) => (
                  <tr key={col.id} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                    <td className="px-5 py-3 text-[#71717a] text-sm">{i + 1}</td>
                    <td className="px-3 py-3">
                      <Link href={`/collection/${col.id}`} className="flex items-center gap-2.5 group">
                        <img
                          src={col.image?.small ?? col.image?.large ?? ''}
                          alt={col.name}
                          className="w-8 h-8 rounded-lg object-cover bg-[#1e1e1e] shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium group-hover:text-[#a855f7] transition-colors">{col.name}</p>
                          <p className="text-[10px] text-[#71717a] uppercase">{col.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <p className="text-sm font-mono font-semibold">{fmtEth(col.floor_price?.native_currency, 3)}</p>
                      <p className="text-[10px] text-[#71717a]">{fmtUsd(col.floor_price?.usd)}</p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Chg v={col.floor_price_24h_percentage_change} />
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden md:table-cell font-mono">
                      {fmtUsd(col.volume_24h?.usd)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden lg:table-cell font-mono">
                      {fmtUsd(col.market_cap?.usd)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden lg:table-cell">
                      {(col.one_day_sales ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden xl:table-cell">
                      {(col.total_supply ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden xl:table-cell">
                      {(col.number_of_unique_addresses ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
