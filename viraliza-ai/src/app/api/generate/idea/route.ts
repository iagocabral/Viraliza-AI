import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Mock user data since we're not using Supabase
const mockProfile = {
  generation_count: 3,
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

    const { niche } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Nicho é obrigatório' }, { status: 400 })
    }

    // Generate ideas using Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Você é um especialista em marketing digital e criação de conteúdo viral para redes sociais. 

Gere 5 ideias criativas e virais de conteúdo para redes sociais no nicho de "${niche}". 

Cada ideia deve ser:
- Específica e detalhada
- Envolvente e com potencial viral
- Prática de implementar
- Focada em engajamento

Retorne apenas as ideias, uma por linha, sem numeração ou marcadores.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const ideas = text
      .split('\n')
      .filter(idea => idea.trim())
      .map(idea => idea.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(idea => idea.length > 10) // Filter out very short lines
      .slice(0, 5) // Ensure we have max 5 ideas

    // Mock update generation count
    mockProfile.generation_count += 1

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Ideas generation error:', error)
    return NextResponse.json({ error: 'Erro ao gerar ideias. Verifique sua API key do Gemini.' }, { status: 500 })
  }
}