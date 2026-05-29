import Groq from 'groq-sdk'

// Returns all available API keys in order (primary first, fallback second)
export function getApiKeys(): string[] {
  const keys: string[] = []
  if (process.env.GROQ_API_KEY) keys.push(process.env.GROQ_API_KEY)
  if (process.env.GROQ_API_KEY_2) keys.push(process.env.GROQ_API_KEY_2)
  if (keys.length === 0) throw new Error('No GROQ API keys configured')
  return keys
}

export function getGroqClient(apiKey?: string): Groq {
  const key = apiKey ?? getApiKeys()[0]
  return new Groq({ apiKey: key })
}
