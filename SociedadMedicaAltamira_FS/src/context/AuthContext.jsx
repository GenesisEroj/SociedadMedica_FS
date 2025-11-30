// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

// URL base del microservicio de USUARIO
const API_BASE_URL =
  import.meta.env.VITE_API_USUARIO_URL ?? 'http://localhost:8081/api/usuario'

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

  const isAuthenticated = !!user

  // 🔐 LOGIN contra /login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      let message = 'Error al iniciar sesión'
      try {
        const text = await res.text()
        // si el backend manda texto plano, usamos eso
        if (text) message = text
      } catch {
        // ignorar
      }
      throw new Error(message)
    }

    // UsuarioResponse { token, userId, name, email, role }
    const data = await res.json()

    setUser(data)

    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(data))
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser')
      localStorage.removeItem('authToken')
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      try {
        localStorage.setItem('authUser', JSON.stringify(user))
      } catch {
        // ignore
      }
    }
  }, [user])

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
