import WalletNFTs from './WalletNFTs'

export default function WalletPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">My NFTs</h1>
        <p className="text-sm text-[#71717a] mt-1">Your NFT holdings — connect wallet to view</p>
      </div>
      <WalletNFTs />
    </div>
  )
}
