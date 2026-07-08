import { createRoutesStub } from 'react-router';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

function renderFooter() {
  const Stub = createRoutesStub([{ path: '/', Component: Footer }]);
  return render(<Stub initialEntries={['/']} />);
}

describe('Footer', () => {
  it('renders the current copyright year', () => {
    renderFooter();
    const year = String(new Date().getFullYear());
    expect(screen.getByText((text) => text.includes(year))).toBeInTheDocument();
  });

  it('renders the GitHub link with an accessible label', () => {
    renderFooter();
    const github = screen.getByRole('link', { name: /github — bit-and-byte-ideas/i });
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders footer navigation with the informative logo alt text', () => {
    renderFooter();
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(screen.getByAltText('Bit and Byte Ideas')).toBeInTheDocument();
  });
});
