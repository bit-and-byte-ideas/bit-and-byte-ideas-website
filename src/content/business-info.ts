export interface BusinessInfo {
  email: string;
  responseTime: string;
  availability: string;
  workingWith: string;
  /** Display-formatted phone number, e.g. for on-screen labels. */
  phoneDisplay: string;
  /** E.164 phone number for tel:/sms: links and the vCard file. */
  phoneE164: string;
}

export const businessInfo: BusinessInfo = {
  email: 'info@bitandbyteideas.com',
  responseTime: 'Within 24 hours',
  availability: 'Currently accepting clients',
  workingWith: 'Small & medium businesses',
  phoneDisplay: '(619) 431-1733',
  phoneE164: '+16194311733',
};

export const mailtoHref = `mailto:${businessInfo.email}`;
export const telHref = `tel:${businessInfo.phoneE164}`;
export const smsHref = `sms:${businessInfo.phoneE164}`;
/** Static vCard asset served verbatim from public/ (see connect route). */
export const vcardHref = '/assets/carlos-barajas.vcf';
