const CG = 'https://api.coingecko.com/api/v3'

// Curated list of top NFT collections — all fetchable via free /nfts/{id} endpoint
export const TOP_NFT_IDS = [
  'bored-ape-yacht-club',
  'cryptopunks',
  'mutant-ape-yacht-club',
  'azuki',
  'pudgy-penguins',
  'otherdeed-for-otherside',
  'doodles-official',
  'clone-x-x-takashi-murakami',
  'moonbirds',
  'lilpudgys',
  'beanz-official',
  'meebits',
  'mfers',
  'degods',
  'okay-bears',
  'world-of-women-nft',
  'cool-cats-nft',
  'sandbox',
]

export interface Collection {
  id: string
  contract_address: string
  asset_platform_id: string
  name: string
  symbol: string
  image: { small: string; large: string }
  banner_image: string
  description: string
  floor_price: { native_currency: number; usd: number }
  market_cap: { native_currency: number; usd: number }
  volume_24h: { native_currency: number; usd: number }
  floor_price_in_usd_24h_percentage_change: number
  volume_in_usd_24h_percentage_change: number
  number_of_unique_addresses: number
  number_of_unique_addresses_24h_percentage_change: number
  total_supply: number
  one_day_sales: number
  one_day_sales_24h_percentage_change: number
  one_day_average_sale_price: { native_currency: number; usd: number }
}

async function fetchOne(id: string): Promise<Collection | null> {
  try {
    const res = await fetch(`${CG}/nfts/${id}`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTrendingCollections(limit = 20): Promise<Collection[]> {
  const ids = TOP_NFT_IDS.slice(0, Math.min(limit, TOP_NFT_IDS.length))
  const results = await Promise.allSettled(ids.map(fetchOne))
  return results
    .filter((r): r is PromiseFulfilledResult<Collection> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value)
    .sort((a, b) => (b.volume_24h?.usd ?? 0) - (a.volume_24h?.usd ?? 0))
}

export async function getTopCollections(limit = 50): Promise<Collection[]> {
  const ids = TOP_NFT_IDS.slice(0, Math.min(limit, TOP_NFT_IDS.length))
  const results = await Promise.allSettled(ids.map(fetchOne))
  return results
    .filter((r): r is PromiseFulfilledResult<Collection> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value)
    .sort((a, b) => (b.market_cap?.usd ?? 0) - (a.market_cap?.usd ?? 0))
}

export async function getCollection(id: string): Promise<Collection | null> {
  return fetchOne(id)
}

export interface AlchemyNFT {
  contract: { address: string; name: string }
  tokenId: string
  name: string
  image: { cachedUrl?: string; originalUrl?: string; thumbnailUrl?: string }
  collection?: { name?: string }
}

export async function getWalletNFTs(address: string): Promise<AlchemyNFT[]> {
  try {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/demo/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=48`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.ownedNfts ?? []
  } catch {
    return []
  }
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

export function shortAddr(addr: string): string {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
