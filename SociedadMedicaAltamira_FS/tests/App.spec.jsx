// tests/App.spec.jsx
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';

describe('App', () => {
  it('renderiza el header principal', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /Dra Maria Jesus Rojas/i });
    expect(heading).toBeTruthy();
  });
});
