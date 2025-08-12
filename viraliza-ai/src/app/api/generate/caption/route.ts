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

    const { description, tone } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 })
    }

    // Generate captions using OpenAI
    const toneText = tone ? ` com tom ${tone}` : ''
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em copywriting para redes sociais. Crie legendas envolventes, com call-to-action e que aumentem o engajamento."
        },
        {
          role: "user",
          content: `Crie 3 legendas diferentes para uma postagem sobre: "${description}"${toneText}. 

Cada legenda deve:
- Ser envolvente e viral
- Incluir emojis apropriados
- Ter um call-to-action
- Ser otimizada para engajamento
- Ter entre 50-150 palavras

Formate cada legenda claramente separada.`
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    })

    const content = completion.choices[0].message.content || ''
    const captions = content
      .split(/\n\s*\n/)
      .filter(caption => caption.trim())
      .map(caption => caption.trim())

    // Update generation count
    await supabase
      .from('profiles')
      .update({ generation_count: profile.generation_count + 1 })
      .eq('id', user.id)

    return NextResponse.json({ captions })
  } catch (error) {
    console.error('Caption generation error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}