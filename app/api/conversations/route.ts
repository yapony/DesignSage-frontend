import { NextRequest, NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode')

  try {
    const response = await fetch(`${API_URL}/conversations`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    // 过滤出指定mode的会话
    if (mode) {
      data.data = data.data.filter((conversation: any) => 
        conversation.inputs?.Mode === mode
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
} 