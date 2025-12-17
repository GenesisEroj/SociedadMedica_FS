// src/components/Reserva.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

// URL de la API de reservas
const API_RESERVA_URL =
  import.meta.env.VITE_API_RESERVA_URL ?? 'http://localhost:8083/api/reservas2'

export default function Reserva({ onRequestLogin }) {
  const { isAuthenticated, user } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    tipoDocumento: 'RUT',
    numeroDocumento: '',
    correo: '',
    fechaReserva: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Rellenar nombre/correo desde el usuario logueado
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre: user.name ?? prev.nombre,
        correo: user.email ?? prev.correo,
      }))
    }
  }, [user])

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.nombre.trim()) return 'Debes ingresar tu nombre.'
    if (!form.apellido.trim()) return 'Debes ingresar tu apellido.'
    if (!form.edad) return 'Debes ingresar tu edad.'
    if (!form.numeroDocumento.trim())
      return 'Debes ingresar tu número de documento.'
    if (!form.correo.trim()) return 'Debes ingresar tu correo.'
    if (!form.fechaReserva) return 'Debes seleccionar una fecha y hora.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const body = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: Number(form.edad),
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento.trim(),
        correo: form.correo.trim(),
        fechaReserva: form.fechaReserva, // se guarda como String
      }

      const res = await fetch(API_RESERVA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let msg = 'Error al crear la reserva.'
        try {
          const text = await res.text()
          if (text) msg = text
        } catch {}
        throw new Error(msg)
      }

      const data = await res.json()
      console.log('Reserva creada:', data)
      setSuccess('✅ ¡Reserva creada correctamente!')

      // limpiar algunos campos
      setForm(prev => ({
        ...prev,
        apellido: '',
        edad: '',
        numeroDocumento: '',
        fechaReserva: '',
      }))
    } catch (err) {
      // Cuando hay problema de red/cors, el mensaje típico es "Failed to fetch"
      setError(err.message || 'Ocurrió un error al crear la reserva.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <section id="reserva" className="page-section screen-page">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Reserva tu hora
          </h2>
          <Divider />
          <p className="text-center">
            Debes iniciar sesión para poder reservar una hora.
          </p>
          <div className="text-center">
            <button className="btn btn-primary" onClick={onRequestLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reserva" className="page-section screen-page">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
          Reserva tu hora
        </h2>
        <Divider />

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={form.apellido}
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
                  min="0"
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

              <div className="mb-3">
                <label className="form-label">Número de documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  className="form-control"
                  value={form.numeroDocumento}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  value={form.correo}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha y hora de la reserva</label>
                <input
                  type="datetime-local"
                  name="fechaReserva"
                  className="form-control"
                  value={form.fechaReserva}
                  onChange={onChange}
                />
                <small className="form-text text-muted">
                  Se guardará en la base de datos como un texto (String).
                </small>
              </div>

              {error && <div className="alert alert-danger py-2">{error}</div>}
              {success && (
                <div className="alert alert-success py-2">{success}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Confirmar reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
