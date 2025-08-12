import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessageSquare, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Viraliza.ai</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Conteúdo Viral para suas{" "}
            <span className="text-purple-600">Redes Sociais</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Use inteligência artificial para gerar ideias criativas e legendas envolventes 
            que aumentam o engajamento nas suas redes sociais.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Começar Grátis
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Ver Preços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Ferramentas Poderosas para Criadores de Conteúdo
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Lightbulb className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Gerador de Ideias</CardTitle>
                <CardDescription>
                  Receba ideias criativas e personalizadas para o seu nicho
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Criador de Legendas</CardTitle>
                <CardDescription>
                  Gere legendas envolventes que aumentam o engajamento
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>IA Avançada</CardTitle>
                <CardDescription>
                  Powered by GPT-4, a mais avançada inteligência artificial
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">
            Comece Grátis Hoje
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            10 gerações gratuitas por mês. Upgrade quando precisar de mais.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Viraliza.ai. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
