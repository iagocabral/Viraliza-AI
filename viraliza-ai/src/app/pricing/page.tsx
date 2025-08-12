'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { useAuth } from '@/contexts/MockAuthContext'

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_id: 'price_pro_monthly', // This would be your actual Stripe price ID
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        alert('Erro ao iniciar checkout')
      }
    } catch (err) {
      alert('Erro ao iniciar checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-purple-600">Viraliza.ai</h1>
          </Link>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/signup">
                  <Button>Começar Grátis</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar de mais gerações
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
              <CardDescription>Perfeito para começar</CardDescription>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                R$ 0
                <span className="text-lg text-gray-500 font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>10 gerações por mês</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Gerador de ideias</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Criador de legendas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Suporte por email</span>
                </div>
              </div>
              <Link href={user ? "/dashboard" : "/signup"}>
                <Button variant="outline" className="w-full mt-6">
                  {user ? "Ir para Dashboard" : "Começar Grátis"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-purple-200 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Plano Pro</CardTitle>
              <CardDescription>Para criadores sérios</CardDescription>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                R$ 29
                <span className="text-lg text-gray-500 font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="font-medium">Gerações ilimitadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Gerador de ideias</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Criador de legendas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Gerador de hashtags</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Criador de roteiros</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Suporte prioritário</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Histórico de gerações</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Assinar Agora'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Perguntas Frequentes
          </h3>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. 
                  Não há compromisso de longo prazo.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que acontece se eu exceder o limite gratuito?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No plano gratuito, você tem 10 gerações por mês. Após atingir esse limite, 
                  você precisará fazer upgrade para o plano Pro para continuar gerando conteúdo.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Utilizamos o Stripe para processar pagamentos de forma segura. 
                  O plano Pro é cobrado mensalmente e você pode cancelar a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}