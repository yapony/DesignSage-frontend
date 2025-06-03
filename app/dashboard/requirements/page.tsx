"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Menu, ChevronRight } from "lucide-react"
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

export default function RequirementsAnalysis() {
  const router = useRouter()
  const isMobile = useMobile()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeFunction, setActiveFunction] = useState<FunctionType>("user-research")
  const [showFeaturePanel, setShowFeaturePanel] = useState(true)
  const [reportContent, setReportContent] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistories, setChatHistories] = useState<any[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const [conversationIdChangeBecauseOfNew, setConversationIdChangeBecauseOfNew] = useState(false)
  const [inputs, setInputs] = useState({
    Mode: 'UXResearch',
    internet_needed: 0,
    Report_needed: 0,
    ImageGeneration: 0,
  })

  // 功能类型中文映射
  const functionTypeMap: Record<string, string> = {
    'user-research': '静态需求分析',
    'dynamic-query': '动态需求洞察',
    'report-generation': '需求分析报告生成',
  }

  // richContent for 静态需求分析
  const userResearchRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#8F5AE2' }}>静态需求分析</div>
      <div className="text-gray-700 mb-3">基于专业知识库的智能分析，帮您解析用户需求、市场趋势及产品定位，为设计决策提供可靠依据。</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">用户画像</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">市场分析</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">消费趋势</span>  
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">满意度分析</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"中国新能源汽车的购买群体有哪些？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近年来中国新能源汽车的消费偏好有哪些？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"比亚迪宋PLUS车型的主要用户不满意点有哪些？"</div>
      </div>
    </div>
  )
  // richContent for 动态需求洞察
  const dynamicQueryRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#8F5AE2' }}>动态需求洞察</div>
      <div className="text-gray-700 mb-3">通过实时联网搜索，获取最新产品市场动态与用户评价，为您提供及时的市场洞察与需求趋势。</div>
      <div className="mb-2">
        <span className="font-semibold">建议问题类型</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">最新市场动态</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">最新用户反馈</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">竞品动向</span>
        </div>
      </div>
      <div className="font-semibold mb-1 mt-4">提问示例：</div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近半年固态电池技术在新能源汽车领域有哪些突破和应用进展？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"近半年有哪些新上市的新能源汽车车型？"</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">"最近三个月上市的紧凑型电动SUV用户反馈中，最受好评的功能是什么？"</div>
      </div>
    </div>
  )
  // richContent for 需求分析报告生成
  const reportGenerationRichContent = (
    <div>
      <div className="font-bold text-base mb-1" style={{ color: '#8F5AE2' }}>需求分析报告生成</div>
      <div className="text-gray-700 mb-3">基于您在需求分析模块下的当前一次聊天历史，智能生成结构化的需求分析报告，为设计决策提供系统化的需求依据和市场洞察。</div>
      <div className="mb-2">
        <span className="font-semibold">方案内容包括</span>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">项目背景：概述产品定位与设计目标</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">用户画像：目标用户群体特征与使用场景分析</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">核心需求概述：关键需求点与优先级排序</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">详细需求分析：功能和非功能需求解析</div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-700 text-sm">优先级排序：基于用户价值与可能性的优先级建议</div>
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
    // Load chat histories from localStorage
    const historiesFromStorage = localStorage.getItem(`chatHistories-requirements`)
    if (historiesFromStorage) {
      setChatHistories(JSON.parse(historiesFromStorage))
    }
  }, [])

  useEffect(() => {
    const loadChatHistories = async () => {
      try {
        const { data } = await getConversations()
        // 只显示Mode为UXResearch的会话
        const filtered = data.filter((item: any) => item.inputs?.Mode === 'UXResearch')
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
      content: `欢迎使用需求分析助手！`,
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
    } else {
      sendInputs.internet_needed = 0;
      sendInputs.Report_needed = 0;
      sendInputs.ImageGeneration = 0;
    }
    sendInputs.Mode = 'UXResearch';
    try {
      const response = await createChatMessage(content, 'requirements', activeFunction, activeChatId === '-1' ? null : activeChatId, undefined, sendInputs);
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const toggleFeaturePanel = () => {
    setShowFeaturePanel(!showFeaturePanel)
  }

  const handleFunctionChange = (functionType: FunctionType) => {
    setActiveFunction(functionType)
    setShowFeaturePanel(true)
    let newInputs = { Mode: 'UXResearch', internet_needed: 0, Report_needed: 0, ImageGeneration: 0 }
    if (functionType === 'dynamic-query') newInputs.internet_needed = 1
    if (functionType === 'report-generation') newInputs.Report_needed = 1
    setInputs(newInputs)
    // 新增：如果只有欢迎消息，刷新它
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `欢迎使用需求分析助手！`,
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
    setActiveFunction('user-research')
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
            functionType: item.functionType || 'user-research'
          })
        }
        if (item.answer) {
          chatMessages.push({
            id: `assistant-${item.id}`,
            content: item.answer,
            role: 'assistant',
            timestamp: item.created_at,
            functionType: item.functionType || 'user-research'
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
        <div className="w-64 border-r border-border/10 sidebar-requirements flex flex-col h-full">
          <div className="p-4 flex items-center space-x-3 border-b border-border/10">
            <div className="module-icon module-icon-requirements">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="sidebar-title sidebar-title-requirements">需求分析</span>
          </div>

          <div className="p-4 space-y-2">
            <FunctionButton
              label="静态需求分析"
              isActive={activeFunction === "user-research"}
              moduleId="requirements"
              onClick={() => handleFunctionChange("user-research")}
            />
            <FunctionButton
              label="动态需求洞察"
              isActive={activeFunction === "dynamic-query"}
              moduleId="requirements"
              onClick={() => handleFunctionChange("dynamic-query")}
            />
            <FunctionButton
              label="需求分析报告生成"
              isActive={activeFunction === "report-generation"}
              moduleId="requirements"
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
        moduleId="requirements"
        richContent={activeFunction === 'user-research' ? userResearchRichContent : activeFunction === 'dynamic-query' ? dynamicQueryRichContent : activeFunction === 'report-generation' ? reportGenerationRichContent : undefined}
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
                moduleId="requirements"
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
              style={{ background: "#A78BFA" }}
              onClick={() => handleSendMessage("请生成报告或方案")}
              disabled={isResponding}
            >
              需求报告生成
            </button>
          </div>
        ) : (
          <ChatInput
            onSendMessage={handleSendMessage}
            activeFunction={functionTypeMap[activeFunction] || ''}
            moduleId="requirements"
            isDisabled={isLoading}
            isResponding={isResponding}
          />
        )}
      </div>
    </div>
  )
}
