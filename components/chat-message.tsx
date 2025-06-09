import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageActions } from "@/components/message-actions"
import ReactMarkdown from 'react-markdown'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown-light.css'
import { cn } from "@/lib/utils"
import { FileCard } from "@/components/file-card"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  functionType?: string
  files?: { url: string }[]
  message_files?: { name?: string; file_name?: string; url: string; size?: number; type?: string }[]
}

interface ChatMessageProps {
  message: Message
  moduleId: string
  isLoading?: boolean
}

// 加载动画组件
function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0s" }}></div>
      <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      <div className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
    </div>
  )
}

// Result 卡片组件
function ResultCard({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-[#F8F8FF] border border-[#E5E7EB] rounded-xl px-4 py-3 mt-2 text-sm hover:bg-[#F3F4F6] transition"
      style={{ textAlign: 'left', wordBreak: 'break-all' }}
    >
      <div className="text-[#7C3AED] font-medium">{title}</div>
    </a>
  )
}

export function ChatMessage({ message, moduleId, isLoading }: ChatMessageProps) {
  console.log('ChatMessage markdown content:', message.content)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const handleRegenerate = () => {
    // In a real app, this would trigger regeneration of the AI response
    alert("将重新生成回复")
  }

  // 1. 兼容结构化 files/message_files
  let files = (message.files && message.files.length > 0)
    ? message.files
    : (message.message_files && message.message_files.length > 0)
      ? message.message_files.map((f: any) => ({
          name: f.name || f.file_name || '文件',
          url: f.url,
          size: f.size,
          type: f.type,
        }))
      : []

  // 2. 自动识别 Markdown 文件链接
  let content = message.content
  const fileLinkRegex = /\[([^\]]+\.(docx|pdf|xlsx|xls|pptx|ppt|zip|rar|txt|md|csv))\]\((https?:\/\/[^\)]+)\)/gi
  let match
  while ((match = fileLinkRegex.exec(message.content)) !== null) {
    files.push({
      name: match[1],
      url: match[3],
    })
    // 从内容中移除该链接
    content = content.replace(match[0], '')
  }

  // 3. 识别 Result 卡片
  let resultCards: { title: string; url: string }[] = []
  if (message.role === 'assistant' && message.content && message.content.includes('Result')) {
    // 支持多条 result，匹配新的 Markdown 格式
    const resultRegex = /### Result \d+:\s*\[([^\]]+)\]\(([^\)]+)\)/g
    let m
    while ((m = resultRegex.exec(message.content)) !== null) {
      resultCards.push({
        title: m[1].trim(),
        url: m[2].trim()
      })
    }
    // 移除 result 部分内容，包括 URL、Relevance Score 和 Content
    if (resultCards.length > 0) {
      content = content.replace(/### Result \d+:\s*\[([^\]]+)\]\(([^\)]+)\)(?:\s*\*\*URL:\*\*\s*[^\n]+)?(?:\s*\*\*Relevance Score:\*\*\s*[^\n]+)?(?:\s*\*\*Content:\*\*\s*[^\n]+)?/g, '')
      // 新增：移除分隔线和多余空行
      content = content
        .replace(/^(\s*)(---|\*\*\*|___|<hr\s*\/?>)(\s*)$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+|\s+$/g, '');
    }
  }

  // 如果是加载状态且是助手消息，显示加载动画
  if (isLoading && message.role === "assistant") {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="flex flex-col items-start gap-1 max-w-[80%]">
          {message.functionType && (
            <Badge variant="outline" className="function-tag mb-1">
              {message.functionType}
            </Badge>
          )}
          <div className="flex items-start gap-2">
            <Avatar className={cn("h-8 w-8", `${moduleId}-gradient`, "text-white")}>
              <div className="flex h-full w-full items-center justify-center text-xs">AI</div>
            </Avatar>
            <div className="chat-message-ai rounded-2xl rounded-tl-sm p-4">
              <LoadingDots />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex",
      message.role === "user" ? "justify-end" : "justify-start",
      "animate-fade-in"
    )}>
      <div className={cn(
        "flex flex-col items-start gap-1 max-w-[80%]",
        message.role === "user" ? "items-end" : ""
      )}>
        {message.role === "assistant" && message.functionType && (
          <Badge 
            variant="outline" 
            className={cn("function-tag mb-1", message.moduleId ? `function-tag-${message.moduleId}` : '')}
          >
            {message.functionType}
          </Badge>
        )}
        <div className={cn(
          "flex items-start gap-2",
          message.role === "user" ? "flex-row-reverse" : ""
        )}>
          {message.role === "assistant" && (
            <Avatar className={cn("h-8 w-8", `${moduleId}-gradient`, "text-white")}>
              <div className="flex h-full w-full items-center justify-center text-xs">AI</div>
            </Avatar>
          )}
          <div className={cn(
            "rounded-2xl p-4",
            message.role === "user" 
              ? "chat-message-user rounded-tr-sm" 
              : "chat-message-ai rounded-tl-sm"
          )}>
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
                rehypePlugins={[RehypeKatex]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={atelierHeathLight}
                        language={match[1]}
                        showLineNumbers
                        PreTag="div"
                      />
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                  },
                  a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            {/* 文件卡片展示，放在消息内容后面 */}
            {files.length > 0 && (
              <div className="mt-2">
                {files.map((file, idx) => (
                  <FileCard key={file.url + idx} file={file} />
                ))}
              </div>
            )}
            {/* Result 卡片展示，放在消息内容后面 */}
            {resultCards.length > 0 && (
              <div className="mt-2 space-y-2">
                {resultCards.map((r, idx) => (
                  <ResultCard key={r.url + idx} title={r.title} url={r.url} />
                ))}
              </div>
            )}
          </div>
        </div>
        {message.role === "assistant" && (
          <MessageActions
            moduleId={moduleId}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </div>
  )
}
