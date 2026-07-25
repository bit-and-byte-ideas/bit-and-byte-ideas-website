import { faqCategories, faqItems } from '../content/faq';
import './faq.css';

export function Faq() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-label">faq</span>
          <h2 id="faq-heading" className="section-title">
            Questions, <em>Answered.</em>
          </h2>
        </header>
        <div className="faq-groups">
          {faqCategories.map((category) => (
            <div className="faq-group" key={category}>
              <h3 className="faq-group-title">{category}</h3>
              <div className="faq-list">
                {faqItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <details className="faq-item" key={item.question}>
                      <summary className="faq-question">
                        {item.question}
                        <span className="faq-marker" aria-hidden="true" />
                      </summary>
                      <p className="faq-answer">{item.answer}</p>
                    </details>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
