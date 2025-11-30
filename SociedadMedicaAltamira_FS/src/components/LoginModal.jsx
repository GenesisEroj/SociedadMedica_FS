// src/components/LoginModal.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_BASE_URL =
  import.meta.env.VITE_API_USUARIO_URL ?? 'http://localhost:8081/api/usuario'

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth()

  const [mode, setMode] = useState('login') // "login" | "register" | "forgot"

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    apellido: '',
    edad: '',
    numeroDocumento: '',
    tipoDocumento: 'RUT',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
      name: '',
      apellido: '',
      edad: '',
      numeroDocumento: '',
      tipoDocumento: 'RUT',
      confirmPassword: '',
    })
    setError('')
    setMessage('')
  }

  const changeMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.email.trim()) return 'Debes ingresar un correo electrónico.'

    if (mode === 'login') {
      if (!form.password) return 'Debes ingresar tu contraseña.'
      return ''
    }

    if (mode === 'register') {
      if (!form.name.trim()) return 'Debes ingresar tu nombre.'
      if (!form.apellido.trim()) return 'Debes ingresar tu apellido.'
      if (!form.edad) return 'Debes ingresar tu edad.'
      if (!form.numeroDocumento.trim())
        return 'Debes ingresar tu número de documento.'
      if (!form.password || !form.confirmPassword)
        return 'Debes ingresar y confirmar la contraseña.'
      if (form.password.length < 6)
        return 'La contraseña debe tener al menos 6 caracteres.'
      if (form.password !== form.confirmPassword)
        return 'Las contraseñas no coinciden.'
      return ''
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      if (mode === 'login') {
        // 🔐 LOGIN → usa AuthContext (que llama a /login)
        await login(form.email.trim(), form.password)
        onClose()
        return
      }

      if (mode === 'register') {
        // 📝 REGISTRO → POST /registro
        const body = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: 'CLIENT', // coincide con RolUsuario.CLIENT del backend
        }

        const res = await fetch(`${API_BASE_URL}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          let msg = 'Error al registrar usuario.'
          try {
            const text = await res.text()
            if (text) msg = text // por si el backend devuelve texto plano
          } catch {
            // ignore
          }
          throw new Error(msg)
        }

        // después de registrar, logueamos automáticamente
        await login(form.email.trim(), form.password)
        onClose()
        return
      }

      if (mode === 'forgot') {
        setMessage(
          'Si el correo está registrado, te enviaremos instrucciones para recuperar la contraseña.'
        )
      }
    } catch (err) {
      setError(err.message ?? 'Ocurrió un error.')
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="card p-4"
        style={{
          maxWidth: '450px',
          width: '100%',
          maxHeight: '90vh',   // altura máxima del modal
          overflowY: 'auto',   // 👈 SCROLL VERTICAL
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* TABS */}
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

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Ej: Sofía"
                  value={form.name}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  placeholder="Ej: García"
                  value={form.apellido}
                  onChange={onChange}
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="correo@ejemplo.cl"
              value={form.email}
              onChange={onChange}
            />
          </div>

          {(mode === 'login' || mode === 'register') && (
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={onChange}
              />
              {mode === 'register' && (
                <small className="form-text text-muted">
                  Mínimo 6 caracteres.
                </small>
              )}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Repite la contraseña"
                  value={form.confirmPassword}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Edad</label>
                <input
                  type="number"
                  name="edad"
                  className="form-control"
                  value={form.edad}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  className="form-control"
                  placeholder="Ej: 10987654-8"
                  value={form.numeroDocumento}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de documento</label>
                <select
                  name="tipoDocumento"
                  className="form-select"
                  value={form.tipoDocumento}
                  onChange={onChange}
                >
                  <option value="RUT">RUT</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <p className="text-muted">
              Ingresa el correo con el que te registraste. Si existe una cuenta
              asociada, te enviaremos un enlace para recuperar tu contraseña.
            </p>
          )}

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && (
            <div className="alert alert-success py-2">{message}</div>
          )}

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

