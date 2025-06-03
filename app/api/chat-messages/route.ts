import { NextRequest, NextResponse } from 'next/server'
import { API_KEY, API_URL, APP_ID } from '@/config'

function getUserId(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value || Math.random().toString(36).slice(2) + Date.now()
  return `user_${APP_ID}:${sessionId}`
}

export async function POST(request: NextRequest) {
  if (!API_URL) {
    console.error('API_URL is not configured')
    return NextResponse.json({ error: 'API_URL is not configured' }, { status: 500 })
  }
  if (!API_KEY) {
    console.error('API_KEY is not configured')
    return NextResponse.json({ error: 'API_KEY is not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { inputs, query, conversation_id, response_mode } = body
    const user = getUserId(request)

    console.log('Received request body:', body)

    const response = await fetch(`${API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        query,
        conversation_id,
        response_mode,
        user
      })
    })

    // 如果是流式响应，直接返回原始响应
    if (response_mode === 'streaming') {
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Streaming API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        return NextResponse.json({ 
          error: `API Error: ${response.status} ${response.statusText}`,
          details: errorText
        }, { status: response.status })
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Chat messages API error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
} 