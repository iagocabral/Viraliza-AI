'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { Lightbulb, MessageSquare, User, LogOut, Zap } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  generation_count: number
  subscription_status: 'free' | 'pro'
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'ideas' | 'captions'>('ideas')
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Ideas generator state
  const [niche, setNiche] = useState('')
  const [ideas, setIdeas] = useState<string[]>([])
  const [ideasLoading, setIdeasLoading] = useState(false)

  // Caption generator state
  const [description, setDescription] = useState('')
  const [tone, setTone] = useState('')
  const [captions, setCaptions] = useState<string[]>([])
  const [captionsLoading, setCaptionsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const generateIdeas = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche.trim()) return

    setIdeasLoading(true)
    try {
      const response = await fetch('/api/generate/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      })

      if (response.ok) {
        const data = await response.json()
        setIdeas(data.ideas)
        fetchProfile() // Update generation count
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao gerar ideias')
      }
    } catch (err) {
      alert('Erro ao gerar ideias')
    } finally {
      setIdeasLoading(false)
    }
  }

  const generateCaptions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setCaptionsLoading(true)
    try {
      const response = await fetch('/api/generate/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, tone }),
      })

      if (response.ok) {
        const data = await response.json()
        setCaptions(data.captions)
        fetchProfile() // Update generation count
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao gerar legendas')
      }
    } catch (err) {
      alert('Erro ao gerar legendas')
    } finally {
      setCaptionsLoading(false)
    }
  }

  const remainingGenerations = profile 
    ? profile.subscription_status === 'pro' 
      ? 'Ilimitado' 
      : Math.max(0, 10 - profile.generation_count)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-purple-600">Viraliza.ai</h1>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                {user?.email}
              </div>
              <div className="text-xs">
                {profile && (
                  <>
                    {remainingGenerations} gerações restantes
                    {profile.subscription_status === 'free' && (
                      <Link href="/pricing" className="text-purple-600 hover:underline ml-2">
                        Upgrade
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Dashboard
          </h2>
          <p className="text-gray-600">
            Comece a criar conteúdo viral para suas redes sociais
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('ideas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ideas'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  Gerador de Ideias
                </div>
              </button>
              <button
                onClick={() => setActiveTab('captions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'captions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Criador de Legendas
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === 'ideas' ? (
                  <>
                    <Lightbulb className="text-purple-600" />
                    Gerador de Ideias
                  </>
                ) : (
                  <>
                    <MessageSquare className="text-purple-600" />
                    Criador de Legendas
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === 'ideas'
                  ? 'Digite seu nicho para receber ideias criativas de conteúdo'
                  : 'Descreva sua ideia e receba legendas envolventes'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === 'ideas' ? (
                <form onSubmit={generateIdeas} className="space-y-4">
                  <div>
                    <Label htmlFor="niche">Nicho</Label>
                    <Input
                      id="niche"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: fitness, culinária, tecnologia..."
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={ideasLoading || Boolean(profile && profile.subscription_status === 'free' && profile.generation_count >= 10)}
                  >
                    {ideasLoading ? 'Gerando...' : 'Gerar Ideias'}
                    <Zap className="ml-2" size={16} />
                  </Button>
                </form>
              ) : (
                <form onSubmit={generateCaptions} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição do Conteúdo</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva a ideia do seu post..."
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tone">Tom (opcional)</Label>
                    <Input
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="Ex: engraçado, motivacional, informativo..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={captionsLoading || Boolean(profile && profile.subscription_status === 'free' && profile.generation_count >= 10)}
                  >
                    {captionsLoading ? 'Gerando...' : 'Gerar Legendas'}
                    <Zap className="ml-2" size={16} />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'ideas' ? (
                <div className="space-y-4">
                  {ideas.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Digite seu nicho e clique em &quot;Gerar Ideias&quot; para começar
                    </p>
                  ) : (
                    ideas.map((idea, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm">{idea}</p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {captions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Descreva seu conteúdo e clique em &quot;Gerar Legendas&quot; para começar
                    </p>
                  ) : (
                    captions.map((caption, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{caption}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}