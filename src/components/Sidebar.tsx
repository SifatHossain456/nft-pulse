import Link from 'next/link'
import { LayoutDashboard, Grid3X3, Activity, Wallet, Zap } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Trending', icon: LayoutDashboard },
  { href: '/collections', label: 'Collections', icon: Grid3X3 },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/wallet', label: 'My NFTs', icon: Wallet },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#111111] border-r border-[#1e1e1e] flex-col hidden md:flex">
      <div className="px-5 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">NFT Pulse</span>
        </div>
        <p className="text-[11px] text-[#71717a] mt-1 ml-10.5">Multi-Chain Intelligence</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors text-sm font-medium group"
          >
            <Icon className="w-4 h-4 group-hover:text-[#a855f7] transition-colors" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
          Reservoir API · Live
        </div>
      </div>
    </aside>
  )
}
