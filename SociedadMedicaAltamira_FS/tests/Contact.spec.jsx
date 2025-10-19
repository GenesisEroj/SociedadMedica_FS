import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '../src/components/Contact.jsx';

describe('Contact', () => {
  it('muestra el título y los campos del formulario', () => {
    render(<Contact />);

    // 1) Título de la sección
    const h2 = screen.getByRole('heading', { level: 2, name: /contactame/i });
    expect(h2).toBeTruthy();

    // 2) Inputs por placeholder (tus <label> no están asociados con htmlFor)
    const name = screen.getByPlaceholderText(/your name/i);
    const email = screen.getByPlaceholderText(/name@example\.com/i);
    const phone = screen.getByPlaceholderText(/\(123\)\s*456-7890/i);
    const message = screen.getByPlaceholderText(/enter your message here/i);

    expect(name).toBeTruthy();
    expect(email).toBeTruthy();
    expect(phone).toBeTruthy();
    expect(message).toBeTruthy();

    // 3) Botón enviar
    const submit = screen.getByRole('button', { name: /enviar/i });
    expect(submit).toBeTruthy();
  });

  it('muestra errores de validación si envío vacío', () => {
    render(<Contact />);

    const submit = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submit);

    // Tu validate() setea estos mensajes si están vacíos
    expect(screen.getByText(/nombre es requerido/i)).toBeTruthy();
    expect(screen.getByText(/correo inválido/i)).toBeTruthy();
    expect(screen.getByText(/teléfono es requerido/i)).toBeTruthy();
    expect(screen.getByText(/mensaje es requerido/i)).toBeTruthy();
  });

  it('envía con datos válidos y muestra el mensaje de éxito', () => {
    render(<Contact />);

    // Importante: como tus labels no están asociados (no hay htmlFor),
    // buscamos inputs por placeholder:
    const name = screen.getByPlaceholderText(/your name/i);
    const email = screen.getByPlaceholderText(/name@example\.com/i);
    const phone = screen.getByPlaceholderText(/\(123\)\s*456-7890/i);
    const message = screen.getByPlaceholderText(/enter your message here/i);

    fireEvent.change(name, { target: { value: 'Genesis' } });
    fireEvent.change(email, { target: { value: 'genesis@example.com' } });
    fireEvent.change(phone, { target: { value: '999999999' } });
    fireEvent.change(message, { target: { value: 'Hola, este es un mensaje de prueba.' } });

    const submit = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submit);

    // Tu submit setea setOk('✅ Mensaje enviado.')
    expect(screen.getByText(/mensaje enviado/i)).toBeTruthy();

    // Además limpias el formulario; opcionalmente lo validamos:
    expect(name.value).toBe('');
    expect(email.value).toBe('');
    expect(phone.value).toBe('');
    expect(message.value).toBe('');
  });

  it('muestra error si el email es inválido y no envía', () => {
    render(<Contact />);

    const name = screen.getByPlaceholderText(/your name/i);
    const email = screen.getByPlaceholderText(/name@example\.com/i);
    const phone = screen.getByPlaceholderText(/\(123\)\s*456-7890/i);
    const message = screen.getByPlaceholderText(/enter your message here/i);

    fireEvent.change(name, { target: { value: 'Genesis' } });
    fireEvent.change(email, { target: { value: 'correo_malo' } }); // inválido para tu regex
    fireEvent.change(phone, { target: { value: '999999999' } });
    fireEvent.change(message, { target: { value: 'Hola' } });

    const submit = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submit);

    // Debe aparecer "Correo inválido"
    expect(screen.getByText(/correo inválido/i)).toBeTruthy();

    // Y NO debería aparecer el ok
    const ok = screen.queryByText(/mensaje enviado/i);
    expect(ok).toBeNull();
  });
});
