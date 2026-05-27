export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getCollection, fmtEth, fmtUsd, type Collection } from '@/lib/reservoir'
import { notFound } from 'next/navigation'
import { TrendingUp, TrendingDown, ExternalLink, Users, ImageIcon, DollarSign, BarChart2, ShoppingCart } from 'lucide-react'

export async function generateMetadata(props: PageProps<'/collection/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const collection = await getCollection(slug)
  if (!collection) return { title: 'Collection Not Found' }
  return {
    title: collection.name,
    description: collection.description
      ? collection.description.replace(/<[^>]+>/g, '').slice(0, 160)
      : `${collection.name} NFT collection — floor price, volume, and market data.`,
  }
}

function Chg({ v }: { v: number | undefined }) {
  const val = v ?? 0
  const pos = val >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{Math.abs(val).toFixed(2)}%
    </span>
  )
}

export default async function CollectionPage(props: PageProps<'/collection/[slug]'>) {
  const { slug } = await props.params
  const collection: Collection | null = await getCollection(slug)

  if (!collection) notFound()

  const banner = collection.banner_image ?? collection.image?.large ?? collection.image?.small ?? ''
  const img = collection.image?.large ?? collection.image?.small ?? ''

  const stats = [
    { label: 'Floor Price', value: fmtEth(collection.floor_price?.native_currency, 3), sub: fmtUsd(collection.floor_price?.usd), icon: DollarSign, chg: collection.floor_price_in_usd_24h_percentage_change },
    { label: 'Market Cap', value: fmtUsd(collection.market_cap?.usd), sub: fmtEth(collection.market_cap?.native_currency, 0) + ' ETH', icon: BarChart2 },
    { label: 'Vol (24h)', value: fmtUsd(collection.volume_24h?.usd), sub: fmtEth(collection.volume_24h?.native_currency, 1) + ' ETH', icon: TrendingUp, chg: collection.volume_in_usd_24h_percentage_change },
    { label: 'Sales (24h)', value: (collection.one_day_sales ?? 0).toLocaleString(), sub: `${(collection.one_day_sales_24h_percentage_change ?? 0) > 0 ? '+' : ''}${(collection.one_day_sales_24h_percentage_change ?? 0).toFixed(1)}%`, icon: ShoppingCart },
    { label: 'Total Supply', value: (collection.total_supply ?? 0).toLocaleString(), icon: ImageIcon },
    { label: 'Owners', value: (collection.number_of_unique_addresses ?? 0).toLocaleString(), sub: `${(collection.number_of_unique_addresses_24h_percentage_change ?? 0) > 0 ? '+' : ''}${(collection.number_of_unique_addresses_24h_percentage_change ?? 0).toFixed(1)}% (24h)`, icon: Users },
  ]

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden border border-[#1e1e1e] mb-6">
        <div
          className="h-44 bg-cover bg-center bg-[#1a1a1a]"
          style={banner ? { backgroundImage: `url(${banner})` } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {img && <img src={img} alt={collection.name} className="w-16 h-16 rounded-xl border-2 border-[#1e1e1e] object-cover" />}
            <div>
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-[#71717a] uppercase">{collection.symbol}</span>
                {collection.contract_address && (
                  <a
                    href={`https://etherscan.io/address/${collection.contract_address}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#71717a] font-mono hover:text-[#a855f7] flex items-center gap-1"
                  >
                    {collection.contract_address.slice(0, 10)}… <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {collection.contract_address && (
              <a
                href={`https://opensea.io/collection/${slug}`}
                target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#2081e2] text-white text-xs font-semibold rounded-lg hover:bg-[#1a6cc7] transition-colors flex items-center gap-1"
              >
                OpenSea <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, chg }) => (
          <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon className="w-3.5 h-3.5 text-[#a855f7]" />
              <p className="text-[10px] text-[#71717a] uppercase tracking-wide">{label}</p>
            </div>
            <p className="text-base font-bold font-mono">{value}</p>
            {chg !== undefined ? (
              <div className="mt-0.5"><Chg v={chg} /></div>
            ) : sub ? (
              <p className="text-[10px] text-[#71717a] mt-0.5">{sub}</p>
            ) : null}
          </div>
        ))}
      </div>

      {collection.description && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-sm mb-2">About {collection.name}</h2>
          <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-4">{collection.description}</p>
        </div>
      )}

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 text-center">
        <ImageIcon className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
        <p className="font-semibold text-sm">View on OpenSea or Blur</p>
        <p className="text-xs text-[#71717a] mt-1 mb-4">Browse individual tokens and recent sales on NFT marketplaces</p>
        <div className="flex justify-center gap-3">
          <a href={`https://opensea.io/collection/${slug}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-[#2081e2] text-white text-sm font-semibold rounded-lg hover:bg-[#1a6cc7] transition-colors flex items-center gap-1.5">
            OpenSea <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a href={`https://blur.io/collection/${slug}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-[#f97316] text-white text-sm font-semibold rounded-lg hover:bg-[#ea6c0a] transition-colors flex items-center gap-1.5">
            Blur <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
