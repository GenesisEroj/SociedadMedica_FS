// src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onNavigate, onLoginClick }) {
  const { isAuthenticated, user, logout } = useAuth()

  const goTo = (section) => {
    if (typeof onNavigate === 'function') {
      onNavigate(section)
    }
  }

  const handleLogout = () => {
    logout()
    if (typeof onNavigate === 'function') {
      onNavigate('home') // o 'inicio' según tu flujo
    }
  }

  // Logs opcionales de depuración
  console.log('🟡 Navbar user:', user)
  console.log('🟡 Navbar user.role:', user?.role)

  return (
    <nav
      className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top"
      id="mainNav"
    >
      <div className="container">
        {/* Logo / Inicio */}
        <button
          type="button"
          className="navbar-brand btn btn-link p-0 m-0 text-decoration-none"
          onClick={() => goTo('home')}
        >
          <img
            src="./assets/img/logo.png"
            alt="logoempresa"
            className="navbar-logo"
          />
        </button>

        <button
          className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menú <i className="fas fa-bars"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* INICIO */}
            <li className="nav-item mx-0 mx-lg-1">
              <button
                className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                onClick={() => goTo('home')}
              >
                Inicio
              </button>
            </li>

            {/* RESERVA */}
            <li className="nav-item mx-0 mx-lg-1">
              <button
                className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                onClick={() => goTo('reserva')}
              >
                Reservar hora
              </button>
            </li>

            {/* MIS RESERVAS (solo CLIENT) */}
            {isAuthenticated && user?.role === 'CLIENT' && (
              <li className="nav-item mx-0 mx-lg-1">
                <button
                  className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                  onClick={() => goTo('perfil')}
                >
                  Mis reservas
                </button>
              </li>
            )}

            {/* ADMIN (solo ADMIN) */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <li className="nav-item mx-0 mx-lg-1">
                <button
                  className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                  onClick={() => goTo('admin')}
                >
                  Admin
                </button>
              </li>
            )}

            {/* Nombre de usuario (si hay sesión) */}
            {isAuthenticated && user?.email && (
              <li className="nav-item mx-0 mx-lg-1 d-none d-lg-block">
                <span className="nav-link py-3 px-0 px-lg-3 rounded">
                  Hola, {user.email}
                </span>
              </li>
            )}

            {/* Botón Login / Logout */}
            <li className="nav-item mx-0 mx-lg-1">
              {isAuthenticated ? (
                <button
                  className="btn btn-primary ms-lg-3 my-2 my-lg-0"
                  type="button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  className="btn btn-primary ms-lg-3 my-2 my-lg-0"
                  type="button"
                  // 👇 usamos la función que viene desde App.jsx
                  onClick={onLoginClick}
                >
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
