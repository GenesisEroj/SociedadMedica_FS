import { useState } from 'react'
import Divider from './Divider.jsx'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  /** Manejo de cambios del formulario */
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  /** Validación de campos */
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nombre es requerido'
    if (!emailRegex.test(form.email)) e.email = 'Correo inválido'
    if (!form.phone.trim()) e.phone = 'Teléfono es requerido'
    if (!form.message.trim()) e.message = 'Mensaje es requerido'
    return e
  }

  /** Enviar formulario */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setOk('')
    setErrors({})

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8082/api/contacto/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombreCompleto: form.name,
          correo: form.email,
          telefono: form.phone,
          mensaje: form.message
        })
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      setOk('¡Tu mensaje fue enviado correctamente!')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        global: 'No se pudo enviar el mensaje. Intenta nuevamente.'
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-section" id="contact">
      <div className="container">
        {/* Título */}
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
          Contactame
        </h2>
        <Divider />

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">

            <form onSubmit={handleSubmit} noValidate>

              {/* Nombre */}
              <div className="form-floating mb-3">
                <input
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={onChange}
                />
                <label htmlFor="name">Nombre completo</label>
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="nombre@ejemplo.com"
                  value={form.email}
                  onChange={onChange}
                />
                <label htmlFor="email">Correo electrónico</label>
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-floating mb-3">
                <input
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Número telefónico"
                  value={form.phone}
                  onChange={onChange}
                />
                <label htmlFor="phone">Número telefónico</label>
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              {/* Mensaje */}
              <div className="form-floating mb-3">
                <textarea
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  id="message"
                  name="message"
                  placeholder="Escribe tu mensaje aquí..."
                  style={{ height: '10rem' }}
                  value={form.message}
                  onChange={onChange}
                />
                <label htmlFor="message">Mensaje</label>
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              {/* Botón */}
              <button
                className="btn btn-primary btn-xl"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>

              {/* Error global */}
              {errors.global && (
                <div className="alert alert-danger mt-3">{errors.global}</div>
              )}

              {/* Mensaje de éxito */}
              {ok && (
                <div className="alert alert-success mt-3">{ok}</div>
              )}

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
