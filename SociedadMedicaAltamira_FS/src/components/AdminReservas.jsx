import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// URL base del microservicio de reservas
const API_RESERVA_URL =
  import.meta.env.VITE_API_RESERVA_URL ?? 'http://localhost:8083/api/reservas'

// Helper para separar fecha y hora desde el string guardado
function parseFechaHora(str) {
  if (!str) return { fecha: "-", hora: "-" };

  if (str.includes("T")) {
    const [fecha, hora] = str.split("T");
    return { fecha, hora: hora?.slice(0, 5) ?? "-" };
  }

  const [fecha, hora] = str.split(" ");
  return { fecha: fecha ?? "-", hora: hora ?? "-" };
}

export default function AdminReservas() {
  const { isAuthenticated, user } = useAuth()

  const [reservas, setReservas] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const esAdmin = isAuthenticated && user?.role === 'ADMIN'

  // 🔎 Filtrar por nombre, correo, documento o fecha
  const reservasFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    if (!q) return reservas

    return reservas.filter((r) => {
      const texto = `
        ${r.nombre} 
        ${r.apellido} 
        ${r.correo} 
        ${r.tipoDocumento} 
        ${r.numeroDocumento} 
        ${r.fechaReserva}
      `.toLowerCase()

      return texto.includes(q)
    })
  }, [filtro, reservas])

  // 📊 Datos para el gráfico: reservas por tipo de documento
  const docTypeData = useMemo(() => {
    if (!reservasFiltradas.length) return []

    const counts = {}

    reservasFiltradas.forEach((r) => {
      const tipo = r.tipoDocumento || "SIN_TIPO"
      counts[tipo] = (counts[tipo] || 0) + 1
    })

    return Object.entries(counts).map(([tipoDocumento, count]) => ({
      tipoDocumento,
      count,
    }))
  }, [reservasFiltradas])

  // 📤 Exportación a Excel
  const handleExportToExcel = () => {
    if (!reservasFiltradas.length) return

    const data = reservasFiltradas.map((r, index) => {
      const { fecha, hora } = parseFechaHora(r.fechaReserva)

      return {
        N: index + 1,
        Nombre: r.nombre,
        Apellido: r.apellido,
        Correo: r.correo,
        TipoDocumento: r.tipoDocumento,
        NumeroDocumento: r.numeroDocumento,
        Edad: r.edad,
        Fecha: fecha,
        Hora: hora,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas")

    XLSX.writeFile(workbook, "reservas.xlsx")
  }

  // 📥 Cargar reservas desde la API
  useEffect(() => {
    const fetchReservas = async () => {
      if (!esAdmin) return

      setLoading(true)
      setError('')

      try {
        const res = await fetch(API_RESERVA_URL)
        if (!res.ok) {
          let msg = "Error al obtener reservas."
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
  }, [esAdmin])

  // 🚫 Acceso denegado
  if (!esAdmin) {
    return (
      <section className="page-section">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            ADMINISTRACIÓN DE RESERVAS
          </h2>
          <Divider />
          <p className="text-center text-muted">
            Solo los usuarios con rol <strong>ADMIN</strong> pueden acceder a esta sección.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section">
      <div className="container">
        
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
          ADMINISTRACIÓN DE RESERVAS
        </h2>
        <Divider />

        {/* Barra superior */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          
          <input
            type="text"
            className="form-control me-3"
            placeholder="Filtrar por paciente, correo, documento o fecha..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleExportToExcel}
              disabled={!reservasFiltradas.length}
            >
              Exportar a Excel
            </button>

            <button className="btn btn-success" type="button">
              + Nueva reserva
            </button>
          </div>

        </div>

        {loading && <p className="text-muted">Cargando reservas...</p>}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {!loading && !error && reservasFiltradas.length === 0 && (
          <p className="text-muted">No hay reservas que coincidan con el filtro.</p>
        )}

        {!loading && !error && reservasFiltradas.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Paciente</th>
                    <th>Correo</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Documento</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasFiltradas.map((r, index) => {
                    const { fecha, hora } = parseFechaHora(r.fechaReserva)

                    return (
                      <tr key={r.id}>
                        <td>{index + 1}</td>
                        {/* ✅ CORRECCIÓN 1: Usar comillas invertidas (backticks) para Template Literals */}
                        <td>{`${r.nombre} ${r.apellido}`}</td> 
                        <td>{r.correo}</td>
                        <td>{fecha}</td>
                        <td>{hora}</td>
                        {/* ✅ CORRECCIÓN 2: Usar comillas invertidas (backticks) para Template Literals */}
                        <td>{`${r.tipoDocumento} ${r.numeroDocumento}`}</td> 
                        <td>{r.edad}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-2">
                            Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 📊 Gráfico por tipo de documento */}
            {docTypeData.length > 0 && (
              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <h5 className="card-title">Reservas por tipo de documento</h5>
                  <p className="text-muted">
                    Cantidad de reservas agrupadas por tipo de documento (RUT, PASAPORTE, etc.)
                  </p>

                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={docTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipoDocumento" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Reservas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  )
}