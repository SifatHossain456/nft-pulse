const CG = 'https://api.coingecko.com/api/v3'
const ALCHEMY_BASE = 'https://eth-mainnet.g.alchemy.com/nft/v3'
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY ?? 'demo'

export interface Collection {
  id: string
  contract_address: string
  asset_platform_id: string
  name: string
  symbol: string
  image: { small: string; large: string; header?: string }
  banner_image: string
  description: string
  floor_price: { native_currency: number; usd: number }
  market_cap: { native_currency: number; usd: number }
  volume_24h: { native_currency: number; usd: number }
  floor_price_24h_percentage_change: number
  volume_24h_percentage_change: number
  number_of_unique_addresses: number
  number_of_unique_addresses_24h_percentage_change: number
  total_supply: number
  one_day_sales: number
  one_day_sales_24h_percentage_change: number
}

export interface NFTToken {
  token: {
    contract: string
    tokenId: string
    name: string
    image: string
    collection: { id: string; name: string; image: string }
    rarity: number
    rarityRank: number
  }
  market: {
    floorAsk: { price: { amount: { native: number; usd: number } } | null }
  }
}

export interface Sale {
  id: string
  saleId: string
  token: { contract: string; tokenId: string; name: string; image: string; collection: { id: string; name: string } }
  orderSource: string
  fillSource: string
  timestamp: number
  price: { amount: { native: number; usd: number } }
  from: string
  to: string
}

export async function getTrendingCollections(limit = 20): Promise<Collection[]> {
  const res = await fetch(
    `${CG}/nfts/markets?order=h24_volume_native_desc&per_page=${Math.min(limit, 50)}&page=1`,
    { next: { revalidate: 120 } }
  )
  if (!res.ok) throw new Error(`CoinGecko NFT trending error ${res.status}`)
  return res.json()
}

export async function getTopCollections(limit = 50): Promise<Collection[]> {
  const res = await fetch(
    `${CG}/nfts/markets?order=market_cap_usd_desc&per_page=${Math.min(limit, 50)}&page=1`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error(`CoinGecko NFT top error ${res.status}`)
  return res.json()
}

export async function getCollection(id: string): Promise<Collection | null> {
  const res = await fetch(`${CG}/nfts/${id}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export async function getCollectionTokens(_collection: string, _limit = 24): Promise<NFTToken[]> {
  return []
}

export async function getRecentSales(_collection?: string, _limit = 20): Promise<Sale[]> {
  return []
}

export async function getWalletNFTs(address: string, _limit = 48): Promise<AlchemyNFT[]> {
  try {
    const res = await fetch(
      `${ALCHEMY_BASE}/${ALCHEMY_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=48`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.ownedNfts ?? []
  } catch {
    return []
  }
}

export interface AlchemyNFT {
  contract: { address: string; name: string; openSeaMetadata?: { imageUrl?: string } }
  tokenId: string
  name: string
  image: { cachedUrl?: string; originalUrl?: string; thumbnailUrl?: string }
  collection?: { name?: string; slug?: string }
}

export async function getCollectionActivity(_collection: string, _limit = 20) {
  return []
}

export function fmtEth(n: number | undefined | null, decimals = 3): string {
  if (!n && n !== 0) return '—'
  return `${n.toFixed(decimals)} ETH`
}

export function fmtUsd(n: number | undefined | null): string {
  if (!n && n !== 0) return '—'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

export function timeAgo(ts: number): string {
  const diff = Date.now() / 1000 - ts
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function shortAddr(addr: string): string {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
