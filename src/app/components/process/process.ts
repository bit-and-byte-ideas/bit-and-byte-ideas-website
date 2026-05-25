import { Component, ChangeDetectionStrategy } from '@angular/core';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [],
  templateUrl: './process.html',
  styleUrl: './process.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Process {
  protected readonly steps: Step[] = [
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
}
