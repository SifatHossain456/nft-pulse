'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[NFT Pulse] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="text-5xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Something went wrong</h1>
      <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
        {error.message || 'Failed to load NFT data. The API may be temporarily unavailable.'}
      </p>
      {error.digest && (
        <p className="mb-6 text-xs font-mono" style={{ color: 'var(--muted)' }}>ID: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent2)', color: '#fff' }}
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          Go home
        </a>
      </div>
    </div>
  )
}
