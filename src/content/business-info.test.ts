import { businessInfo, mailtoHref } from './business-info';

describe('businessInfo', () => {
  it('exposes the studio contact email', () => {
    expect(businessInfo.email).toBe('info@bitandbyteideas.com');
  });

  it('builds a valid mailto href from the email', () => {
    expect(mailtoHref).toBe(`mailto:${businessInfo.email}`);
  });
});
