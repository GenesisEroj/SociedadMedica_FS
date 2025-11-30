import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

export default function AdminReservas({ onRequestLogin }) {
    const { isAuthenticated, user } = useAuth()

    // ------------------------------
    // ESTADO
    // ------------------------------
    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filtro, setFiltro] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modo, setModo] = useState('create') // "create" | "edit"
    const [reservaEditando, setReservaEditando] = useState(null)

    // Formulario del modal
    const [form, setForm] = useState({
        id: null,
        paciente: '',
        servicio: 'CONSULTA',
        fecha: '',
        hora: '',
        estado: 'PENDIENTE',
    })

    // ------------------------------
    // CARGA INICIAL (DEMO)
    // Luego aquí se hará fetch a tu API Spring Boot
    // ------------------------------
    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true)
                setError('')

                // 🔴 DEMO: Datos quemados para que se vea algo
                // Luego aquí haremos GET a /api/reservas (por ejemplo)
                const demo = [
                    {
                        id: 1,
                        paciente: 'juan.perez@example.cl',
                        servicio: 'CONSULTA',
                        fecha: '2025-12-10',
                        hora: '10:30',
                        estado: 'CONFIRMADA',
                    },
                    {
                        id: 2,
                        paciente: 'maria.gomez@example.cl',
                        servicio: 'CONTROL',
                        fecha: '2025-12-12',
                        hora: '16:00',
                        estado: 'PENDIENTE',
                    },
                ]

                setReservas(demo)
            } catch (e) {
                setError('No se pudieron cargar las reservas (DEMO).')
            } finally {
                setLoading(false)
            }
        }

        cargar()
    }, [])

    // ------------------------------
    // FILTRO
    // ------------------------------
    const reservasFiltradas = useMemo(() => {
        if (!filtro.trim()) return reservas
        const term = filtro.toLowerCase()
        return reservas.filter(
            (r) =>
                r.paciente.toLowerCase().includes(term) ||
                r.servicio.toLowerCase().includes(term) ||
                r.estado.toLowerCase().includes(term)
        )
    }, [filtro, reservas])

    // ------------------------------
    // MANEJO MODAL
    // ------------------------------
    const abrirCrear = () => {
        setModo('create')
        setForm({
            id: null,
            paciente: '',
            servicio: 'CONSULTA',
            fecha: '',
            hora: '',
            estado: 'PENDIENTE',
        })
        setIsModalOpen(true)
    }

    const abrirEditar = (reserva) => {
        setModo('edit')
        setReservaEditando(reserva)
        setForm({ ...reserva })
        setIsModalOpen(true)
    }

    const cerrarModal = () => {
        setIsModalOpen(false)
        setReservaEditando(null)
    }

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // ------------------------------
    // CREAR / EDITAR
    // ------------------------------
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form.paciente || !form.fecha || !form.hora) {
            alert('Paciente, fecha y hora son obligatorios.')
            return
        }

        if (modo === 'create') {
            // 🔴 DEMO: generamos un id local
            const nuevoId =
                reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1

            const nuevaReserva = {
                ...form,
                id: nuevoId,
            }

            // Luego aquí irá POST a /api/reservas
            setReservas((prev) => [...prev, nuevaReserva])
            alert('Reserva creada (DEMO). Luego la conectamos a la API.')
        } else if (modo === 'edit' && reservaEditando) {
            // Luego aquí irá PUT /api/reservas/:id
            const actualizadas = reservas.map((r) =>
                r.id === reservaEditando.id ? { ...form } : r
            )
            setReservas(actualizadas)
            alert('Reserva actualizada (DEMO). Luego la conectamos a la API.')
        }

        cerrarModal()
    }

    // ------------------------------
    // ELIMINAR
    // ------------------------------
    const handleEliminar = (reserva) => {
        const ok = window.confirm(
            `¿Seguro que deseas eliminar la reserva #${reserva.id} de ${reserva.paciente}?`
        )
        if (!ok) return

        // Luego aquí irá DELETE /api/reservas/:id
        setReservas((prev) => prev.filter((r) => r.id !== reserva.id))
    }

    // ------------------------------
    // GUARDAS DE SEGURIDAD
    // ------------------------------
    if (!isAuthenticated) {
        return (
            <section className="page-section screen-page">
                <div className="container">
                    <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                        Administración de reservas
                    </h2>
                    <Divider />
                    <p className="text-center mt-4">
                        Debes iniciar sesión como administrador para gestionar las reservas.
                    </p>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={onRequestLogin}>
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    if (user.role !== 'ADMIN') {
        return (
            <section className="page-section screen-page">
                <div className="container">
                    <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                        Administración de reservas
                    </h2>
                    <Divider />
                    <p className="text-center mt-4 text-danger">
                        No tienes permisos para acceder a esta sección.
                    </p>
                </div>
            </section>
        )
    }

    // ------------------------------
    // VISTA PRINCIPAL ADMIN
    // ------------------------------
    return (
        <section className="page-section screen-page">
            <div className="container">
                <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                    Administración de reservas
                </h2>
                <Divider />

                {/* BARRA SUPERIOR: filtro + botón crear */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                    <div className="flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filtrar por paciente, servicio o estado..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success" onClick={abrirCrear}>
                        + Nueva reserva
                    </button>
                </div>

                {/* ESTADOS */}
                {loading && (
                    <p className="mt-4 text-center text-muted">Cargando reservas...</p>
                )}
                {error && (
                    <div className="alert alert-danger mt-4 text-center">{error}</div>
                )}

                {/* TABLA */}
                {!loading && reservasFiltradas.length === 0 && (
                    <p className="mt-4 text-center text-muted">
                        No hay reservas para mostrar.
                    </p>
                )}

                {!loading && reservasFiltradas.length > 0 && (
                    <div className="table-responsive mt-4">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Paciente</th>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reservasFiltradas.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.paciente}</td>
                                    <td>{r.servicio}</td>
                                    <td>{r.fecha}</td>
                                    <td>{r.hora}</td>
                                    <td>
                                        <span className="badge bg-secondary">{r.estado}</span>
                                    </td>
                                    <td className="text-center">
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => abrirEditar(r)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleEliminar(r)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL CREAR / EDITAR */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="card" style={{ maxWidth: 500, width: '100%' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    {modo === 'create'
                                        ? 'Crear nueva reserva'
                                        : `Editar reserva #${form.id}`}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cerrarModal}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 text-start">
                                    <label className="form-label">Paciente (correo)</label>
                                    <input
                                        type="email"
                                        name="paciente"
                                        className="form-control"
                                        value={form.paciente}
                                        onChange={onChangeForm}
                                        placeholder="paciente@correo.cl"
                                        required
                                    />
                                </div>

                                <div className="mb-3 text-start">
                                    <label className="form-label">Servicio</label>
                                    <select
                                        name="servicio"
                                        className="form-select"
                                        value={form.servicio}
                                        onChange={onChangeForm}
                                    >
                                        <option value="CONSULTA">Consulta</option>
                                        <option value="CONTROL">Control</option>
                                    </select>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3 text-start">
                                        <label className="form-label">Fecha</label>
                                        <input
                                            type="date"
                                            name="fecha"
                                            className="form-control"
                                            value={form.fecha}
                                            onChange={onChangeForm}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3 text-start">
                                        <label className="form-label">Hora</label>
                                        <input
                                            type="time"
                                            name="hora"
                                            className="form-control"
                                            value={form.hora}
                                            onChange={onChangeForm}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3 text-start">
                                    <label className="form-label">Estado</label>
                                    <select
                                        name="estado"
                                        className="form-select"
                                        value={form.estado}
                                        onChange={onChangeForm}
                                    >
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="CONFIRMADA">Confirmada</option>
                                        <option value="CANCELADA">Cancelada</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {modo === 'create' ? 'Crear' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-3 mb-0 small text-muted text-start">
                                ⚠️ Por ahora este panel funciona con datos de prueba en
                                memoria. En el siguiente paso lo conectamos con tu API de
                                Spring Boot (GET/POST/PUT/DELETE).
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
