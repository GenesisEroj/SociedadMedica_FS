import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

export default function Reserva({ onRequestLogin }) {
    const { isAuthenticated, user } = useAuth()
    const [form, setForm] = useState({
        servicio: 'CONSULTA',
        fecha: '',
        hora: '',
        comentario: '',
    })

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Reserva a enviar:', { ...form, emailUsuario: user?.email })
        alert('Reserva enviada (DEMO). Luego la conectamos a la API.')
    }

    return (
        <section id="reserva" className="page-section screen-page">
            <div className="container">
                <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                    Reservar hora
                </h2>
                <Divider />

                {!isAuthenticated ? (
                    <div className="card shadow-sm border-0 text-center mt-4">
                        <div className="card-body py-5 px-4">
                            <h4 className="card-title mb-3">
                                Para reservar, primero inicia sesión
                            </h4>
                            <p className="card-text text-muted mb-4">
                                Desde tu cuenta podrás escoger el tipo de atención, la fecha y
                                revisar todas tus reservas realizadas.
                            </p>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={onRequestLogin}
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-body p-4">
                            <h4 className="mb-3 text-start">Datos de la reserva</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 text-start">
                                    <label className="form-label">Servicio</label>
                                    <select
                                        name="servicio"
                                        className="form-select"
                                        value={form.servicio}
                                        onChange={onChange}
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
                                            onChange={onChange}
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
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3 text-start">
                                    <label className="form-label">
                                        Comentario adicional (opcional)
                                    </label>
                                    <textarea
                                        name="comentario"
                                        className="form-control"
                                        rows="3"
                                        value={form.comentario}
                                        onChange={onChange}
                                    />
                                </div>

                                <div className="mb-3 text-start">
                                    <label className="form-label">Paciente</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                    <small className="form-text text-muted">
                                        Más adelante mostraremos aquí el nombre completo desde tu
                                        API.
                                    </small>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Confirmar reserva
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
