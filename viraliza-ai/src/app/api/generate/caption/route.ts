import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Mock user data since we're not using Supabase
const mockProfile = {
  generation_count: 5,
  subscription_status: 'free'
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Mock authentication - always authenticated for testing
    const mockUser = { id: 'mock-user-id', email: 'test@example.com' }

    // Check generation limit for free users (mock)
    if (mockProfile.subscription_status === 'free' && mockProfile.generation_count >= 10) {
      return NextResponse.json({ 
        error: 'Limite de gerações atingido. Faça upgrade para o plano Pro para gerações ilimitadas.' 
      }, { status: 403 })
    }

    const { description, tone } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 })
    }

    // Generate captions using Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const toneText = tone ? ` com tom ${tone}` : ''
    
    const prompt = `Você é um especialista em copywriting para redes sociais. Crie legendas envolventes, com call-to-action e que aumentem o engajamento.

Crie 3 legendas diferentes para uma postagem sobre: "${description}"${toneText}.

Cada legenda deve:
- Ser envolvente e viral
- Incluir emojis apropriados
- Ter um call-to-action
- Ser otimizada para engajamento
- Ter entre 50-150 palavras
- Usar hashtags relevantes

Formate cada legenda claramente separada por linha em branco dupla.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const captions = text
      .split(/\n\s*\n/)
      .filter(caption => caption.trim())
      .map(caption => caption.trim())
      .filter(caption => caption.length > 20) // Filter out very short captions
      .slice(0, 3) // Ensure we have max 3 captions

    // Mock update generation count
    mockProfile.generation_count += 1

    return NextResponse.json({ captions })
  } catch (error) {
    console.error('Caption generation error:', error)
    return NextResponse.json({ error: 'Erro ao gerar legendas. Verifique sua API key do Gemini.' }, { status: 500 })
  }
}