import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header.jsx';

describe('Header', () => {
  it('muestra el heading principal', () => {
    render(<Header />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Dra Maria Jesus Rojas/i })
    ).toBeTruthy();
  });

  it('muestra el subtítulo', () => {
    render(<Header />);
    expect(
      screen.getByText(/Rinología y Cirugía Plástica Facial/i)
    ).toBeTruthy();
  });
});
