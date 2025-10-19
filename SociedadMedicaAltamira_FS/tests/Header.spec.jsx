import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header.jsx';

describe('Header', () => {
  it('renderiza el título, subtítulo e imagen correctamente', () => {
    render(<Header />);

    // 1️⃣ Valida el <h1> con el nombre de la doctora
    const heading = screen.getByRole('heading', { level: 1, name: /dra maria jesus rojas/i });
    expect(heading).toBeTruthy();

    // 2️⃣ Valida el subtítulo
    const subtitle = screen.getByText(/Rinología y Cirugía Plástica Facial/i);
    expect(subtitle).toBeTruthy();

    // 3️⃣ Valida la imagen principal
    const img = screen.getByRole('img', { name: /avatar/i });
    expect(img).toHaveAttribute('src', '/assets/img/dra-maria-rojas-banner.jpg');
    expect(img).toHaveAttribute('alt', 'avatar');
  });

  it('usa clases CSS esperadas en el header', () => {
    render(<Header />);
    const header = screen.getByRole('banner'); // <header> tiene role="banner"
    expect(header.className).toContain('masthead');
    expect(header.className).toContain('bg-primary');
  });
});
