import { render, screen } from '@testing-library/react';
import Portfolio from '../src/components/Portfolio.jsx';

describe('Portfolio', () => {
  it('muestra secciones/ítems del portafolio', () => {
    render(<Portfolio />);
    // Si hay títulos visibles, ajústalos según tu JSX real
    // Por ejemplo, si cada card tiene un "portfolio-item"
    const cards = screen.getAllByRole('img'); // o por texto visible
    expect(cards.length).toBeGreaterThan(0);
  });
});
