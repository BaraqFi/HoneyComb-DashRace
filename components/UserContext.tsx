/* "use client"

import { createContext, useContext, useState, useEffect } from "react"

export type UserSession = {
  wallet?: string
  accessToken?: string
  username?: string
  profileAddress?: string
  characterAddress?: string
  setSession: (update: Partial<UserSession>) => void
  clearSession: () => void
}

const defaultSession: UserSession = {
  setSession: () => {},
  clearSession: () => {},
}

const UserContext = createContext<UserSession>(defaultSession)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Partial<UserSession>>({})

  useEffect(() => {
    const saved = localStorage.getItem("dashrace-session")
    if (saved) setSessionState(JSON.parse(saved))
  }, [])

  const setSession = (update: Partial<UserSession>) => {
    setSessionState(prev => {
      const next = { ...prev, ...update }
      localStorage.setItem("dashrace-session", JSON.stringify(next))
      return next
    })
  }
  const clearSession = () => {
    setSessionState({})
    localStorage.removeItem("dashrace-session")
  }

  return (
    <UserContext.Provider value={{ ...session, setSession, clearSession }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
 */