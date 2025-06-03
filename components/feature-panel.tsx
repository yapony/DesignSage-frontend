"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

interface FeaturePanelProps {
  title?: string
  description?: string
  isOpen: boolean
  onToggle: () => void
  reportContent?: string
  moduleId: string
  richContent?: React.ReactNode
}

export function FeaturePanel({
  title,
  description,
  isOpen,
  onToggle,
  reportContent,
  moduleId,
  richContent,
}: FeaturePanelProps) {
  if (!isOpen) return null
  return (
    <div
      className={cn(
        `feature-panel-${moduleId} transition-all duration-300 ease-in-out overflow-hidden relative`,
        isOpen ? "w-96 opacity-100" : "w-0 opacity-0",
      )}
    >
      <div className="p-6">
        {(title || description) && (
          <div className="flex items-center mb-4">
            {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
          </div>
        )}
        {richContent ? (
          <div>{richContent}</div>
        ) : (
          description && <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {reportContent && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 whitespace-pre-line">{reportContent}</div>
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0 bg-white shadow-sm hover:bg-gray-50"
          onClick={onToggle}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">收起面板</span>
        </Button>
      </div>
    </div>
  )
}
