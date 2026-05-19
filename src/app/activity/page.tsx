export const dynamic = 'force-dynamic'

import { getRecentSales, fmtEth, fmtUsd, timeAgo, shortAddr } from '@/lib/reservoir'
import { Activity, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function ActivityPage() {
  const sales = await getRecentSales(undefined, 50)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Activity</h1>
        <p className="text-sm text-[#71717a] mt-1">Live NFT sales across all collections</p>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#a855f7]" />
          <h2 className="font-semibold text-sm">Recent Sales</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot ml-auto" />
        </div>

        {sales.length === 0 && (
          <div className="px-5 py-12 text-center text-[#71717a] text-sm">
            No recent sales data. Rate limit may apply — try refreshing.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
                <th className="px-5 py-3 text-left font-medium">Item</th>
                <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Collection</th>
                <th className="px-3 py-3 text-right font-medium">Price</th>
                <th className="px-3 py-3 text-left font-medium hidden lg:table-cell">From</th>
                <th className="px-3 py-3 text-left font-medium hidden lg:table-cell">To</th>
                <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Marketplace</th>
                <th className="px-3 py-3 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.saleId ?? sale.id} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/collection/${sale.token?.contract}`} className="flex items-center gap-2.5 group">
                      <img
                        src={sale.token?.image ?? ''}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-[#1e1e1e] shrink-0"
                      />
                      <div>
                        <p className="text-xs font-medium group-hover:text-[#a855f7] transition-colors truncate max-w-32">
                          {sale.token?.name ?? `#${sale.token?.tokenId}`}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <Link href={`/collection/${sale.token?.contract}`} className="text-xs text-[#a1a1aa] hover:text-[#a855f7] transition-colors truncate max-w-32 block">
                      {sale.token?.collection?.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <p className="text-sm font-mono font-semibold">{fmtEth(sale.price?.amount?.native, 3)}</p>
                    <p className="text-[10px] text-[#71717a]">{fmtUsd(sale.price?.amount?.usd)}</p>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <a href={`https://etherscan.io/address/${sale.from}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#71717a] hover:text-[#a855f7] flex items-center gap-1 transition-colors">
                      {shortAddr(sale.from)} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <a href={`https://etherscan.io/address/${sale.to}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#71717a] hover:text-[#a855f7] flex items-center gap-1 transition-colors">
                      {shortAddr(sale.to)} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-[#1e1e1e] rounded-full text-[#a1a1aa] capitalize">
                      {sale.fillSource ?? sale.orderSource ?? '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-[#71717a]">
                    {timeAgo(sale.timestamp)}
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
