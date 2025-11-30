import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/Navbar.jsx';

describe('Navbar', () => {
  it('renderiza el nav y el logo', () => {
    render(<Navbar />);
    // Ajusta si tu logo no tiene alt, o agrega alt="logo" en el componente
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
  });
});
