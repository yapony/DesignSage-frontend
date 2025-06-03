import { NextRequest, NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name } = body

    const response = await fetch(`${API_URL}/conversations/${params.id}/name`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 })
  }
} 