import Groq from 'groq-sdk'

// Lazy initialization — only instantiated at request time, not build time
let _groq: Groq | null = null

export function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set')
  }
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return _groq
}
