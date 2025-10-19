import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '../src/components/Contact.jsx';

describe('Contact', () => {
  it('muestra campos del formulario', () => {
    render(<Contact />);
    // Ajusta los labels/placeholders a los de tu componente real
    // Ejemplo genérico:
    // expect(screen.getByLabelText(/nombre/i)).toBeTruthy();
    // expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });

  it('permite escribir en un campo (ejemplo)', () => {
    render(<Contact />);
    // const name = screen.getByLabelText(/nombre/i);
    // fireEvent.change(name, { target: { value: 'Genesis' } });
    // expect(name.value).toBe('Genesis');
  });
});
