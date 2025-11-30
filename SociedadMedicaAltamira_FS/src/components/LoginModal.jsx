import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
    const { login } = useAuth()

    // "login" | "register" | "forgot"
    const [mode, setMode] = useState('login')

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
        // validación simple de email
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

        // modo forgot solo valida email, ya lo hicimos arriba
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
                // 🔐 Aquí luego conectaremos con tu API real (JWT, etc.)
                await login(form.email.trim(), form.password)
                resetForm()
                onClose?.()
            } else if (mode === 'register') {
                // 👉 Luego: llamar a tu endpoint POST /usuarios/registro
                alert(
                    'Registro enviado (DEMO). Más adelante lo conectamos con tu API de usuarios.'
                )
                resetForm()
                onClose?.()
            } else if (mode === 'forgot') {
                // 👉 Luego: llamar a tu endpoint POST /usuarios/recuperar-contraseña
                alert(
                    'Si el correo existe en el sistema, se enviará un enlace para recuperar la contraseña (DEMO).'
                )
                resetForm()
                onClose?.()
            }
        } catch (err) {
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
                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{title}</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* Tabs simples arriba */}
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
                    {/* Nombre solo en registro */}
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

                    {/* Email */}
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

                    {/* Password (no se muestra en modo forgot) */}
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

                    {/* Confirmar contraseña solo en registro */}
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

                    {/* Mensaje de error */}
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : title}
                    </button>

                    {mode === 'login' && (
                        <p className="mt-3 mb-0 small text-muted text-start">
                            ⚠️ Por ahora es un formulario de prueba. Más adelante lo
                            conectamos con tu API de usuarios en Spring Boot y JWT.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
