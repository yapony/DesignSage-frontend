import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { message, moduleId } = await request.json()

  // 创建一个 TransformStream 用于流式响应
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // 模拟流式响应
  const sendChunk = async (text: string) => {
    await writer.write(encoder.encode(text))
  }

  // 这里应该是实际的 AI 响应逻辑
  // 现在只是模拟流式响应
  const response = "这是一个模拟的流式响应。"
  const chunks = response.split('')
  
  for (const chunk of chunks) {
    await sendChunk(chunk)
    await new Promise(resolve => setTimeout(resolve, 100)) // 模拟延迟
  }

  await writer.close()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
} 