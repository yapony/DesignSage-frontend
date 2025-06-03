"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    router.push("/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-2">正在重定向...</h1>
        <p className="text-gray-500">正在前往主面板</p>
      </div>
    </div>
  )
}
