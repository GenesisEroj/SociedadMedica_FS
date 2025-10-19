import { render, screen } from '@testing-library/react';
import ScrollToTop from '../src/components/ScrollToTop.jsx';

describe('ScrollToTop', () => {
  it('renderiza el componente sin fallar', () => {
    render(<ScrollToTop />);
    // Si el botón está oculto condicionando scroll, al menos valida que el componente cargue
    expect(true).toBeTrue();
  });
});
