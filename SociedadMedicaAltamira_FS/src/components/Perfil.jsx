import { useAuth } from '../context/AuthContext'
import Divider from './Divider.jsx'

export default function Perfil({ onRequestLogin }) {
    const { isAuthenticated, user } = useAuth()

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
                    <div className="d-flex justify-content-center">
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
                        <p className="text-muted">
                            Aquí mostraremos la lista de reservas del usuario conectada a tu
                            microservicio de reservas (GET /reservas/por-usuario). Lo hacemos
                            en el siguiente paso.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
