"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("密码不匹配")
      return
    }

    setIsLoading(true)

    // In a real app, this would be a server request
    // For demo purposes, we'll just simulate registration
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="decoration-circle w-[500px] h-[500px] top-[-250px] right-[-100px] opacity-30"></div>
      <div className="decoration-circle w-[300px] h-[300px] bottom-[-100px] left-[-100px] opacity-20"></div>

      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="text-lg font-medium">DesignSage</span>
        </Link>
      </div>

      <Card className="w-full max-w-md border-0 shadow-lg rounded-2xl overflow-hidden relative z-10 bg-white/90 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]"></div>
        <CardHeader className="space-y-1 pt-6">
          <CardTitle className="text-2xl font-semibold">注册</CardTitle>
          <CardDescription>创建您的账号</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl shadow-sm border-border/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 rounded-xl shadow-sm border-border/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                确认密码
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10 rounded-xl shadow-sm border-border/20"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-6">
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))] hover:opacity-90 transition-opacity h-10 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "注册中..." : "注册"}
            </Button>
            <div className="text-center text-sm">
              已有账号？{" "}
              <Link href="/login" className="text-primary hover:underline">
                登录
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
