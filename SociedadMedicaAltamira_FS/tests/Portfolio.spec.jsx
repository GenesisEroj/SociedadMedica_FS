import { render, screen } from '@testing-library/react';
import Portfolio from '../src/components/Portfolio.jsx';

describe('Portfolio', () => {
  it('muestra el título y 5 imágenes del portafolio', () => {
    render(<Portfolio />);

    // 1) Valida el título de la sección
    const h2 = screen.getByRole('heading', { level: 2, name: /galeria/i });
    expect(h2).toBeTruthy();

    // 2) Valida que existan exactamente 5 imágenes (según tu array items)
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(5);

    // 3) Valida que la primera imagen tenga alt "1" (coincide con tu items[0].title)
    expect(imgs[0]).toHaveAttribute('alt', '1');

    // 4) Valida que existan 5 links que apunten al href de cada imagen (ancla <a href=it.img>)
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
    expect(links[0]).toHaveAttribute('href', '/assets/img/portfolio/1.jpg');
  });
});
