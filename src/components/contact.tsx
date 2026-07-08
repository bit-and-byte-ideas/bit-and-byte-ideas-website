import { businessInfo, mailtoHref } from '../content/business-info';
import './contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-main">
            <div className="contact-label">
              <span className="label-line" aria-hidden="true" />
              Start a Project
            </div>
            <h2 id="contact-heading" className="contact-headline">
              Ready to build
              <br />
              something <em>great?</em>
            </h2>
            <p className="contact-sub">
              Tell us what you're building, what's blocking you, or just a rough idea. We'll get
              back to you within one business day with honest thoughts and a clear path forward.
            </p>
            <a href={mailtoHref} className="contact-btn">
              <span>{businessInfo.email}</span>
              <span className="btn-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <aside className="contact-details" aria-label="Contact details">
            <div className="detail-item">
              <span className="detail-label">Response time</span>
              <span className="detail-value">{businessInfo.responseTime}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Availability</span>
              <span className="detail-value">{businessInfo.availability}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Working with</span>
              <span className="detail-value">{businessInfo.workingWith}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
