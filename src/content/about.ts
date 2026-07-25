export interface TechGroup {
  title: string;
  summary: string;
  items: string[];
}

export interface ClientFit {
  number: string;
  title: string;
  description: string;
}

export const techIntro =
  "You don't need to know what any of this means to work with us — here's the plain-English version of what each area covers.";

export const about = {
  label: 'Founder — Bit & Byte Ideas',
  role: 'Founder & Engineer',
  name: 'Carlos Barajas',
  yearsExperience: '18+',
  bio: [
    "I've been building software and infrastructure since 2008 — starting as a programmer analyst and working my way through senior engineering, management, and platform leadership roles across fintech, energy, and financial services.",
    "Most recently I've focused on platform engineering: running developer experience, designing GitOps workflows, and building the cloud infrastructure that engineering teams depend on daily. Before that, I managed site reliability at Shell Recharge Solutions, where I stood up end-to-end observability, incident management, and Kubernetes-based container orchestration across AWS — all managed as code with Terraform.",
    'Earlier in my career I led a software engineering team of 20+ people, introduced TDD practices and CI/CD pipelines from scratch, and helped start the first DevOps team at LightStream. I also spent a year teaching Java and JavaScript at Coleman University.',
    'I founded Bit & Byte Ideas in 2024 to bring that same engineering discipline to small businesses and startups who deserve reliable, well-built software — without the overhead of a large agency.',
  ],
  techGroups: [
    {
      title: 'Frontend',
      summary: 'The parts your customers actually see and click.',
      items: [
        'React & TypeScript',
        'HTML / CSS',
        'Static Site Generation & SSR',
        'Progressive Web Apps',
      ],
    },
    {
      title: 'Cloud & Infrastructure',
      summary: 'Where your site and data live, and how they stay online.',
      items: [
        'Azure (Static Web Apps, Functions)',
        'AWS (EKS, EC2, RDS, Lambda, S3)',
        'Terraform & OpenTofu',
        'Kubernetes & Helm',
        'Docker',
      ],
    },
    {
      title: 'DevOps & GitOps',
      summary: 'How changes ship safely, and how we catch problems before you do.',
      items: [
        'GitHub Actions',
        'GitLab CI / Bitbucket Pipelines',
        'Datadog, Grafana, Prometheus',
        'PagerDuty',
        'Ansible & SaltStack',
      ],
    },
    {
      title: 'Languages & Backends',
      summary: 'The programming languages powering the logic behind the scenes.',
      items: ['TypeScript / JavaScript', 'Go', 'C# & .NET', 'Java (Spring)', 'Python'],
    },
  ] satisfies TechGroup[],
  clients: [
    {
      number: '01',
      title: 'Small Businesses & Local Services',
      description:
        'You need a professional web presence that actually converts visitors — not a template site that looks like everyone else. I build custom web applications tailored to your brand and your customers.',
    },
    {
      number: '02',
      title: 'Startups & Founders',
      description:
        "You're moving fast and need cloud infrastructure done right from day one. I help founders avoid the expensive mistakes — architecture, CI/CD, deployments, and observability set up before they become problems.",
    },
    {
      number: '03',
      title: 'Teams Needing a Technical Partner',
      description:
        "You have a product idea or an existing codebase that needs engineering horsepower. Whether it's building a new feature, migrating to the cloud, or improving your developer experience — I work alongside your team.",
    },
  ] satisfies ClientFit[],
};
