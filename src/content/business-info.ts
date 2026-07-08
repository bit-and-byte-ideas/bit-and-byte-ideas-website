export interface BusinessInfo {
  email: string;
  responseTime: string;
  availability: string;
  workingWith: string;
}

export const businessInfo: BusinessInfo = {
  email: 'info@bitandbyteideas.com',
  responseTime: 'Within 24 hours',
  availability: 'Currently accepting clients',
  workingWith: 'Small & medium businesses',
};

export const mailtoHref = `mailto:${businessInfo.email}`;
