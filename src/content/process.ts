export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Consult',
    description:
      "We start with a 30-minute call to understand your goals, timeline, and constraints. No pitch — just a direct conversation about what you need and whether we're the right fit.",
  },
  {
    number: '02',
    title: 'Build',
    description:
      'We design, develop, and test your solution with regular check-ins. You see real progress weekly — no black-box development, no surprises at the end.',
  },
  {
    number: '03',
    title: 'Launch',
    description:
      'We deploy to production, verify performance, and hand off full documentation. Ongoing support is available from day one if you need it.',
  },
];
