export const dynamic = 'force-dynamic'

import { getCollection, getCollectionTokens, getRecentSales, getCollectionActivity, fmtEth, fmtUsd, timeAgo, shortAddr } from '@/lib/reservoir'
import { notFound } from 'next/navigation'
import { TrendingUp, TrendingDown, ExternalLink, Users, ImageIcon, DollarSign } from 'lucide-react'
import Link from 'next/link'

function Chg({ v }: { v: number | undefined }) {
  const val = (v ?? 0) * 100
  const pos = val >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{val.toFixed(1)}%
    </span>
  )
}

export default async function CollectionPage(props: PageProps<'/collection/[slug]'>) {
  const { slug } = await props.params
  const [collection, tokens, sales] = await Promise.all([
    getCollection(slug),
    getCollectionTokens(slug, 24),
    getRecentSales(slug, 12),
  ])

  if (!collection) notFound()

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden border border-[#1e1e1e] mb-6">
        <div
          className="h-40 bg-cover bg-center bg-[#1a1a1a]"
          style={{ backgroundImage: collection.banner ? `url(${collection.banner})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img src={collection.image} alt={collection.name} className="w-16 h-16 rounded-xl border-2 border-[#1e1e1e]" />
            <div>
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              <a
                href={`https://etherscan.io/address/${collection.primaryContract}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#71717a] font-mono hover:text-[#a855f7] flex items-center gap-1"
              >
                {collection.primaryContract?.slice(0, 12)}… <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Floor Price', value: fmtEth(collection.floorAsk?.price?.amount?.native, 3), sub: fmtUsd(collection.floorAsk?.price?.amount?.usd), icon: DollarSign },
          { label: 'Vol (24h)', value: fmtUsd(collection.volume?.['1day']), sub: <Chg v={collection.volumeChange?.['1day']} />, icon: TrendingUp },
          { label: 'Total Supply', value: parseInt(collection.tokenCount ?? '0').toLocaleString(), icon: ImageIcon },
          { label: 'Owners', value: (collection.ownerCount ?? 0).toLocaleString(), icon: Users },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-[#a855f7]" />
              <p className="text-xs text-[#71717a] uppercase tracking-wide">{label}</p>
            </div>
            <p className="text-lg font-bold font-mono">{value}</p>
            {sub && <div className="mt-0.5 text-xs text-[#71717a]">{sub}</div>}
          </div>
        ))}
      </div>

      {collection.description && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 mb-6">
          <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-3">{collection.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <h2 className="font-semibold text-sm mb-4">Listings</h2>
          {tokens.length === 0 ? (
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center text-[#71717a] text-sm">
              No tokens listed
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {tokens.map((t) => {
                const price = t.market?.floorAsk?.price?.amount?.native
                return (
                  <div key={`${t.token.contract}-${t.token.tokenId}`} className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#a855f7]/40 transition-all group">
                    <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
                      {t.token.image ? (
                        <img
                          src={t.token.image}
                          alt={t.token.name ?? `#${t.token.tokenId}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#71717a]">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium truncate">{t.token.name ?? `#${t.token.tokenId}`}</p>
                      {price ? (
                        <p className="text-xs font-mono font-bold text-[#a855f7] mt-0.5">{fmtEth(price, 3)}</p>
                      ) : (
                        <p className="text-xs text-[#71717a] mt-0.5">Not listed</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-4">Recent Sales</h2>
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl divide-y divide-[#1a1a1a]">
            {sales.length === 0 && (
              <p className="px-4 py-6 text-xs text-[#71717a] text-center">No recent sales</p>
            )}
            {sales.map((sale) => (
              <div key={sale.saleId ?? sale.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={sale.token?.image ?? ''}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover bg-[#1e1e1e] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{sale.token?.name ?? `#${sale.token?.tokenId}`}</p>
                  <p className="text-[10px] text-[#71717a]">{shortAddr(sale.to)} · {timeAgo(sale.timestamp)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-semibold">{fmtEth(sale.price?.amount?.native, 3)}</p>
                  <p className="text-[10px] text-[#71717a]">{fmtUsd(sale.price?.amount?.usd)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
