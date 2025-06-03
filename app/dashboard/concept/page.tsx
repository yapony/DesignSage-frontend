"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Menu, ChevronRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { FunctionButton } from "@/components/function-button"
import { FeaturePanel } from "@/components/feature-panel"
import { getConversations, getConversationMessages, createChatMessage, renameConversation, generateConversationName } from '@/lib/api/dify'
import { Message } from '@/types/chat'
import { FunctionType } from '@/types/function'

export default function Conceptual_design() {
  const router = useRouter()
  const isMobile = useMobile()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeFunction, setActiveFunction] = useState<FunctionType>("design-trend")
  const [showFeaturePanel, setShowFeaturePanel] = useState(true)
  const [reportContent, setReportContent] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistories, setChatHistories] = useState<any[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const [conversationIdChangeBecauseOfNew, setConversationIdChangeBecauseOfNew] = useState(false)
  const [inputs, setInputs] = useState({ Mode: 'Conceptual_design', internet_needed: 0, Report_needed: 0, ImageGeneration: 0 })

  // 功能类型中文映射
  const functionTypeMap: Record<string, string> = {
    'design-trend': '设计知识问答',
    'dynamic-query': '设计视野拓展',
    'image-generation': '概念图像生成',
    'report-generation': '概念设计报告生成',
  }

  // richContent for 设计趋势分析
  const designTrendRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#5A80E2' }}>设计知识问答</div>
      <div className="text-gray-700 mb-3">通过实时联网搜索，为您提供最新设计趋势、创新案例和行业前沿信息，拓展设计思路，激发创意灵感</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">设计理念</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">设计方案</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">设计原则</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">案例分析</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近年来电动汽车外观设计有哪些主要趋势？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"对比分析特斯拉ModelY和蔚来EDG的外观设计"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"请告诉我特斯拉ModelY的设计理念"</div>
      </div>
    </div>
  )
  // richContent for 设计视野拓展
  const designVisionRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#5A80E2' }}>设计视野拓展</div>
      <div className="text-gray-700 mb-3">通过实时联网搜索，为您提供最新设计趋势、创新案例和行业前沿信息，拓展设计思路，激发创意灵感。</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">设计趋势</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">创新案例</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">行业前沿</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近一年发布的新能源汽车座舱设计案例分析"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近一年发布的新能源车型外形设计分析和趋势"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"消费电子产品的交互设计趋势如何影响最新电动汽车的界面设计？"</div>
      </div>
    </div>
  )
  // richContent for 概念图像生成
  const imageGenerationRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#5A80E2' }}>概念图像生成</div>
      <div className="text-gray-700 mb-3">根据您的描述，生成符合设计风格的概念图像，帮助您快速可视化设计想法。</div>
      <div className="mb-2">
        <span className="font-semibold">建议描述要素</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">风格</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">元素</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">用途</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">描述示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"极简风格，蓝色主色调，适用于智能手表界面"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"未来感元素，适合新能源汽车中控屏"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"自然风格，带有木纹和绿色植物元素"</div>
      </div>
    </div>
  )
  // richContent for 概念设计报告生成
  const reportGenerationRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#5A80E2' }}>概念设计方案生成</div>
      <div className="text-gray-700 mb-3">基于您在概念设计模块下的当前一次聊天历史，智能生成结构化的概念设计方案，便于团队沟通和方案推进。</div>
      <div className="mb-2">
        <span className="font-semibold">方案内容包括</span>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">项目背景：概述产品定位与设计目标</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">设计理念：核心设计思想与价值主张</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">美学方向：设计语言、风格定位与视觉特征</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">创新亮点：差异化设计元素与创新点</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">发展路径：设计方案的进一步完善建议</div>
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
        // 只显示Mode为Conceptual_design的会话
        const filtered = data.filter((item: any) => item.inputs?.Mode === 'Conceptual_design')
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
      content: `欢迎使用概念设计助手！`,
      role: 'assistant',
      timestamp: new Date(),
      functionType: activeFunction
    };
    setMessages([welcomeMessage]);
    setHasStartedChat(true);
    setInputs(useInputs);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isResponding) return;
    if (messages.length === 1 && messages[0].role === 'assistant') {
      await startNewChat();
    }
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      functionType: activeFunction
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsResponding(true);
    let sendInputs = { ...inputs };
    if (activeFunction === 'dynamic-query') {
      sendInputs.internet_needed = 1;
      sendInputs.Report_needed = 0;
      sendInputs.ImageGeneration = 0;
    } else if (activeFunction === 'report-generation') {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 1;
      sendInputs.ImageGeneration = 0;
    } else if (activeFunction === 'image-generation') {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 0;
      sendInputs.ImageGeneration = 1;
    } else {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 0;
      sendInputs.ImageGeneration = 0;
    }
    sendInputs.Mode = 'Conceptual_design';
    try {
      const response = await createChatMessage(content, 'concept', activeFunction, activeChatId === '-1' ? null : activeChatId, undefined, sendInputs);
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
                    functionType: activeFunction
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

  const handleChatSelect = async (chatId: string) => {
    if (chatId === '-1') {
      await startNewChat()
      return
    }
    setActiveChatId(chatId)
    setConversationIdChangeBecauseOfNew(false)
    setActiveFunction('design-trend')
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
            functionType: item.functionType || 'design-trend'
          })
        }
        if (item.answer) {
          chatMessages.push({
            id: `assistant-${item.id}`,
            content: item.answer,
            role: 'assistant',
            timestamp: item.created_at,
            functionType: item.functionType || 'design-trend'
          })
        }
      })
      setMessages(chatMessages)
    } catch (error) {
      console.error('加载对话消息失败:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "加载对话消息失败，请重试",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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
    let newInputs = { Mode: 'Conceptual_design', internet_needed: 0, Report_needed: 0, ImageGeneration: 0 }
    if (functionType === 'dynamic-query') newInputs.internet_needed = 1
    if (functionType === 'report-generation') newInputs.Report_needed = 1
    if (functionType === 'image-generation') newInputs.ImageGeneration = 1
    setInputs(newInputs)
    // 新增：如果只有欢迎消息，刷新它
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `欢迎使用概念设计助手！`,
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
        <div className="w-64 border-r border-border/10 sidebar-concept flex flex-col h-full">
          <div className="p-4 flex items-center space-x-3 border-b border-border/10">
            <div className="module-icon module-icon-concept">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="sidebar-title sidebar-title-concept">概念设计</span>
          </div>

          <div className="p-4 space-y-2">
            <FunctionButton
              label="设计知识问答"
              isActive={activeFunction === "design-trend"}
              moduleId="concept"
              onClick={() => handleFunctionChange("design-trend")}
            />
            <FunctionButton
              label="设计视野拓展"
              isActive={activeFunction === "dynamic-query"}
              moduleId="concept"
              onClick={() => handleFunctionChange("dynamic-query")}
            />
            <FunctionButton
              label="概念设计报告生成"
              isActive={activeFunction === "report-generation"}
              moduleId="concept"
              onClick={() => handleFunctionChange("report-generation")}
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
        moduleId="concept"
        richContent={activeFunction === 'design-trend' ? designTrendRichContent : activeFunction === 'dynamic-query' ? designVisionRichContent : activeFunction === 'image-generation' ? imageGenerationRichContent : activeFunction === 'report-generation' ? reportGenerationRichContent : undefined}
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
                moduleId="concept"
                isLoading={isLoading && idx === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部输入区域：仅在 report-generation 功能下显示按钮，其它功能显示输入框 */}
        {activeFunction === "report-generation" ? (
          <div className="p-6 bg-white">
            <button
              className="w-full h-12 bg-primary text-white rounded-xl text-lg font-semibold transition disabled:opacity-60"
              style={{ background: "#5A80E2" }}
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
            isReportGeneration={activeFunction === "report-generation"}
            moduleId="concept"
            isDisabled={isLoading}
            isResponding={isResponding}
          />
        )}
      </div>
    </div>
  )
}
