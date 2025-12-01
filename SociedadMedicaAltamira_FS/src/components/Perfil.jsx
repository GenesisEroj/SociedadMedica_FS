// src/components/Perfil.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

const API_RESERVAS_URL =
  import.meta.env.VITE_API_RESERVA_URL ?? 'http://localhost:8083/api/reservas2'

export default function Perfil() {
  const { isAuthenticated, user } = useAuth()

  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar reservas solo si hay usuario CLIENT con email
  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setReservas([])
      return
    }

    const cargar = async () => {
      try {
        setLoading(true)
        setError('')

        const resp = await fetch(API_RESERVAS_URL)
        if (!resp.ok) {
          throw new Error('No se pudieron cargar las reservas')
        }

        const data = await resp.json()

        // Filtra solo las reservas del usuario
        const mias = Array.isArray(data)
          ? data.filter(
              (r) =>
                r.correo === user.email || // si tu API usa "correo"
                r.paciente === user.email // si usas el email como "paciente"
            )
          : []

        setReservas(mias)
      } catch (e) {
        console.error(e)
        setError(e.message || 'Error inesperado al cargar las reservas')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [isAuthenticated, user])

  // Si NO está logueado
  if (!isAuthenticated) {
    return (
      <section className="page-section screen-page">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Mi perfil
          </h2>
          <Divider />
          <p className="text-center">
            Debes iniciar sesión para ver tu perfil y tus reservas.
          </p>
          <p className="text-center text-muted">
            Usa el botón <strong>“Iniciar sesión”</strong> en el menú superior.
          </p>
        </div>
      </section>
    )
  }

  // Vista de perfil + reservas del usuario
  return (
    <section className="page-section screen-page">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
          Mi perfil
        </h2>
        <Divider />

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7 text-start">
            <h4>Datos del usuario</h4>
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>

            <hr />

            <h4>Mis reservas</h4>

            {loading && (
              <p className="text-muted">Cargando tus reservas...</p>
            )}

            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && reservas.length === 0 && (
              <p className="text-muted">
                Aún no tienes reservas registradas.
              </p>
            )}

            {!loading && !error && reservas.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.fechaReserva ?? r.fecha}</td>
                        <td>{r.hora ?? '-'}</td>
                        <td>{r.servicio ?? '-'}</td>
                        <td>{r.estado ?? 'PENDIENTE'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
