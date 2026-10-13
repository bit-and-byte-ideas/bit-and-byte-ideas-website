import { render, screen, within } from '@testing-library/react';
import type { Root } from 'hast';
import { MemoryRouter } from 'react-router';
import type { ResolvedImage } from '../content/collections/media.ts';
import type { WorkDetail } from '../content/collections/work-view.ts';
import { site } from '../content/site';
import { workPage } from '../content/work-page';
import { CaseStudy } from './case-study';
import { ContentBody } from './content-body';
import { ContentStatusBanner, ContentStatusTag } from './content-status';
import { CtaBand } from './cta-band';
import { EmptyState } from './empty-state';
import { KindBadge } from './kind-badge';
import { NotFoundContent } from './not-found-content';
import { PageHeader } from './page-header';
import { ProjectMeta } from './project-meta';
import { ProjectRow } from './project-row';

const image: ResolvedImage = {
  width: 2880,
  height: 1800,
  src: '/media/work/demo/home-1200.abcd1234.webp',
  avifSrcSet: '/media/work/demo/home-1200.abcd1234.avif 1200w',
  webpSrcSet: '/media/work/demo/home-1200.abcd1234.webp 1200w',
};

const project: WorkDetail = {
  slug: 'demo',
  title: 'Demo project',
  summary: 'A summary of the demo project for tests.',
  kind: 'client',
  kindLabel: 'Client project',
  industry: 'Dental practice',
  categoryLabel: 'Website',
  serviceLabels: ['Website & Application Development'],
  cover: { image, alt: 'Demo homepage above the fold', viewport: 'desktop' },
  status: 'published',
  fixture: false,
  technologies: ['React', 'Go'],
  completedOn: { iso: '2026-03', label: 'March 2026' },
  liveUrl: 'https://example.com',
  outcomes: ['Bookings moved online.'],
  gallery: [],
  seo: {},
};

const withRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('PageHeader', () => {
  it('renders the only H1 with an accent word and dek', () => {
    render(<PageHeader label="work" title="Selected" titleAccent="Work" dek="Dek text." />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Selected Work');
    expect(screen.getByText('Dek text.')).toBeInTheDocument();
  });
});

describe('KindBadge', () => {
  it('names the kind in text', () => {
    render(<KindBadge kind="concept" label="Concept" />);
    expect(screen.getByText('Concept')).toBeInTheDocument();
  });
});

describe('ContentStatusBanner', () => {
  it('shows nothing for published real content', () => {
    const { container } = render(
      <ContentStatusBanner entry={{ status: 'published', fixture: false }} messages={workPage.status} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('marks drafts (even draft fixtures) as drafts', () => {
    render(<ContentStatusBanner entry={{ status: 'draft', fixture: true }} messages={workPage.status} />);
    expect(screen.getByRole('note')).toHaveTextContent(workPage.status.draft);
    expect(screen.getByRole('note')).toHaveAttribute('data-content-status', 'draft');
  });

  it('marks fixtures', () => {
    render(<ContentStatusTag entry={{ status: 'published', fixture: true }} />);
    expect(screen.getByText('Fixture')).toHaveAttribute('data-content-status', 'fixture');
  });
});

describe('CtaBand', () => {
  it('uses only the two site CTA labels and destinations', () => {
    render(<CtaBand label="Have a similar problem?" heading="Let's Talk." />);
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Book a Call (opens in new tab)', 'Get in Touch']);
    expect(links[0]).toHaveAttribute('href', site.calendlyUrl);
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[1]).toHaveAttribute('href', '/#contact');
  });
});

describe('EmptyState', () => {
  it('states the empty collection honestly', () => {
    render(<EmptyState heading={workPage.empty.heading} body={workPage.empty.body} />);
    expect(screen.getByRole('heading', { level: 2, name: workPage.empty.heading })).toBeInTheDocument();
  });
});

describe('ProjectRow', () => {
  it('gives the row one link, named by the project title, with the cover image', () => {
    withRouter(<ProjectRow project={project} cue={workPage.viewProject} priority />);
    const link = screen.getByRole('link');
    expect(link).toHaveAccessibleName('Demo project');
    expect(link).toHaveAttribute('href', '/work/demo');
    expect(screen.getByRole('img', { name: 'Demo homepage above the fold' })).toHaveAttribute('fetchpriority', 'high');
    expect(screen.getByText('Client project')).toBeInTheDocument();
  });
});

describe('ProjectMeta', () => {
  it('lists the facts and opens the live site in a new tab', () => {
    render(<ProjectMeta project={project} labels={workPage.details} />);
    const details = screen.getByRole('complementary', { name: workPage.details.label });
    expect(within(details).getByText('Dental practice')).toBeInTheDocument();
    expect(within(details).getByText('March 2026').closest('time')).toHaveAttribute('dateTime', '2026-03');
    const live = within(details).getByRole('link');
    expect(live).toHaveAttribute('href', 'https://example.com');
    expect(live).toHaveAttribute('target', '_blank');
    expect(live).toHaveTextContent('(opens in new tab)');
  });

  it('omits the live link when there is none', () => {
    render(<ProjectMeta project={{ ...project, liveUrl: null }} labels={workPage.details} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});

const tree: Root = {
  type: 'root',
  children: [
    { type: 'element', tagName: 'h2', properties: { id: 'problem' }, children: [{ type: 'text', value: 'Problem' }] },
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        { type: 'element', tagName: 'a', properties: { href: 'https://example.com' }, children: [{ type: 'text', value: 'external' }] },
        { type: 'text', value: ' and ' },
        { type: 'element', tagName: 'a', properties: { href: '/work' }, children: [{ type: 'text', value: 'internal' }] },
      ],
    },
    { type: 'element', tagName: 'img', properties: { src: './images/diagram.png', alt: 'A diagram of the flow' }, children: [] },
    { type: 'element', tagName: 'img', properties: { src: './images/unknown.png', alt: 'Missing image' }, children: [] },
  ],
};

describe('ContentBody', () => {
  it('renders headings, links, and manifest-backed images', () => {
    withRouter(<ContentBody tree={tree} images={{ './images/diagram.png': image }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Problem' })).toHaveAttribute('id', 'problem');
    const external = screen.getByRole('link', { name: /external/ });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'internal' })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('img', { name: 'A diagram of the flow' }).closest('figure')).not.toBeNull();
    expect(screen.queryByRole('img', { name: 'Missing image' })).toBeNull();
  });
});

describe('CaseStudy', () => {
  it('adds an Outcomes section only when there are outcomes', () => {
    const { rerender } = withRouter(
      <CaseStudy body={tree} outcomes={['Bookings moved online.']} outcomesHeading="Outcomes" />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Outcomes' })).toBeInTheDocument();
    expect(screen.getByText('Bookings moved online.')).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <CaseStudy body={tree} outcomes={[]} outcomesHeading="Outcomes" />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('heading', { name: 'Outcomes' })).toBeNull();
  });
});

describe('NotFoundContent', () => {
  it('renders the branded 404 heading', () => {
    withRouter(<NotFoundContent />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This page took a wrong turn.');
  });
});
