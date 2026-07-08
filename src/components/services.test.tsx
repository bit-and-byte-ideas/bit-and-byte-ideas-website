import { render, screen } from '@testing-library/react';
import { Services } from './services';
import { services } from '../content/services';

describe('Services', () => {
  it('renders every service line from the content module', () => {
    render(<Services />);
    for (const service of services) {
      expect(screen.getByRole('heading', { name: service.title, level: 3 })).toBeInTheDocument();
    }
  });

  it('renders the section heading with its anchor id', () => {
    render(<Services />);
    const section = screen.getByRole('region', { name: /services built/i });
    expect(section).toHaveAttribute('id', 'services');
  });
});
