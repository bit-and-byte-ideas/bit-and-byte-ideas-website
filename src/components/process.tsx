import { processSteps } from '../content/process';
import './process.css';

export function Process() {
  return (
    <section id="process" className="process" aria-labelledby="process-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-label">How We Work</span>
          <h2 id="process-heading" className="section-title">
            Simple Process.
            <br />
            <em>No Surprises.</em>
          </h2>
        </header>
        <ol className="steps" aria-label="Our process">
          {processSteps.map((step) => (
            <li className="step" key={step.number}>
              <span className="step-number" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
