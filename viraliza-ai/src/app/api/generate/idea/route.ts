import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user profile and generation limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('generation_count, subscription_status')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 })
    }

    // Check generation limit for free users
    if (profile.subscription_status === 'free' && profile.generation_count >= 10) {
      return NextResponse.json({ 
        error: 'Limite de gerações atingido. Faça upgrade para o plano Pro para gerações ilimitadas.' 
      }, { status: 403 })
    }

    const { niche } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Nicho é obrigatório' }, { status: 400 })
    }

    // Generate ideas using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing digital e criação de conteúdo viral para redes sociais. Gere ideias criativas e envolventes para posts."
        },
        {
          role: "user",
          content: `Gere 5 ideias criativas e virais de conteúdo para redes sociais no nicho de "${niche}". Cada ideia deve ser específica, envolvente e ter potencial viral. Retorne apenas as ideias, uma por linha, sem numeração.`
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    const ideas = completion.choices[0].message.content
      ?.split('\n')
      .filter(idea => idea.trim())
      .map(idea => idea.replace(/^\d+\.\s*/, '').trim()) || []

    // Update generation count
    await supabase
      .from('profiles')
      .update({ generation_count: profile.generation_count + 1 })
      .eq('id', user.id)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Ideas generation error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}