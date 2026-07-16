import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSession, onAuthStateChange } from '../../services/auth.service'

interface AuthContextValue {
  session: Session | null
  user: User | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then(setSession)
      .finally(() => setIsLoading(false))

    return onAuthStateChange((nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
