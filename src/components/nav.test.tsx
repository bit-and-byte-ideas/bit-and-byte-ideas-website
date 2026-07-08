import { createRoutesStub } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from './nav';

function renderNav() {
  const Stub = createRoutesStub([{ path: '/', Component: Nav }]);
  return render(<Stub initialEntries={['/']} />);
}

describe('Nav', () => {
  it('renders a skip link to the main content', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('opens Book a Call links to Calendly in a new tab', () => {
    renderNav();
    const bookLinks = screen.getAllByRole('link', { name: /book a call/i });
    expect(bookLinks.length).toBeGreaterThan(0);
    for (const link of bookLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('toggles the mobile menu with aria-expanded state', async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Close navigation menu' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
