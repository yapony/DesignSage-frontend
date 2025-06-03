import { Download } from "lucide-react"

export function FileCard({ file }: { file: { name: string; url: string; size?: number; type?: string } }) {
  // 文件大小格式化
  const formatSize = (size?: number) => {
    if (!size) return ""
    if (size < 1024) return `${size}B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }

  // 可根据 file.type 显示不同图标，这里简单用 docx 图标
  return (
    <div className="flex items-center bg-gray-50 rounded-lg p-3 mb-2 shadow-sm border border-gray-200 max-w-xs">
      <div className="mr-3">
        <img src="/docx-icon.png" alt="doc" className="w-8 h-8" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium text-sm">{file.name}</div>
        <div className="text-xs text-gray-500">{formatSize(file.size)}</div>
      </div>
      <a
        href={file.url}
        download={file.name}
        className="ml-2 p-2 rounded hover:bg-gray-100 transition"
        title="下载"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="w-5 h-5 text-primary" />
      </a>
    </div>
  )
} 