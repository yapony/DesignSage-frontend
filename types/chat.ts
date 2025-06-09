import { FunctionType } from './function'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  functionType?: FunctionType
  moduleId?: string
}

export interface ChatHistory {
  id: string
  name: string
  messages: Message[]
  module: string
  function: string
} 