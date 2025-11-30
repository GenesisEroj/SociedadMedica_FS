import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('authUser')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [user])

  // 🔴 Aquí luego cambiaremos para llamar a tu API de Spring Boot
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Correo y contraseña son obligatorios')
    }

    // DEMO: si el correo es admin@altamira.cl será ADMIN, si no USER.
    let role = 'USER'
    if (email.toLowerCase() === 'admin@altamira.cl') {
      role = 'ADMIN'
    }

    const loggedUser = {
      id: 1,
      name: 'Usuario demo',
      email,
      role,
    }

    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
