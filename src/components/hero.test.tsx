import { render, screen } from '@testing-library/react';
import { Hero } from './hero';

describe('Hero', () => {
  it('renders the headline as the page h1', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/we build/i);
  });

  it('renders both calls to action', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Explore Services' })).toHaveAttribute(
      'href',
      '#services',
    );
    expect(screen.getByRole('link', { name: 'Get in Touch' })).toHaveAttribute('href', '#contact');
  });
});
