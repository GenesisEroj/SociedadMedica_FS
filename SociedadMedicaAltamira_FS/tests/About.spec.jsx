import { render, screen } from '@testing-library/react';
import About from '../src/components/About.jsx';

describe('About', () => {
  it('renderiza contenido de About', () => {
    render(<About />);
    // Cambia por una frase que esté en tu About.jsx
    expect(screen.getByText(/Acerca de/i)).toBeTruthy();
  });
});
