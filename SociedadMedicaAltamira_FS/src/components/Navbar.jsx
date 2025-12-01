import "./navbar.css";

export default function Navbar({ onNavigate, onLoginClick, user, handleLogout }) {
  // Normalizamos el rol: " admin  " -> "ADMIN"
  // Nota: Usaremos user.role si el backend manda 'role' en minúsculas,
  // pero mantengo 'rol' si es como viene en tu backend por defecto.
  const normalizedRole = user?.rol
    ? user.rol.toString().trim().toUpperCase()
    : null
  
  const isAdmin = normalizedRole === 'ADMIN'
  const isClient = user && !isAdmin // Si hay usuario y NO es admin, asumimos que es cliente

  const handleInicioClick = (e) => {
    e.preventDefault()
    onNavigate && onNavigate('home')
  }

  const handleReservaClick = (e) => {
    e.preventDefault()
    onNavigate && onNavigate('reserva')
  }

  // Ahora navega a 'mis-reservas' si es cliente, o 'perfil' si es admin.
  // En tu aplicación principal deberás mapear la ruta 'perfil' a 'AdminReservas' si el user es Admin.
  const handleMisReservasPerfilClick = (e) => {
    e.preventDefault()
    if (!user) {
      onLoginClick && onLoginClick()
      return
    }
    
    // Si es cliente, navega a la vista de sus reservas
    if (isClient) {
        onNavigate && onNavigate('mis-reservas') // Cambié 'perfil' a 'mis-reservas'
        return
    }

    // Si es Admin, puede ir a 'perfil' (que es un enlace genérico) o 'admin'
    onNavigate && onNavigate('perfil') 
  }

  const handleAdminClick = (e) => {
    e.preventDefault()
    if (!isAdmin) {
      // por seguridad, si no es admin no navegamos
      onLoginClick && onLoginClick()
      return
    }
    onNavigate && onNavigate('admin')
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top"
      id="mainNav"
    >
      <div className="container">

        {/* LOGO -> HOME */}
        <a
          className="navbar-brand"
          href="#"
          onClick={handleInicioClick}
        >
          <img
            src="/assets/img/logo.png"
            alt="Logo"
            className="navbar-logo"
          />
        </a>

        {/* Toggle responsive */}
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

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">

            {/* INICIO */}
            <li className="nav-item mx-0 mx-lg-1">
              <a
                className="nav-link btn-link rounded"
                href="#"
                onClick={handleInicioClick}
              >
                INICIO
              </a>
            </li>

            {/* RESERVAR HORA */}
            <li className="nav-item mx-0 mx-lg-1">
              <a
                className="nav-link btn-link rounded"
                href="#"
                onClick={handleReservaClick}
              >
                RESERVAR HORA
              </a>
            </li>

            {/* PERFIL / MIS RESERVAS */}
            <li className="nav-item mx-0 mx-lg-1">
              <a
                className="nav-link btn-link rounded"
                href="#"
                onClick={handleMisReservasPerfilClick}
              >
                {/* ✅ CORRECCIÓN/AJUSTE: Muestra 'MIS RESERVAS' solo si es Cliente, si no 'MI PERFIL' */}
                {isClient ? 'MIS RESERVAS' : 'MI PERFIL'} 
              </a>
            </li>

            {/* ADMIN SOLO SI ES ADMIN */}
            {isAdmin && (
              <li className="nav-item mx-0 mx-lg-1">
                <a
                  className="nav-link btn-link rounded"
                  href="#"
                  onClick={handleAdminClick}
                >
                  ADMIN
                </a>
              </li>
            )}

            {/* SALUDO + LOGIN/LOGOUT */}
            {user ? (
              <>
                <li className="nav-item mx-0 mx-lg-1 d-flex align-items-center">
                  <span className="navbar-greeting">
                    {/* ✅ CORRECCIÓN: Muestra el nombre (user.name) en lugar del email */}
                    HOLA, {user.name ? user.name.toUpperCase() : 'USUARIO'}
                  </span>
                </li>
                <li className="nav-item mx-0 mx-lg-1">
                  <button
                    className="logout-btn"
                    type="button"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item mx-0 mx-lg-1">
                <button
                  className="login-btn"
                  type="button"
                  onClick={onLoginClick}
                >
                  Iniciar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}