"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Lightbulb, FileText, LogOut } from "lucide-react"
import { useEffect } from "react"

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

const modules: ModuleCard[] = [
  {
    id: "requirements",
    title: "需求分析",
    description: "探索用户需求与行为，收集市场反馈，确定产品方向与功能优先级",
    icon: <User className="h-6 w-6" />,
    href: "/dashboard/requirements",
  },
  {
    id: "concept",
    title: "概念设计",
    description: "发展创意灵感，探索多元设计方向，构建产品概念与交互模式",
    icon: <Lightbulb className="h-6 w-6" />,
    href: "/dashboard/concept",
  },
  {
    id: "detailed",
    title: "详细设计",
    description: "明确产品规格与功能细节，生成完整技术方案与实现路径",
    icon: <FileText className="h-6 w-6" />,
    href: "/dashboard/detailed",
  },
]

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.replace("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("difyApiKey")
    localStorage.removeItem("userEmail")
    router.replace("/login")
  }

  const handleModuleClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/5 bg-white">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
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
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto">
          <h1 className="text-3xl font-bold mb-12 text-center">Choose your Assistant</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="material-card cursor-pointer h-64 flex flex-col"
                onClick={() => handleModuleClick(module.href)}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="material-card-title text-primary">{module.title}</h2>
                  <p className="material-card-description flex-1">{module.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
