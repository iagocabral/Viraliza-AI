'use client'

import { createContext, useContext, useState } from 'react'

interface MockUser {
  id: string
  email: string
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(false)

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    // Simular signup
    setTimeout(() => {
      setUser({ id: 'mock-user-id', email })
      setLoading(false)
    }, 1000)
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    // Simular login
    setTimeout(() => {
      setUser({ id: 'mock-user-id', email })
      setLoading(false)
    }, 1000)
    return { error: null }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    // Simular Google login
    setTimeout(() => {
      setUser({ id: 'mock-user-id', email: 'user@gmail.com' })
      setLoading(false)
    }, 1000)
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}