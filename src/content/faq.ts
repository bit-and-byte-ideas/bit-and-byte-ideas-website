export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'How much does a website cost?',
    answer:
      "Every project is quoted individually after a free 30-minute consultation — scope, integrations, and timeline drive the price, so we'd rather give you an accurate number than a misleading range. Maintenance + hosting is a flat monthly subscription.",
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'A typical static marketing site ships in 2–4 weeks from kickoff. Web applications depend on scope and are estimated during the consultation, with progress you can see weekly.',
  },
  {
    question: 'Do you use templates or page builders?',
    answer:
      'No — every site is custom-designed and hand-built for your brand, your customers, and Core Web Vitals performance.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'You own everything — code, content, and infrastructure. Most clients add the maintenance + hosting subscription: managed cloud hosting, security updates, backups, monitoring, and priority support for small changes.',
  },
  {
    question: 'Can you take over an existing website or codebase?',
    answer:
      "Yes. We start with a technical review, give you an honest assessment of what's worth keeping, and take it from there.",
  },
  {
    question: 'Do I need a web application or just a website?',
    answer:
      "If your customers only need to find and contact you, a fast static site is usually right. If they need to log in, submit data, or run a workflow, that's an application — the consultation sorts this out in the first ten minutes.",
  },
  {
    question: 'Where are you located and who do you work with?',
    answer:
      "We're a software studio based in San Diego, California, working remotely with small and medium businesses across the United States. Response time is within one business day.",
  },
];
