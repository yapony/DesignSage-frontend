"use client"

import { cn } from "@/lib/utils"

interface FunctionButtonProps {
  label: string
  isActive: boolean
  moduleId: string
  onClick: () => void
}

export function FunctionButton({ label, isActive, moduleId, onClick }: FunctionButtonProps) {
  return (
    <button
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
        isActive
          ? `bg-white/70 shadow-sm border-l-2 sidebar-item-${moduleId}`
          : `hover:bg-white/40 function-button-${moduleId}`,
        isActive && label.includes("报告生成") ? `${moduleId}-color` : "",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
