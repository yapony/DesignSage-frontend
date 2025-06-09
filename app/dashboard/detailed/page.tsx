"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Menu, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { FunctionButton } from "@/components/function-button"
import { FeaturePanel } from "@/components/feature-panel"
import { getConversations, getConversationMessages, createChatMessage, renameConversation, generateConversationName } from '@/lib/api/dify'
import { getFunctionTypeFromInputs } from '@/lib/utils/function'
import { Message } from '@/types/chat'
import { FunctionType } from '@/types/function'
import { toast } from "@/components/ui/use-toast"

export default function Detailed_design() {
  const router = useRouter()
  const isMobile = useMobile()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeFunction, setActiveFunction] = useState<FunctionType>("detailed_design_knowledge")
  const [showFeaturePanel, setShowFeaturePanel] = useState(true)
  const [reportContent, setReportContent] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistories, setChatHistories] = useState<any[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const [conversationIdChangeBecauseOfNew, setConversationIdChangeBecauseOfNew] = useState(false)
  const [inputs, setInputs] = useState<{
    Mode: string
    internet_needed: number
    Report_needed: number
  }>({
    Mode: 'Detailed_design',
    internet_needed: 0,
    Report_needed: 0,
  })

  // 功能类型中文映射
  const functionTypeMap: Record<string, string> = {
    'detailed_design_knowledge': '设计规范问答',
    'web_search_query': '实现方案探索',
    'report_generation': '详细设计方案生成',
  }

  // richContent for 设计规范问答
  const designStandardRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#E25AD3' }}>设计规范问答</div>
      <div className="text-gray-700 mb-3">基于专业知识库，为你提供标准规范查询、技术要求解析和详细设计指导，确保设计向生产制造顺利过渡。</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">标准规范</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">技术要求</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">设计细节</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">工艺指南</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"我需要车用外饰件的外观标准或要求"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"电动汽车内饰面板的环保表面处理工艺有哪些？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"新能源汽车电池热管理系统设计需要遵循哪些国家标准？"</div>
      </div>
    </div>
  )
  // richContent for 实现方案探索
  const dynamicQueryRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#E25AD3' }}>实现方案探索</div>
      <div className="text-gray-700 mb-3">通过联网搜索获取最新技术解决方案、材料应用和生产工艺信息。</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">技术方案</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">材料/工艺信息</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"大尺寸车载触控屏的制造工艺有哪些？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"3D打印技术在电动汽车内饰零部件中的应用现状如何？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"电动汽车轻量化材料的最新应用趋势是什么？"</div>
      </div>
    </div>
  )
  // richContent for 详细设计报告生成
  const reportGenerationRichContent = (
<div>
      <div className="font-bold text-base mb-1" style={{ color: '#E25AD3' }}>详细设计方案生成</div>
      <div className="text-gray-700 mb-3">基于您在详细设计模块下的当前一次聊天历史，智能生成结构化的详细设计方案，便于团队沟通和方案推进。</div>
      <div className="mb-2">
        <span className="font-semibold">方案内容包括</span>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">项目背景：概述产品定位与设计目标</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">技术规范：适用标准与设计边界条件</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">详细结构设计：核心部件设计参数与规格</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">材料规格：材料选择、性能要求与替代方案</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">工艺流程：推荐生产工艺与质量控制点</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">成本估算：主要成本构成与优化空间</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">实施计划：阶段性目标与时间节点</div>
      </div>
    </div>
  )

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const loadChatHistories = async () => {
      try {
        const { data } = await getConversations()
        // 只显示Mode为Detailed_design的会话
        const filtered = data.filter((item: any) => item.inputs?.Mode === 'Detailed_design')
        setChatHistories(filtered)
      } catch (error) {
        console.error('加载对话历史失败:', error)
      }
    }
    loadChatHistories()
  }, [activeFunction])

  useEffect(() => {
    // 页面初始化时，重置 activeChatId
    setActiveChatId('-1');
    setHasStartedChat(false);
  }, []);

  const startNewChat = async (customInputs?: any) => {
    setActiveChatId('-1');
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setConversationIdChangeBecauseOfNew(true);
    const useInputs = customInputs || inputs;
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: `欢迎使用详细设计助手！`,
      role: 'assistant',
      timestamp: new Date(),
      functionType: activeFunction
    };
    setMessages([welcomeMessage]);
    setHasStartedChat(true);
    setInputs(useInputs);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isResponding) return;
    if (messages.length === 1 && messages[0].role === 'assistant') {
      await startNewChat();
    }
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      role: 'user',
      timestamp: new Date(),
      functionType: activeFunction
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsResponding(true);
    let sendInputs = { ...inputs };
    if (activeFunction === 'web_search_query') {
      sendInputs.internet_needed = 1;
      sendInputs.Report_needed = 0;
    } else if (activeFunction === 'report_generation') {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 1;
    } else {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 0;
    }
    sendInputs.Mode = 'Detailed_design';
    try {
      const response = await createChatMessage(message, 'detailed', activeFunction, activeChatId === '-1' ? null : activeChatId, undefined, sendInputs);
      let gotConversationId = false;
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法获取响应流');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            let data;
            try {
              data = JSON.parse(dataStr);
            } catch (e) {
              continue;
            }
            if (!gotConversationId && data.conversation_id) {
              setActiveChatId(data.conversation_id);
              gotConversationId = true;
              // 生成对话名称
              if (conversationIdChangeBecauseOfNew) {
                const name = await generateConversationName(data.conversation_id);
                if (name) {
                  await renameConversation(data.conversation_id, name);
                }
              }
            }
            if (data.answer) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (!last || last.role !== 'assistant') {
                  updated.push({
                    id: `assistant-${Date.now()}`,
                    content: data.answer,
                    role: 'assistant',
                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                    functionType: activeFunction,
                    moduleId: 'detailed'
                  });
                } else {
                  updated[updated.length - 1] = { ...last, content: last.content + data.answer };
                }
                return updated;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "抱歉，发送消息时出现错误，请稍后重试。",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsResponding(false);
    }
  };

  const updateChatHistoryInStorage = (chatId: string, updatedMessages: Message[]) => {
    const historiesFromStorage = localStorage.getItem(`chatHistories-detailed`)

    if (historiesFromStorage) {
      const histories = JSON.parse(historiesFromStorage)

      // Find the chat to update
      const chatToUpdate = histories.find((chat: any) => chat.id === chatId)

      if (chatToUpdate) {
        // Update its messages
        chatToUpdate.messages = updatedMessages

        // Create a new array with the updated chat first, followed by all other chats
        const updatedHistories = [chatToUpdate, ...histories.filter((chat: any) => chat.id !== chatId)]

        // Save back to storage
        localStorage.setItem(`chatHistories-detailed`, JSON.stringify(updatedHistories))
      }
    }
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const toggleFeaturePanel = () => {
    setShowFeaturePanel(!showFeaturePanel)
  }

  const handleFunctionChange = (functionType: FunctionType) => {
    setActiveFunction(functionType)
    setShowFeaturePanel(true)
    let newInputs = { Mode: 'Detailed_design', internet_needed: 0, Report_needed: 0 }
    if (functionType === 'web_search_query') newInputs.internet_needed = 1
    if (functionType === 'report_generation') newInputs.Report_needed = 1
    setInputs(newInputs)
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `欢迎使用详细设计助手！`,
        role: 'assistant',
        timestamp: new Date(),
        functionType: functionType
      }
      setMessages([welcomeMessage])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  const handleChatSelect = async (chatId: string) => {
    if (chatId === '-1') {
      await startNewChat()
      return
    }
    setActiveChatId(chatId)
    setConversationIdChangeBecauseOfNew(false)
    setActiveFunction('detailed_design_knowledge')
    setShowFeaturePanel(true)
    setInputs({
      Mode: 'Detailed_design',
      internet_needed: 0,
      Report_needed: 0
    })
    try {
      const { data } = await getConversationMessages(chatId)
      const chatMessages: Message[] = []
      data.forEach((item: any) => {
        if (item.query) {
          chatMessages.push({
            id: `user-${item.id}`,
            content: item.query,
            role: 'user',
            timestamp: item.created_at,
            functionType: getFunctionTypeFromInputs(item.inputs || {})
          })
        }
        if (item.answer) {
          chatMessages.push({
            id: `assistant-${item.id}`,
            content: item.answer,
            role: 'assistant',
            timestamp: item.created_at,
            functionType: getFunctionTypeFromInputs(item.inputs || {})
          })
        }
      })
      setMessages(chatMessages)
    } catch (error) {
      console.error('Failed to load chat messages:', error)
      toast({
        title: '加载失败',
        description: '无法加载对话消息，请稍后重试',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    // If no active chat, start a new one automatically
    if (!activeChatId && !hasStartedChat) {
      startNewChat()
    }
  }, [activeChatId, hasStartedChat])

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      {(showSidebar || !isMobile) && (
        <div className="w-64 border-r border-border/10 sidebar-detailed flex flex-col h-full">
          <div className="p-4 flex items-center space-x-3 border-b border-border/10">
            <div className="module-icon module-icon-detailed">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="sidebar-title sidebar-title-detailed">详细设计</span>
          </div>

          <div className="p-4 space-y-2">
            <FunctionButton
              label="设计规范问答"
              isActive={activeFunction === "detailed_design_knowledge"}
              moduleId="detailed"
              onClick={() => handleFunctionChange("detailed_design_knowledge")}
            />
            <FunctionButton
              label="实现方案探索"
              isActive={activeFunction === "web_search_query"}
              moduleId="detailed"
              onClick={() => handleFunctionChange("web_search_query")}
            />
            <FunctionButton
              label="详细设计方案生成"
              isActive={activeFunction === "report_generation"}
              moduleId="detailed"
              onClick={() => handleFunctionChange("report_generation")}
            />
          </div>

          <div className="border-t border-border/10 mt-2 pt-2 px-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">最近对话</h3>
            <div className="space-y-1 overflow-auto flex-1">
              <div
                key="-1"
                className={`p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer ${
                  activeChatId === '-1' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleChatSelect('-1')}
              >
                新对话
              </div>
              {chatHistories.slice(0, 3).map((chat) => (
                <div
                  key={chat.id}
                  className={`p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer ${
                    chat.id === activeChatId ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  {chat.name}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              className="back-button flex items-center text-sm rounded-lg w-full justify-start"
              onClick={() => router.push("/dashboard")}
            >
              <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
              返回
            </Button>
          </div>
        </div>
      )}

      {/* Middle Feature Panel */}
      <FeaturePanel
        isOpen={showFeaturePanel}
        onToggle={toggleFeaturePanel}
        reportContent={reportContent || undefined}
        moduleId="detailed"
        richContent={activeFunction === 'detailed_design_knowledge' ? designStandardRichContent : activeFunction === 'web_search_query' ? dynamicQueryRichContent : activeFunction === 'report_generation' ? reportGenerationRichContent : undefined}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full main-content">
        <header className="border-b border-border/5 bg-white">
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              {!showFeaturePanel && (
                <Button variant="ghost" size="sm" onClick={toggleFeaturePanel} className="text-sm">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  查看功能介绍
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto chat-area">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, idx) => (
              <ChatMessage
                key={message.id}
                message={{ ...message, functionType: functionTypeMap[message.functionType || activeFunction] || '' }}
                moduleId="detailed"
                isLoading={isLoading && idx === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部输入区域：仅在 report-generation 功能下显示按钮，其它功能显示输入框 */}
        {activeFunction === "report_generation" ? (
          <div className="p-6 bg-white">
            <button
              className="w-full h-12 bg-primary text-white rounded-xl text-lg font-semibold transition disabled:opacity-60"
              style={{ background: "#E25AD3" }}
              onClick={() => handleSendMessage("请生成报告或方案")}
              disabled={isResponding}
            >
              方案生成
            </button>
          </div>
        ) : (
          <ChatInput
            onSendMessage={handleSendMessage}
            activeFunction={functionTypeMap[activeFunction] || ''}
            isReportGeneration={activeFunction === "report_generation"}
            moduleId="detailed"
            isDisabled={isLoading}
            isResponding={isResponding}
          />
        )}
      </div>
    </div>
  )
}
