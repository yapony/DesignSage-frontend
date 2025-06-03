"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  activeFunction?: string
  isReportGeneration?: boolean
  moduleId: string
  isDisabled?: boolean
  isResponding?: boolean
}

export function ChatInput({
  onSendMessage,
  activeFunction,
  isReportGeneration = false,
  moduleId,
  isDisabled = false,
  isResponding = false,
}: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim() || isDisabled || isResponding) return
    onSendMessage(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {activeFunction && !isReportGeneration && (
          <div className="mb-2">
            <Badge variant="outline" className={cn("text-xs py-1 px-3", `function-tag-${moduleId}`)}>
              {activeFunction}
            </Badge>
          </div>
        )}
        <div className="chat-input-container relative">
          <Input
            placeholder={isDisabled ? "此功能不需要输入..." : isResponding ? "AI 正在回复..." : "输入消息..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "border-none shadow-none focus-visible:ring-0 h-10",
              isResponding && "opacity-50"
            )}
            disabled={isDisabled || isResponding}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isDisabled || isResponding}
            className={cn(
              `send-button-${moduleId}`,
              isResponding && "opacity-50"
            )}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
