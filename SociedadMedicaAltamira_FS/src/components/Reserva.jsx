import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'
import { crearReserva } from '../services/reservasApi'

export default function Reserva({ onRequestLogin }) {
  const { isAuthenticated, user } = useAuth()

  const [form, setForm] = useState({
    servicio: 'Consulta otorrino',
    fecha: '',
    hora: '',
    comentario: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [okMessage, setOkMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOkMessage('')

    if (!form.fecha || !form.hora) {
      setError('Debes seleccionar fecha y hora.')
      return
    }

    try {
      setLoading(true)

      // Tomamos nombre y correo desde el usuario logueado
      const nombreCompleto = (user?.name || '').trim()
      const [nombre, ...resto] = nombreCompleto.split(' ')
      const apellido = resto.join(' ')

      // Body que espera ReservaRequest en el backend
      const body = {
        nombre: nombre || 'Paciente',
        apellido: apellido || '',
        edad: null, // si después agregas campo edad al formulario, lo reemplazas
        tipoDocumento: 'RUT', // ajusta al enum de tu backend si es distinto
        numeroDocumento: '', // idem
        correo: user?.email || '',
        // Aquí concatenamos fecha, hora, servicio y comentario
        fechaReserva: `${form.fecha} ${form.hora} - ${form.servicio}${
          form.comentario ? ' - ' + form.comentario : ''
        }`,
      }

      const respuesta = await crearReserva(body)
      console.log('Reserva creada:', respuesta)

      setOkMessage('Tu reserva fue registrada correctamente.')
      // Si quieres, limpia el formulario
      // setForm({ servicio: 'Consulta otorrino', fecha: '', hora: '', comentario: '' })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error al registrar la reserva.')
    } finally {
      setLoading(false)
    }
  }

  const handleClickLogin = () => {
    if (onRequestLogin) {
      onRequestLogin()
    } else {
      console.log('onRequestLogin no fue pasado como prop.')
    }
  }

  return (
    <section className="page-section" id="reserva">
      <div className="container">
        <Divider title="Reserva tu hora" />

        {!isAuthenticated ? (
          // Si NO está logueado
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center">
              <h4 className="mb-3">Para reservar, primero inicia sesión</h4>
              <p className="card-text text-muted mb-4">
                Desde tu cuenta podrás escoger el tipo de atención, la fecha y
                revisar todas tus reservas realizadas.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleClickLogin}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        ) : (
          // Si SÍ está logueado: mostramos el formulario
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                {/* SERVICIO */}
                <div className="form-group mb-3">
                  <label className="form-label">Tipo de servicio</label>
                  <select
                    name="servicio"
                    className="form-select"
                    value={form.servicio}
                    onChange={handleChange}
                  >
                    <option value="Consulta otorrino">Consulta otorrino</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Control postoperatorio">
                      Control postoperatorio
                    </option>
                  </select>
                </div>

                {/* FECHA */}
                <div className="form-group mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    className="form-control"
                    value={form.fecha}
                    onChange={handleChange}
                  />
                </div>

                {/* HORA */}
                <div className="form-group mb-3">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    name="hora"
                    className="form-control"
                    value={form.hora}
                    onChange={handleChange}
                  />
                </div>

                {/* COMENTARIO */}
                <div className="form-group mb-3">
                  <label className="form-label">Comentario (opcional)</label>
                  <textarea
                    name="comentario"
                    className="form-control"
                    rows="3"
                    value={form.comentario}
                    onChange={handleChange}
                    placeholder="Ej: Motivo de consulta, síntomas, etc."
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2 mt-2">{error}</div>
                )}

                {okMessage && (
                  <div className="alert alert-success py-2 mt-2">
                    {okMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Guardando reserva...' : 'Confirmar reserva'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
