import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/5 bg-white">
        <div className="container flex h-16 items-center px-4 sm:px-6">
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
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Design Knowledge Assistant
              <br />
              <span className="text-primary">Task-Driven Design Support</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              通过AI驱动的对话，开启设计创新之旅，从需求分析到详细设计的全流程支持
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-8 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-200"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-8 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-200"
              >
                注册
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/static/new-home-visual.png"
              alt="Design Assistant Illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
