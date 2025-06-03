"use client"

import { Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageActionsProps {
  moduleId: string
  onRegenerate: () => void
  onCopy: () => void
}

export function MessageActions({ moduleId, onRegenerate, onCopy }: MessageActionsProps) {
  const [liked, setLiked] = useState<boolean | null>(null)

  const handleLike = () => {
    setLiked(true)
  }

  const handleDislike = () => {
    setLiked(false)
  }

  return (
    <div className="flex items-center gap-1 mt-2 animate-fade-in">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="action-button" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>复制</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`action-button ${liked === true ? "bg-secondary text-primary" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className={`h-4 w-4 ${liked === true ? "text-primary" : ""}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>喜欢</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`action-button ${liked === false ? "bg-secondary text-primary" : ""}`}
              onClick={handleDislike}
            >
              <ThumbsDown className={`h-4 w-4 ${liked === false ? "text-primary" : ""}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>不喜欢</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="action-button" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>重新生成</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
