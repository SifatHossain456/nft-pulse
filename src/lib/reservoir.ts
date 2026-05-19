const BASE = 'https://api.reservoir.tools'
const HEADERS = {
  'x-api-key': process.env.RESERVOIR_API_KEY ?? 'demo-api-key',
  accept: 'application/json',
}

export interface Collection {
  id: string
  slug: string
  name: string
  image: string
  banner: string
  description: string
  floorAsk: { price: { amount: { native: number; usd: number } } }
  volume: { '1day': number; '7day': number; '30day': number; allTime: number }
  volumeChange: { '1day': number; '7day': number; '30day': number }
  floorSaleChange: { '1day': number }
  tokenCount: string
  ownerCount: number
  onSaleCount: number
  primaryContract: string
  rank: { '1day': number; '7day': number; '30day': number; allTime: number }
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
    attributes: { key: string; value: string; tokenCount: number }[]
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

export interface ActivityItem {
  type: string
  fromAddress: string
  toAddress: string
  timestamp: number
  price: { amount: { native: number; usd: number } } | null
  token: { tokenId: string; tokenName: string; tokenImage: string }
  collection: { collectionId: string; collectionName: string; collectionImage: string }
}

export async function getTrendingCollections(limit = 20): Promise<Collection[]> {
  const res = await fetch(
    `${BASE}/collections/v7?sortBy=1DayVolume&limit=${limit}&includeAttributes=false`,
    { headers: HEADERS, next: { revalidate: 120 } }
  )
  if (!res.ok) throw new Error(`Reservoir trending error ${res.status}`)
  const data = await res.json()
  return data.collections ?? []
}

export async function getTopCollections(limit = 50): Promise<Collection[]> {
  const res = await fetch(
    `${BASE}/collections/v7?sortBy=allTimeVolume&limit=${limit}`,
    { headers: HEADERS, next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error(`Reservoir top collections error ${res.status}`)
  const data = await res.json()
  return data.collections ?? []
}

export async function getCollection(slugOrAddress: string): Promise<Collection | null> {
  const res = await fetch(
    `${BASE}/collections/v7?id=${slugOrAddress}&includeAttributes=false`,
    { headers: HEADERS, next: { revalidate: 60 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.collections?.[0] ?? null
}

export async function getCollectionTokens(collection: string, limit = 24): Promise<NFTToken[]> {
  const res = await fetch(
    `${BASE}/tokens/v7?collection=${collection}&sortBy=floorAskPrice&limit=${limit}`,
    { headers: HEADERS, next: { revalidate: 60 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.tokens ?? []
}

export async function getRecentSales(collection?: string, limit = 20): Promise<Sale[]> {
  const collectionParam = collection ? `&collection=${collection}` : ''
  const res = await fetch(
    `${BASE}/sales/v6?limit=${limit}${collectionParam}`,
    { headers: HEADERS, cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.sales ?? []
}

export async function getWalletNFTs(address: string, limit = 24): Promise<NFTToken[]> {
  const res = await fetch(
    `${BASE}/users/${address}/tokens/v10?limit=${limit}&sortBy=acquiredAt`,
    { headers: HEADERS, cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.tokens ?? []
}

export async function getCollectionActivity(collection: string, limit = 20): Promise<ActivityItem[]> {
  const res = await fetch(
    `${BASE}/collections/activity/v6?collection=${collection}&limit=${limit}&types=sale`,
    { headers: HEADERS, cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.activities ?? []
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
