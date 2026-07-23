export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'How much does a project cost?',
    answer:
      "Every project is quoted individually after a free 30-minute consultation — scope, integrations, and timeline drive the price, so we'd rather give you an accurate number than a misleading range. Maintenance + hosting is a flat monthly subscription.",
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      "Timelines vary by scope — a static site is typically the fastest to ship, while a web application is estimated during the consultation. Either way, you'll see progress weekly.",
  },
  {
    question: 'Do you use templates or page builders?',
    answer:
      'Every site is custom-built around your brand, your customers, and how fast it actually loads for them.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'You own everything — code, content, and infrastructure. Most clients add the maintenance + hosting subscription: managed cloud hosting, security updates, backups, monitoring, and keeping any automations running as the tools on either end change.',
  },
  {
    question: 'Can you take over an existing website or codebase?',
    answer:
      "Yes. We start with a technical review, give you an honest assessment of what's worth keeping, and take it from there.",
  },
  {
    question: 'Do I need a website, a full application, or just my tools connected?',
    answer:
      "Most businesses start with a website; you add application features like logins or dashboards only when customers need to interact with the system directly. But sometimes the real bottleneck isn't your website at all — it's the manual work between the tools you already use. We'll help you figure out which one (or which combination) actually solves the problem during our assessment.",
  },
  {
    question: 'What does "business automation" actually mean?',
    answer:
      "It means the manual, repetitive parts of running your business — copying data between systems, re-entering the same customer information twice, manually sending a follow-up email after every sale — get handled automatically. Describe how you currently do it and we'll tell you what's possible; you don't need to know any technical terms to start that conversation.",
  },
  {
    question: 'Where are you located and who do you work with?',
    answer:
      "We're a software studio based in San Diego, California, working remotely with small and medium businesses across the United States. Response time is within one business day.",
  },
];
