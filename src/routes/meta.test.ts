import { meta as aboutMeta } from './about';
import { meta as connectMeta } from './connect';
import { meta as homeMeta } from './home';
import { meta as notFoundMeta } from './not-found';

interface Descriptor {
  title?: string;
  name?: string;
  content?: string;
}

const routes = [
  ['home', homeMeta],
  ['about', aboutMeta],
  ['connect', connectMeta],
  ['not-found', notFoundMeta],
] as const;

describe.each(routes)('%s meta', (_name, meta) => {
  const descriptors = meta() as Descriptor[];

  it('keeps the title short enough to show in full in search results', () => {
    const title = descriptors.find((d) => d.title)?.title ?? '';
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it('keeps the description short enough to show in full in search results', () => {
    const description = descriptors.find((d) => d.name === 'description')?.content ?? '';
    expect(description.length).toBeGreaterThan(0);
    expect(description.length).toBeLessThanOrEqual(160);
  });
});
