const API_RESERVAS_URL =
  import.meta.env.VITE_API_RESERVA_URL || 'http://localhost:8083/api/reservas'

async function handleResponse(resp) {
  // Intentamos parsear JSON (por si la API responde con cuerpo)
  const data = await resp.json().catch(() => null)

  if (!resp.ok) {
    const msg =
      data?.message ||
      data?.error ||
      data?.detalle ||
      `Error ${resp.status} al consumir API de reservas`
    throw new Error(msg)
  }

  return data
}

// === POST: crear nueva reserva ===
export async function crearReserva(body) {
  const resp = await fetch(API_RESERVAS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return handleResponse(resp)
}

// === GET: obtener todas las reservas (para panel admin) ===
export async function listarReservas() {
  const resp = await fetch(API_RESERVAS_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  return handleResponse(resp)
}

// === PUT: actualizar una reserva por id ===
export async function actualizarReserva(id, body) {
  const resp = await fetch(`${API_RESERVAS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return handleResponse(resp)
}

// === DELETE: eliminar una reserva por id ===
export async function eliminarReserva(id) {
  const resp = await fetch(`${API_RESERVAS_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(
      text || `Error ${resp.status} al eliminar la reserva con id ${id}`,
    )
  }
}
