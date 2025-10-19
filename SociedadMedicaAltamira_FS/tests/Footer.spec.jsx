import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer.jsx';

describe('Footer', () => {
  it('muestra el footer', () => {
    render(<Footer />);
    // Busca una frase o link que exista en tu Footer.jsx
    // expect(screen.getByText(/copyright/i)).toBeTruthy();
  });
});
