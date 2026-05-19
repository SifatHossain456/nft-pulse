export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getTrendingCollections, fmtEth, fmtUsd, type Collection } from '@/lib/reservoir'
import { TrendingUp, TrendingDown, Flame, BarChart2 } from 'lucide-react'
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

function CollectionCard({ col, rank }: { col: Collection; rank: number }) {
  const img = col.image?.small ?? col.image?.large ?? ''
  return (
    <Link href={`/collection/${col.id}`}>
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-3 hover:border-[#a855f7]/50 transition-all cursor-pointer group h-full">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xs text-[#71717a] w-5 shrink-0">{rank}</span>
          {img ? (
            <img src={img} alt={col.name} className="w-9 h-9 rounded-lg object-cover shrink-0 bg-[#1a1a1a]" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-[#a855f7] transition-colors">{col.name}</p>
            <p className="text-[10px] text-[#71717a] uppercase">{col.symbol}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <p className="text-[#71717a]">Floor</p>
            <p className="font-mono font-medium">{fmtEth(col.floor_price?.native_currency, 2)}</p>
          </div>
          <div>
            <p className="text-[#71717a]">Vol 24h</p>
            <p className="font-mono font-medium">{fmtUsd(col.volume_24h?.usd)}</p>
          </div>
        </div>
        <Chg v={col.floor_price_in_usd_24h_percentage_change} />
      </div>
    </Link>
  )
}

async function StatsBar() {
  const cols = await getTrendingCollections(10)
  const totalVol = cols.reduce((s, c) => s + (c.volume_24h?.usd ?? 0), 0)
  const totalMcap = cols.reduce((s, c) => s + (c.market_cap?.usd ?? 0), 0)
  const topFloor = Math.max(...cols.map((c) => c.floor_price?.native_currency ?? 0))

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Top 10 Vol (24h)', value: fmtUsd(totalVol), icon: BarChart2 },
        { label: 'Top 10 Market Cap', value: fmtUsd(totalMcap), icon: BarChart2 },
        { label: 'Highest Floor', value: fmtEth(topFloor, 1), icon: TrendingUp },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-4 py-3 flex items-center gap-3">
          <Icon className="w-4 h-4 text-[#a855f7] shrink-0" />
          <div>
            <p className="text-xs text-[#71717a] uppercase tracking-wide">{label}</p>
            <p className="text-lg font-bold font-mono mt-0.5">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

async function HeroCard({ col }: { col: Collection }) {
  const banner = col.banner_image ?? col.image?.large ?? col.image?.small ?? ''
  const img = col.image?.small ?? ''
  return (
    <Link href={`/collection/${col.id}`}>
      <div className="relative rounded-2xl overflow-hidden border border-[#1e1e1e] hover:border-[#a855f7]/40 transition-all group cursor-pointer mb-3">
        <div
          className="h-52 bg-cover bg-center bg-[#1a1a1a]"
          style={banner ? { backgroundImage: `url(${banner})` } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              {img && <img src={img} alt={col.name} className="w-12 h-12 rounded-xl border border-white/20 object-cover" />}
              <div>
                <p className="font-bold text-lg leading-tight">{col.name}</p>
                <p className="text-sm text-[#a1a1aa]">{fmtEth(col.floor_price?.native_currency, 2)} floor</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#71717a]">24h vol</p>
              <p className="font-bold text-lg">{fmtUsd(col.volume_24h?.usd)}</p>
              <Chg v={col.volume_in_usd_24h_percentage_change} />
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#a855f7] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          <Flame className="w-3 h-3" /> #1 Trending
        </div>
      </div>
    </Link>
  )
}

async function TrendingSection() {
  const collections = await getTrendingCollections(20)
  if (!collections.length) {
    return (
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center text-[#71717a] text-sm">
        Unable to load trending data. Please try again.
      </div>
    )
  }
  const [top, ...rest] = collections
  return (
    <div className="space-y-3">
      {top && <HeroCard col={top} />}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {rest.slice(0, 12).map((col, i) => (
          <CollectionCard key={col.id} col={col} rank={i + 2} />
        ))}
      </div>
    </div>
  )
}

async function TopGainersLosers() {
  const cols = await getTrendingCollections(20)
  const sorted = [...cols].sort((a, b) => (b.floor_price_in_usd_24h_percentage_change ?? 0) - (a.floor_price_in_usd_24h_percentage_change ?? 0))
  const gainers = sorted.slice(0, 5)
  const losers = [...sorted].reverse().slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#22c55e]" />
          <h3 className="font-semibold text-sm">Top Gainers</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {gainers.map((c) => (
            <Link key={c.id} href={`/collection/${c.id}`}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#161616] transition-colors">
                <img src={c.image?.small ?? ''} alt={c.name} className="w-8 h-8 rounded-lg object-cover bg-[#1a1a1a] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-[#71717a] font-mono">{fmtEth(c.floor_price?.native_currency, 2)}</p>
                </div>
                <Chg v={c.floor_price_in_usd_24h_percentage_change} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-[#ef4444]" />
          <h3 className="font-semibold text-sm">Top Losers</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {losers.map((c) => (
            <Link key={c.id} href={`/collection/${c.id}`}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#161616] transition-colors">
                <img src={c.image?.small ?? ''} alt={c.name} className="w-8 h-8 rounded-lg object-cover bg-[#1a1a1a] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-[#71717a] font-mono">{fmtEth(c.floor_price?.native_currency, 2)}</p>
                </div>
                <Chg v={c.floor_price_in_usd_24h_percentage_change} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Trending NFTs</h1>
        <p className="text-sm text-[#71717a] mt-1">Top collections by 24h volume — live from CoinGecko</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>}>
        <StatsBar />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-sm">Hot Right Now</h2>
            <Link href="/collections" className="text-xs text-[#a855f7] hover:underline ml-auto">View all →</Link>
          </div>
          <Suspense fallback={
            <div className="space-y-3">
              <div className="h-52 skeleton rounded-2xl" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
              </div>
            </div>
          }>
            <TrendingSection />
          </Suspense>
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-4">24h Movers</h2>
          <Suspense fallback={<div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-48 skeleton rounded-xl" />)}</div>}>
            <TopGainersLosers />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
