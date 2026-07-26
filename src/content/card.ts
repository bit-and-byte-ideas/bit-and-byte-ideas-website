export interface BuildStep {
  number: string;
  label: string;
  description: string;
}

/** Copy for the /connect digital business card landing page (QR code target). */
export const card = {
  eyebrow: 'Scan to Connect',
  pitch:
    "Custom websites, web apps, and automation for small businesses — built in San Diego, shipped anywhere.",
  buildSteps: [
    {
      number: '01',
      label: 'Build',
      description: 'Custom websites & web apps — no templates or page builders.',
    },
    {
      number: '02',
      label: 'Automate',
      description: 'Connect the tools you already use so work happens without you.',
    },
    {
      number: '03',
      label: 'Maintain',
      description: 'Hosting, backups, and security patches — handled monthly.',
    },
  ] satisfies BuildStep[],
  credentialLine: '18+ years building fintech, energy, and financial services platforms.',
};
