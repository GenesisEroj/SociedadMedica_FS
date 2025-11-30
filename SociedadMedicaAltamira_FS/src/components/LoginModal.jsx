import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_BASE = 'http://localhost:8081/api/usuario'

export default function LoginModal({ isOpen, onClose }) {
  const { login: loginContext } = useAuth()

  const [mode, setMode] = useState('login') // "login" | "register" | "forgot"
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setError('')
  }

  const changeMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!form.email.trim()) return 'El correo es obligatorio.'
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      return 'Ingresa un correo válido.'
    }

    if (mode === 'login') {
      if (!form.password) return 'La contraseña es obligatoria.'
      if (form.password.length < 6)
        return 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (mode === 'register') {
      if (!form.name.trim()) return 'El nombre es obligatorio.'
      if (!form.password || !form.confirmPassword)
        return 'Debes ingresar y confirmar la contraseña.'
      if (form.password.length < 6)
        return 'La contraseña debe tener al menos 6 caracteres.'
      if (form.password !== form.confirmPassword)
        return 'Las contraseñas no coinciden.'
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        // LOGIN contra tu API
        const resp = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        })

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data.message || 'Error al iniciar sesión')
        }

        const data = await resp.json()

        // aquí usas tu contexto para guardar el usuario
        await loginContext({
          token: data.token,
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })

        resetForm()
        onClose?.()
      } else if (mode === 'register') {
        // REGISTRO contra tu API
        const resp = await fetch(`${API_BASE}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        })

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data.message || 'Error al registrar usuario')
        }

        const data = await resp.json()

        // Si quieres que quede logueado al registrarse:
        await loginContext({
          token: data.token,
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })

        resetForm()
        onClose?.()
      } else if (mode === 'forgot') {
        // por ahora solo demo
        alert(
          'Si el correo existe, se enviará un enlace para recuperar la contraseña (DEMO).'
        )
        resetForm()
        onClose?.()
      }
    } catch (err) {
      // errores de red como "Failed to fetch" también caen acá
      setError(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const title =
    mode === 'login'
      ? 'Iniciar sesión'
      : mode === 'register'
      ? 'Crear cuenta'
      : 'Recuperar contraseña'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card p-4" style={{ maxWidth: '430px', width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Tabs */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn btn-sm ${
              mode === 'login' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => changeMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              mode === 'register' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => changeMode('register')}
          >
            Registrarme
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              mode === 'forgot' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => changeMode('forgot')}
          >
            Olvidé mi contraseña
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3 text-start">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={onChange}
                placeholder="Ej: María Jesús Rojas"
              />
            </div>
          )}

          <div className="mb-3 text-start">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={onChange}
              placeholder="correo@ejemplo.cl"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="mb-3 text-start">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={onChange}
                placeholder="********"
              />
              <small className="form-text text-muted">
                Mínimo 6 caracteres.
              </small>
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-3 text-start">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Repite la contraseña"
              />
            </div>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Procesando...' : title}
          </button>
        </form>
      </div>
    </div>
  )
}
