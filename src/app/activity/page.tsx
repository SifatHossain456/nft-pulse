export const dynamic = 'force-dynamic'

import { getTrendingCollections, fmtEth, fmtUsd, type Collection } from '@/lib/reservoir'
import { Activity, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
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

export default async function ActivityPage() {
  const collections = await getTrendingCollections(20)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Activity</h1>
        <p className="text-sm text-[#71717a] mt-1">24h sales activity across top collections</p>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#a855f7]" />
          <h2 className="font-semibold text-sm">Collection Activity (24h)</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot ml-auto" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
                <th className="px-5 py-3 text-left font-medium">#</th>
                <th className="px-3 py-3 text-left font-medium">Collection</th>
                <th className="px-3 py-3 text-right font-medium">Sales (24h)</th>
                <th className="px-3 py-3 text-right font-medium">Sales Chg</th>
                <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Vol (24h)</th>
                <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Vol Chg</th>
                <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Floor</th>
                <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Floor Chg</th>
                <th className="px-3 py-3 text-center font-medium hidden xl:table-cell">Links</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col: Collection, i: number) => (
                <tr key={col.id} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3 text-[#71717a] text-sm">{i + 1}</td>
                  <td className="px-3 py-3">
                    <Link href={`/collection/${col.id}`} className="flex items-center gap-2.5 group">
                      <img src={col.image?.small ?? ''} alt={col.name} className="w-8 h-8 rounded-lg object-cover bg-[#1e1e1e] shrink-0" />
                      <div>
                        <p className="text-sm font-medium group-hover:text-[#a855f7] transition-colors">{col.name}</p>
                        <p className="text-[10px] text-[#71717a] uppercase">{col.symbol}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-mono font-semibold">
                    {(col.one_day_sales ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Chg v={col.one_day_sales_24h_percentage_change} />
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden md:table-cell font-mono">
                    {fmtUsd(col.volume_24h?.usd)}
                  </td>
                  <td className="px-3 py-3 text-right hidden md:table-cell">
                    <Chg v={col.volume_in_usd_24h_percentage_change} />
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-mono hidden lg:table-cell">
                    {fmtEth(col.floor_price?.native_currency, 3)}
                  </td>
                  <td className="px-3 py-3 text-right hidden lg:table-cell">
                    <Chg v={col.floor_price_in_usd_24h_percentage_change} />
                  </td>
                  <td className="px-3 py-3 text-center hidden xl:table-cell">
                    <a
                      href={`https://opensea.io/collection/${col.id}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[#71717a] hover:text-[#a855f7] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
