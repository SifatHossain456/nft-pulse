# NFT Pulse — Multi-Chain NFT Intelligence

Live NFT market data — trending collections, floor prices, volume, and wallet NFT tracking across Ethereum and Base. Powered by the OpenSea API.

## Features

- **Top Collections** — Top 50 NFT collections ranked by market cap with floor price, 24h volume, and owner count
- **Collection Detail** — Per-collection page with description, stats, and trait data; dynamic SEO metadata via `generateMetadata`
- **Activity Feed** — Real-time sales, listings, and transfers across major collections
- **Wallet NFTs** — Enter any address to view its complete NFT holdings with collection grouping

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (RSC + `generateMetadata`) |
| Styling | Tailwind CSS v4 |
| Data | OpenSea API v2 |
| Fonts | Geist Sans + Geist Mono |

## Getting Started

```bash
git clone https://github.com/SifatHossain456/nft-pulse.git
cd nft-pulse
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
OPENSEA_API_KEY=your_opensea_api_key
```

Get a free API key at [opensea.io/api](https://docs.opensea.io/reference/api-keys).

## Project Structure

```
src/app/
├── page.tsx              # Featured collections
├── collections/          # Top 50 list
├── collection/[slug]/    # Collection detail + generateMetadata
├── activity/             # Market activity feed
└── wallet/[address]/     # Wallet NFT viewer
```

## License

MIT
