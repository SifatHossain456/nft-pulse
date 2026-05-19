'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Navbar() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-14 bg-[#111111] border-b border-[#1e1e1e] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-xs text-[#71717a]">
        <RefreshCw className="w-3 h-3" />
        <span>Updated {time}</span>
      </div>
      <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
    </header>
  )
}
