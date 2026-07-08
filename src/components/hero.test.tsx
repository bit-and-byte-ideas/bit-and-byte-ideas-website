import { render, screen } from '@testing-library/react';
import { Hero } from './hero';
import { site } from '../content/site';

describe('Hero', () => {
  it('renders the headline as the page h1', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/we build/i);
  });

  it('renders Book a Call as the primary CTA linking to Calendly', () => {
    render(<Hero />);
    const primary = screen.getByRole('link', { name: 'Book a Call' });
    expect(primary).toHaveAttribute('href', site.calendlyUrl);
    expect(primary).toHaveAttribute('target', '_blank');
    expect(primary).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the secondary CTA anchored to services', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Explore Services' })).toHaveAttribute('href', '#services');
  });
});
