import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  type LinksFunction,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import { Nav } from './components/nav';
import { Footer } from './components/footer';
import '@fontsource-variable/bricolage-grotesque/index.css';
import '@fontsource-variable/public-sans/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './design/base.css';
// Latin subsets of the two above-the-fold faces (hero headline + body copy).
// Without a preload the browser only discovers them after the CSS is parsed,
// which delays the hero text paint (LCP) by a full round trip.
import bricolageLatin from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url';
import publicSansLatin from '@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2?url';

export const links: LinksFunction = () =>
  [bricolageLatin, publicSansLatin].map((href) => ({
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    href,
    crossOrigin: 'anonymous' as const,
  }));

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" type="image/x-icon" href="/BandBIdeas.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const heading =
    isRouteErrorResponse(error) && error.status === 404 ? 'Page not found' : 'Something went wrong';
  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="error-page" aria-labelledby="error-heading">
          <div className="container">
            <h1 id="error-heading">{heading}</h1>
            <p>
              <a href="/">Back to the homepage</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
