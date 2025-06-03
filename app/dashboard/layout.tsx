"use client"

import { useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      if (!isLoggedIn) {
        router.replace('/login')
      }
    } catch (error) {
      console.error('Error checking login status:', error)
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        {children}
      </Suspense>
    </div>
  )
} 