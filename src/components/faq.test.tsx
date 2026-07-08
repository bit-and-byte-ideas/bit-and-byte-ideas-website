import { render, screen } from '@testing-library/react';
import { Faq } from './faq';
import { faqItems } from '../content/faq';

describe('Faq', () => {
  it('renders every question from the content module', () => {
    render(<Faq />);
    for (const item of faqItems) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it('renders the section with its anchor id and heading', () => {
    render(<Faq />);
    const section = screen.getByRole('region', { name: /questions/i });
    expect(section).toHaveAttribute('id', 'faq');
  });

  it('mentions San Diego in the location answer (SEO H5)', () => {
    render(<Faq />);
    expect(screen.getByText(/San Diego, California/)).toBeInTheDocument();
  });
});
