import { useEffect, useState } from "react";

export default function Perfil({ onRequestLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  }, []);

  // ⛔ Si NO hay usuario logueado → pantalla de acceso restringido
  if (!user) {
    return (
      <div className="container py-5" style={{ minHeight: "60vh" }}>
        <h2 className="text-center mb-4" style={{ color: "#001d66" }}>
          Debes iniciar sesión para ver tu perfil
        </h2>
        <div className="text-center">
          <button
            className="login-btn"
            type="button"
            onClick={onRequestLogin}
            style={{ padding: "10px 20px", fontSize: "1rem" }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  // 🧑 Datos mockeados de reservas (se reemplazan con tu API real)
  const mockReservas = [
    {
      correo: user.email,
      documento: "RUT",
      edad: "",
      fecha: "2025-12-02 10:30",
      motivo: "Consulta otorrino"
    }
  ];

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h1
        className="text-center mb-4"
        style={{
          color: "#001d66",
          fontWeight: "800",
          fontSize: "2.8rem",
          letterSpacing: "0.15em",
        }}
      >
        MI PERFIL
      </h1>

      <div className="divider-star mb-4">
        <span></span>
        <i className="fas fa-star"></i>
        <span></span>
      </div>

      {/* Datos del usuario */}
      <h3 style={{ color: "#001d66", fontWeight: "700" }}>Datos del usuario</h3>

      <p>
        <strong>Correo:</strong> {user.email}
      </p>
      <p>
        <strong>Rol:</strong>{" "}
        {user.rol.toString().trim().toUpperCase()}
      </p>

      <hr style={{ opacity: 0.4 }} />

      {/* Reservas */}
      <h3 style={{ color: "#001d66", fontWeight: "700" }}>Mis reservas</h3>

      {mockReservas.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
        mockReservas.map((reserva, index) => (
          <div
            key={index}
            className="p-3 my-3"
            style={{
              border: "1px solid #dcdcdc",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            <p>
              <strong>{reserva.correo}</strong>
            </p>
            <p>{reserva.correo}</p>

            <p>
              <strong>Documento:</strong> {reserva.documento}
            </p>
            <p>
              <strong>Edad:</strong> {reserva.edad}
            </p>
            <p>
              <strong>Fecha y hora:</strong> {reserva.fecha} –{" "}
              {reserva.motivo}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
