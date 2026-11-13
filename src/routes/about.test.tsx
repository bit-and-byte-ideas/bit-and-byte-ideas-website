import { render, screen } from '@testing-library/react';
import About from './about';
import { workItems } from '../content/work';

describe('About — recent work', () => {
  it('lists each named client with a link to their live site', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'Built for Real Businesses' })).toBeInTheDocument();
    for (const item of workItems) {
      expect(screen.getByRole('heading', { level: 3, name: item.client })).toBeInTheDocument();
      const link = screen.getByRole('link', { name: `Visit ${item.urlLabel} (opens in new tab)` });
      expect(link).toHaveAttribute('href', item.url);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
