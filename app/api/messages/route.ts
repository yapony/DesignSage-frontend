import { NextRequest, NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_URL}/messages?conversation_id=${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 })
  }
} 