import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

// URL base del microservicio de usuario
// Puedes cambiarla con VITE_API_USUARIO_URL en un .env si quieres.
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [user])

  // LOGIN real (cuando backend esté listo); mientras, backend puede responder demo
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Correo y contraseña son obligatorios')
    }

    const url = `${API_BASE_URL}/login`

    let resp
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    } catch (err) {
      console.error('Error de red al llamar al backend', err)
      throw new Error('No se pudo conectar con el servidor de usuario')
    }

    let data
    try {
      data = await resp.json()
    } catch {
      data = null
    }

    if (!resp.ok) {
      const msgBackend =
          data?.message || data?.error || 'Credenciales inválidas o error en el servidor'
      throw new Error(msgBackend)
    }

    // Esperamos algo como:
    // { token, userId, name, email, role }
    const loggedUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token,
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
    token: user?.token ?? null,
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
