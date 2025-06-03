'use client'

import { ReactNode, Suspense } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
} 