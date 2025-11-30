import { useAuth } from '../context/AuthContext'
import './navbar.css'

export default function Navbar({ onNavigate, onLoginClick }) {
  const { user, isAuthenticated, logout } = useAuth()

  const goTo = (view) => {
    onNavigate(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
      <nav
          className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top"
          id="mainNav"
      >
        <div className="container">
          {/* LOGO */}
          <a
              className="navbar-brand"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                goTo('home')
              }}
          >
            <img
                src="/assets/img/logo.png"
                alt="logoempresa"
                className="navbar-logo"
            />
          </a>

          {/* BOTÓN MÓVIL */}
          <button
              className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            Menu <i className="fas fa-bars"></i>
          </button>

          {/* ITEMS */}
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
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
                  Reserva
                </button>
              </li>

              {/* PERFIL (solo logueado) */}
              {isAuthenticated && (
                  <li className="nav-item mx-0 mx-lg-1">
                    <button
                        className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                        onClick={() => goTo('perfil')}
                    >
                      Perfil
                    </button>
                  </li>
              )}

              {/* ADMIN (solo rol ADMIN) */}
              {isAuthenticated && user.role === 'ADMIN' && (
                  <li className="nav-item mx-0 mx-lg-1">
                    <button
                        className="nav-link py-3 px-0 px-lg-3 rounded btn btn-link"
                        onClick={() => goTo('admin')}
                    >
                      Admin
                    </button>
                  </li>
              )}

              {/* LOGIN / USUARIO */}
              <li className="nav-item mx-0 mx-lg-1 d-flex align-items-center">
                {!isAuthenticated ? (
                    <button
                        className="btn btn-primary ms-lg-3"
                        type="button"
                        onClick={onLoginClick}
                    >
                      Iniciar sesión
                    </button>
                ) : (
                    <div className="d-flex align-items-center gap-2">
                  <span className="text-white small d-none d-lg-inline">
                    {user.email}
                  </span>
                      <button
                          className="btn btn-outline-light btn-sm"
                          type="button"
                          onClick={logout}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
  )
}
