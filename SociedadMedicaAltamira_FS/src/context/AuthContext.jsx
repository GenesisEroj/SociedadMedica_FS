// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

// URL base del microservicio de USUARIO
const API_BASE_URL =
  import.meta.env.VITE_API_USUARIO_URL ?? 'http://localhost:8081/api/usuario'

// Normaliza el rol a "ADMIN" o "CLIENT"
const normalizarRol = (rol) => {
  if (!rol) return 'CLIENT'

  let r = rol

  // Si viene como objeto { authority: "..."} o { nombre: "..." }
  if (typeof r === 'object' && !Array.isArray(r)) {
    r = r.authority ?? r.nombre ?? r.rol ?? r.role ?? ''
  }

  // Si viene como array ["ROLE_ADMIN"] o [{authority: "ROLE_ADMIN"}]
  if (Array.isArray(r)) {
    const primero = r[0]
    if (typeof primero === 'string') {
      r = primero
    } else if (typeof primero === 'object') {
      r =
        primero.authority ??
        primero.nombre ??
        primero.rol ??
        primero.role ??
        ''
    }
  }

  const upper = r.toString().toUpperCase()

  // Cubre casos: "ADMIN", "ROLE_ADMIN", "ADMINISTRADOR"
  if (upper.includes('ADMIN')) return 'ADMIN'

  return 'CLIENT'
}

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
        if (text) message = text
      } catch {}
      throw new Error(message)
    }

    // Respuesta del backend
    const data = await res.json()
    console.log('🔵 Respuesta /login:', data)

    // Tomamos cualquier variante posible del rol
    const rawRole =
      data.role ??
      data.rol ??
      data.tipoUsuario ??
      data.userRole ??
      data.roles ??
      data.authorities

    console.log('🟣 rawRole que detecto:', rawRole)

    const userNormalizado = {
      ...data,
      role: normalizarRol(rawRole),
    }

    console.log('🟢 userNormalizado que guardo:', userNormalizado)

    setUser(userNormalizado)

    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(userNormalizado))
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
