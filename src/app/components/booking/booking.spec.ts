import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Booking } from './booking';

describe('Booking', () => {
  let fixture: ComponentFixture<Booking>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Booking],
    }).compileComponents();

    fixture = TestBed.createComponent(Booking);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose the correct calendlyUrl', () => {
    expect(fixture.componentInstance.calendlyUrl).toBe(
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min?background_color=111827&text_color=f8fafc&primary_color=22c55e&hide_gdpr_banner=1',
    );
  });

  it('should bind calendlyUrl to the data-url attribute of the Calendly widget', () => {
    const widget = nativeEl.querySelector<HTMLElement>('.calendly-inline-widget');
    expect(widget?.getAttribute('data-url')).toBe(fixture.componentInstance.calendlyUrl);
  });

  it('should have aria-labelledby="booking-heading" on the section', () => {
    const section = nativeEl.querySelector<HTMLElement>('section.booking');
    expect(section?.getAttribute('aria-labelledby')).toBe('booking-heading');
  });

  it('should have id="booking-heading" on the h2', () => {
    const heading = nativeEl.querySelector<HTMLHeadingElement>('h2');
    expect(heading?.getAttribute('id')).toBe('booking-heading');
  });

  it('should have the correct aria-label on the Calendly widget', () => {
    const widget = nativeEl.querySelector<HTMLElement>('.calendly-inline-widget');
    expect(widget?.getAttribute('aria-label')).toBe('Schedule a free 30-minute consultation');
  });

  it('should render a heading that contains "Let\'s Talk About"', () => {
    const heading = nativeEl.querySelector<HTMLHeadingElement>('h2');
    expect(heading?.textContent).toContain("Let's Talk About");
  });

  it('should have id="booking" on the section', () => {
    const section = nativeEl.querySelector<HTMLElement>('section');
    expect(section?.getAttribute('id')).toBe('booking');
  });
});
