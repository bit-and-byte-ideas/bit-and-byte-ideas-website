import { Fragment } from 'react';
import { trustItems } from '../content/trust';
import './trust-strip.css';

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="At a glance">
      <div className="container">
        <ul className="trust-items" role="list">
          {trustItems.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && <li className="trust-divider" aria-hidden="true" />}
              <li className="trust-item">
                <span className="trust-value">{item.value}</span>
                <span className="trust-label">{item.label}</span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
