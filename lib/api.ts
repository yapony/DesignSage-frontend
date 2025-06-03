export async function streamResponse(response: Response, onData: (text: string) => void) {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No reader available')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value)
      onData(text)
    }
  } finally {
    reader.releaseLock()
  }
}

export async function createChatMessage(
  message: string,
  moduleId: string,
  onData: (text: string) => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        moduleId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    await streamResponse(response, onData)
  } catch (error) {
    onError(error as Error)
  }
} 