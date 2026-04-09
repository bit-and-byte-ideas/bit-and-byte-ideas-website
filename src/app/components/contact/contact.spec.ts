import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { BusinessInfoService } from '../../services/business-info.service';

const mockBusinessInfo = {
  info: {
    email: 'test@example.com',
    responseTime: '48 hours',
    availability: 'Fully booked',
    workingWith: 'Enterprise clients',
  },
  get mailtoHref() {
    return `mailto:${this.info.email}`;
  },
};

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [{ provide: BusinessInfoService, useValue: mockBusinessInfo }],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the email address from the service', () => {
    expect(nativeEl.textContent).toContain('test@example.com');
  });

  it('should bind the mailto href from the service', () => {
    const link = nativeEl.querySelector<HTMLAnchorElement>('.contact-btn');
    expect(link?.href).toBe('mailto:test@example.com');
  });

  it('should display response time from the service', () => {
    expect(nativeEl.textContent).toContain('48 hours');
  });

  it('should display availability from the service', () => {
    expect(nativeEl.textContent).toContain('Fully booked');
  });

  it('should display workingWith from the service', () => {
    expect(nativeEl.textContent).toContain('Enterprise clients');
  });

  it('should use the service mailtoHref for the contact button href', () => {
    const link = nativeEl.querySelector<HTMLAnchorElement>('.contact-btn');
    expect(link?.href).toBe(mockBusinessInfo.mailtoHref);
  });
});
