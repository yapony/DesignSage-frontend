import { API_KEY, API_URL, APP_ID } from '@/config'
import { FunctionType } from '@/types/function'

function getUserId() {
  let sessionId = ''
  if (typeof window !== 'undefined') {
    sessionId = localStorage.getItem('session_id') || ''
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now()
      localStorage.setItem('session_id', sessionId)
    }
  }
  return `user_${APP_ID}:${sessionId}`
}

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  functionType?: FunctionType
}

interface Conversation {
  id: string
  name: string
  messages: ChatMessage[]
  module: string
  function: string
}

// 获取会话列表
export const getConversations = async () => {
  if (!API_URL) throw new Error('API_URL is not configured')
  const user = getUserId()
  const response = await fetch(`${API_URL}/conversations?user=${encodeURIComponent(user)}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`)
  }
  return response.json()
}

// 获取会话消息
export const getConversationMessages = async (conversationId: string) => {
  if (!API_URL) throw new Error('API_URL is not configured')
  const user = getUserId()
  const response = await fetch(`${API_URL}/messages?conversation_id=${conversationId}&limit=20&last_id=&user=${encodeURIComponent(user)}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`)
  }
  return response.json()
}

// 创建聊天消息
export const createChatMessage = async (
  message: string,
  moduleId: string,
  activeFunction: FunctionType,
  conversationId: string | null = null,
  files?: any[],
  inputs?: any
) => {
  if (!API_URL) throw new Error('API_URL is not configured')
  const user = getUserId()
  const data = {
    inputs: inputs || {
      module: moduleId,
      function: activeFunction,
    },
    query: message,
    conversation_id: conversationId,
    response_mode: 'streaming',
    user,
    files,
  }
  console.log('createChatMessage 请求体:', data)
  const response = await fetch(`${API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to create chat message: ${response.statusText}`)
  }
  return response
}

// 重命名会话
export const renameConversation = async (conversationId: string, name: string) => {
  if (!API_URL) throw new Error('API_URL is not configured')
  const user = getUserId()
  const response = await fetch(`${API_URL}/conversations/${conversationId}/name?user=${encodeURIComponent(user)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) {
    throw new Error(`Failed to rename conversation: ${response.statusText}`)
  }
  return response.json()
}

// 生成会话名称
export const generateConversationName = async (conversationId: string) => {
  if (!API_URL) throw new Error('API_URL is not configured')
  const user = getUserId()
  const response = await fetch(`${API_URL}/conversations/${conversationId}/name?user=${encodeURIComponent(user)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ auto_generate: true }),
  })
  if (!response.ok) {
    throw new Error(`Failed to generate conversation name: ${response.statusText}`)
  }
  return response.json()
} 