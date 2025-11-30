import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

// URL base del microservicio de reservas
const API_RESERVA_URL =
  import.meta.env.VITE_API_RESERVA_URL ?? 'http://localhost:8083/api/reservas2'

export default function Perfil({ onRequestLogin }) {
  const { isAuthenticated, user } = useAuth()

  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Obtener reservas por correo
  useEffect(() => {
    const fetchReservas = async () => {
      if (!isAuthenticated || !user?.email) return

      setLoading(true)
      setError('')

      try {
        const url = `${API_RESERVA_URL}/por-usuario?correo=${encodeURIComponent(
          user.email
        )}`

        const res = await fetch(url)
        if (!res.ok) {
          let msg = 'Error al obtener reservas.'
          try {
            const text = await res.text()
            if (text) msg = text
          } catch {}
          throw new Error(msg)
        }

        const data = await res.json()
        setReservas(data || [])
      } catch (err) {
        setError(err.message ?? 'Error al obtener reservas.')
      } finally {
        setLoading(false)
      }
    }

    fetchReservas()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Mi perfil
          </h2>
          <Divider />
          <p className="text-center">
            Debes iniciar sesión para ver tu perfil y tus reservas.
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
    <section className="page-section">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
          MI PERFIL
        </h2>
        <Divider />

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">

            {/* DATOS DEL USUARIO */}
            <h4>Datos del usuario</h4>
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>

            <hr />

            {/* MIS RESERVAS */}
            <h4>Mis reservas</h4>

            {loading && <p className="text-muted">Cargando reservas...</p>}

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {!loading && !error && reservas.length === 0 && (
              <p className="text-muted">Aún no tienes reservas registradas.</p>
            )}

            {!loading && !error && reservas.length > 0 && (
              <div className="list-group">
                {reservas.map((r) => (
                  <div
                    key={r.id}
                    className="list-group-item mb-3"
                    style={{ borderRadius: '8px' }}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>
                          {r.nombre} {r.apellido}
                        </strong>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {r.correo}
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">
                          {r.fechaReserva || 'Sin fecha'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                      <div>
                        <strong>Documento:</strong> {r.tipoDocumento} {r.numeroDocumento}
                      </div>
                      <div>
                        <strong>Edad:</strong> {r.edad}
                      </div>
                      <div>
                        <strong>Fecha y hora:</strong> {r.fechaReserva}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
