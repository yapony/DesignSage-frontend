"use client"

import { useState } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { createChatMessage } from "@/lib/api"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  functionType?: string
}

export default function ChatPage({ params }: { params: { moduleId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")

  const handleSendMessage = async (message: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // 添加一个空的助手消息，用于显示加载状态
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])
    setIsResponding(true)

    try {
      await createChatMessage(
        message,
        params.moduleId,
        (text) => {
          setCurrentMessage(prev => prev + text)
          // 更新最后一条消息的内容
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = currentMessage + text
            }
            return newMessages
          })
        },
        (error) => {
          console.error(error)
          setIsResponding(false)
        }
      )
    } finally {
      setIsResponding(false)
      setCurrentMessage("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            moduleId={params.moduleId}
            isLoading={isResponding && index === messages.length - 1}
          />
        ))}
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        moduleId={params.moduleId}
        isResponding={isResponding}
      />
    </div>
  )
} 