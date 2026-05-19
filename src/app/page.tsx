export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getTrendingCollections, getRecentSales, fmtEth, fmtUsd, timeAgo, shortAddr } from '@/lib/reservoir'
import { TrendingUp, TrendingDown, ArrowUpRight, Flame, Clock } from 'lucide-react'
import Link from 'next/link'

function Chg({ v }: { v: number | undefined }) {
  const val = v ?? 0
  const pos = val >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{val.toFixed(1)}%
    </span>
  )
}

async function TrendingGrid() {
  const collections = await getTrendingCollections(20)
  if (!collections.length) return (
    <div className="text-center py-12 text-[#71717a] text-sm">No data available. Reservoir API rate limit may apply.</div>
  )

  const [top, ...rest] = collections

  return (
    <div className="space-y-4">
      {top && (
        <Link href={`/collection/${top.primaryContract ?? top.id}`}>
          <div className="relative rounded-2xl overflow-hidden border border-[#1e1e1e] hover:border-[#a855f7]/40 transition-all group cursor-pointer">
            <div
              className="h-52 bg-cover bg-center"
              style={{ backgroundImage: top.banner ? `url(${top.banner})` : `url(${top.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <img src={top.image} alt={top.name} className="w-12 h-12 rounded-xl border border-white/20" />
                  <div>
                    <p className="font-bold text-lg leading-tight">{top.name}</p>
                    <p className="text-sm text-[#a1a1aa]">{fmtEth(top.floorAsk?.price?.amount?.native)} floor</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#71717a]">24h vol</p>
                  <p className="font-bold text-lg">{fmtUsd(top.volume?.['1day'])}</p>
                  <Chg v={top.volumeChange?.['1day'] ? top.volumeChange['1day'] * 100 : 0} />
                </div>
              </div>
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#a855f7] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Flame className="w-3 h-3" /> #1 Trending
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {rest.slice(0, 12).map((col, i) => (
          <Link key={col.id} href={`/collection/${col.primaryContract ?? col.id}`}>
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-3 hover:border-[#a855f7]/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xs text-[#71717a] w-4 shrink-0">{i + 2}</span>
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <p className="text-sm font-semibold truncate group-hover:text-[#a855f7] transition-colors">{col.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#71717a]">Floor</p>
                  <p className="font-mono font-medium">{fmtEth(col.floorAsk?.price?.amount?.native, 2)}</p>
                </div>
                <div>
                  <p className="text-[#71717a]">24h Vol</p>
                  <p className="font-mono font-medium">{fmtUsd(col.volume?.['1day'])}</p>
                </div>
              </div>
              <div className="mt-2">
                <Chg v={col.volumeChange?.['1day'] ? col.volumeChange['1day'] * 100 : 0} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function RecentSalesFeed() {
  const sales = await getRecentSales(undefined, 15)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[#1e1e1e] flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#a855f7]" />
        <h3 className="font-semibold text-sm">Live Sales</h3>
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot ml-auto" />
      </div>
      <div className="divide-y divide-[#1a1a1a]">
        {sales.length === 0 && (
          <p className="px-4 py-6 text-xs text-[#71717a] text-center">No recent sales data</p>
        )}
        {sales.map((sale) => (
          <div key={sale.saleId ?? sale.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#161616] transition-colors">
            <img
              src={sale.token?.image ?? '/placeholder.png'}
              alt={sale.token?.name ?? ''}
              className="w-9 h-9 rounded-lg object-cover bg-[#1e1e1e] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{sale.token?.name ?? `#${sale.token?.tokenId}`}</p>
              <p className="text-[10px] text-[#71717a] truncate">{sale.token?.collection?.name}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-mono font-semibold">{fmtEth(sale.price?.amount?.native, 3)}</p>
              <p className="text-[10px] text-[#71717a]">{timeAgo(sale.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function StatsBar() {
  const collections = await getTrendingCollections(10)
  const totalVol24h = collections.reduce((s, c) => s + (c.volume?.['1day'] ?? 0), 0)
  const totalVol7d = collections.reduce((s, c) => s + (c.volume?.['7day'] ?? 0), 0)
  const avgFloor = collections.reduce((s, c) => s + (c.floorAsk?.price?.amount?.native ?? 0), 0) / (collections.length || 1)

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Top 10 Vol (24h)', value: fmtUsd(totalVol24h) },
        { label: 'Top 10 Vol (7d)', value: fmtUsd(totalVol7d) },
        { label: 'Avg Floor', value: fmtEth(avgFloor, 2) },
      ].map(({ label, value }) => (
        <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-4 py-3">
          <p className="text-xs text-[#71717a] uppercase tracking-wide mb-1">{label}</p>
          <p className="text-xl font-bold font-mono">{value}</p>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Trending NFTs</h1>
        <p className="text-sm text-[#71717a] mt-1">Top collections by 24h volume — live from Reservoir</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>}>
        <StatsBar />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-sm">🔥 Hot Right Now</h2>
            <Link href="/collections" className="text-xs text-[#a855f7] hover:underline ml-auto">
              View all →
            </Link>
          </div>
          <Suspense fallback={
            <div className="space-y-4">
              <div className="h-52 skeleton rounded-2xl" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
              </div>
            </div>
          }>
            <TrendingGrid />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div className="h-96 skeleton rounded-xl" />}>
            <RecentSalesFeed />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
