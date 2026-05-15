import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

  afterEach(() => {
    delete (window as Window & { Calendly?: unknown }).Calendly;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose the correct calendlyUrl', () => {
    expect(fixture.componentInstance.calendlyUrl).toBe(
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min?background_color=111827&text_color=f8fafc&primary_color=22c55e&hide_gdpr_banner=1',
    );
  });

  it('should render the Calendly container with the correct class', () => {
    const container = nativeEl.querySelector<HTMLElement>('.calendly-inline-widget');
    expect(container).not.toBeNull();
  });

  it('should have aria-labelledby="booking-heading" on the section', () => {
    const section = nativeEl.querySelector<HTMLElement>('section.booking');
    expect(section?.getAttribute('aria-labelledby')).toBe('booking-heading');
  });

  it('should have id="booking-heading" on the h2', () => {
    const heading = nativeEl.querySelector<HTMLHeadingElement>('h2');
    expect(heading?.getAttribute('id')).toBe('booking-heading');
  });

  it('should have the correct aria-label on the Calendly container', () => {
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

  it('should call Calendly.initInlineWidget with the correct URL when Calendly is already loaded', () => {
    const initInlineWidget = vi.fn();
    (window as Window & { Calendly?: unknown }).Calendly = { initInlineWidget };

    const f = TestBed.createComponent(Booking);
    f.detectChanges();

    expect(initInlineWidget).toHaveBeenCalledOnce();
    expect(initInlineWidget).toHaveBeenCalledWith({
      url: f.componentInstance.calendlyUrl,
      parentElement: expect.any(HTMLElement),
    });
  });

  it('should listen for the Calendly script load event when Calendly is not yet loaded', () => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    const addEventListenerSpy = vi.spyOn(script, 'addEventListener');
    document.head.appendChild(script);

    const f = TestBed.createComponent(Booking);
    f.detectChanges();

    expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function), { once: true });

    document.head.removeChild(script);
  });
});
