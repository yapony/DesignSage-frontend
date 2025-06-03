"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X, ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMobile } from "@/hooks/use-mobile"
import { FunctionButton } from "@/components/function-button"

interface ChatHistory {
  id: string
  name: string
  messages: any[]
  module: string
}

interface SidebarProps {
  moduleId: string
  moduleName: string
  moduleIcon: React.ReactNode
  activeChatId: string | null
  setActiveChatId: (id: string | null) => void
  startNewChat: () => void
  activeFunction: string
  setActiveFunction: (functionId: string) => void
  functions: Array<{ id: string; label: string }>
}

export function Sidebar({
  moduleId,
  moduleName,
  moduleIcon,
  activeChatId,
  setActiveChatId,
  startNewChat,
  activeFunction,
  setActiveFunction,
  functions,
}: SidebarProps) {
  const router = useRouter()
  const isMobile = useMobile()
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingChatName, setEditingChatName] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load chat histories from localStorage or an API
    const loadHistories = () => {
      // In a real app, this would be fetched from an API or database
      // For demo purposes, we'll simulate some chat histories
      const historiesFromStorage = localStorage.getItem(`chatHistories-${moduleId}`)
      if (historiesFromStorage) {
        setChatHistories(JSON.parse(historiesFromStorage))
      } else {
        const defaultHistories: ChatHistory[] = [
          {
            id: `${moduleId}-history1`,
            name: `${moduleName}对话1`,
            messages: [],
            module: moduleId,
          },
          {
            id: `${moduleId}-history2`,
            name: `${moduleName}对话2`,
            messages: [],
            module: moduleId,
          },
        ]
        setChatHistories(defaultHistories)
        localStorage.setItem(`chatHistories-${moduleId}`, JSON.stringify(defaultHistories))
      }
    }

    loadHistories()
  }, [moduleId, moduleName])

  useEffect(() => {
    // Focus the edit input when it appears
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingChatId])

  const saveChatsToStorage = (chats: ChatHistory[]) => {
    localStorage.setItem(`chatHistories-${moduleId}`, JSON.stringify(chats))
  }

  const loadChatHistory = (chatId: string) => {
    // Don't load if we're currently editing a chat name
    if (editingChatId) return

    // Find the chat in histories
    const chat = chatHistories.find((c) => c.id === chatId)
    if (chat) {
      // Move this chat to the top of the list
      const updatedHistories = [chat, ...chatHistories.filter((c) => c.id !== chatId)]

      setChatHistories(updatedHistories)
      saveChatsToStorage(updatedHistories)

      // Set as active chat
      setActiveChatId(chatId)
    }
  }

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    // Prevent the click from propagating to the parent (which would select the chat)
    e.stopPropagation()

    // Ask for confirmation
    if (window.confirm("确定要删除这个对话吗？")) {
      // Remove the chat from histories
      const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId)
      setChatHistories(updatedHistories)
      saveChatsToStorage(updatedHistories)

      // If the active chat is being deleted, reset to new chat state
      if (activeChatId === chatId) {
        startNewChat()
      }
    }
  }

  const startEditChatName = (chatId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditingChatName(currentName)
  }

  const saveEditedChatName = () => {
    if (editingChatId && editingChatName.trim()) {
      const updatedHistories = chatHistories.map((chat) =>
        chat.id === editingChatId ? { ...chat, name: editingChatName.trim() } : chat,
      )
      setChatHistories(updatedHistories)
      saveChatsToStorage(updatedHistories)
    }
    setEditingChatId(null)
    setEditingChatName("")
  }

  const cancelEditChatName = () => {
    setEditingChatId(null)
    setEditingChatName("")
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      saveEditedChatName()
    } else if (e.key === "Escape") {
      cancelEditChatName()
    }
  }

  return (
    <div className="sidebar-container">
      <div className={`sidebar sidebar-${moduleId} w-full flex flex-col h-full`}>
        <div className="p-4 flex items-center space-x-3">
          <div className={`module-icon module-icon-${moduleId}`}>{moduleIcon}</div>
          <span className={`sidebar-title sidebar-title-${moduleId}`}>{moduleName}</span>
        </div>

        <div className="p-4 space-y-2">
          {functions.map((func) => (
            <FunctionButton
              key={func.id}
              label={func.label}
              isActive={activeFunction === func.id}
              moduleId={moduleId}
              onClick={() => setActiveFunction(func.id)}
            />
          ))}
        </div>

        <div className="px-4 py-2">
          <div className="text-xs font-medium text-gray-500 mb-2">最近对话</div>
        </div>

        <div className="flex-1 overflow-auto px-2">
          {chatHistories.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 cursor-pointer hover:bg-white/60 rounded-lg transition-colors my-1 ${
                activeChatId === chat.id ? `bg-white/70 border-l-2 sidebar-item-${moduleId}` : ""
              }`}
              onClick={() => loadChatHistory(chat.id)}
            >
              <div className="flex justify-between items-center">
                {editingChatId === chat.id ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <Input
                      ref={editInputRef}
                      value={editingChatName}
                      onChange={(e) => setEditingChatName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="h-8 py-0 text-sm rounded-lg bg-white/90"
                    />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={saveEditedChatName}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={cancelEditChatName}>
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className={`truncate text-sm flex-1 text-gray-700`}>{chat.name}</div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100 rounded-full text-gray-500 hover:text-gray-700"
                              onClick={(e) => startEditChatName(chat.id, chat.name, e)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>重命名</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100 rounded-full text-gray-500 hover:text-gray-700"
                              onClick={(e) => deleteChat(chat.id, e)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>删除</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className="back-button flex items-center text-sm rounded-lg w-full justify-start"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    </div>
  )
}
