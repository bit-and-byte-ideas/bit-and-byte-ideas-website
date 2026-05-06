import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the current year in the copyright notice', () => {
    const currentYear = new Date().getFullYear().toString();
    const copyright = nativeEl.querySelector('.footer-copy');
    expect(copyright?.textContent).toContain(currentYear);
  });

  it('should include "Bit & Byte Ideas" in the copyright text', () => {
    const copyright = nativeEl.querySelector('.footer-copy');
    expect(copyright?.textContent).toContain('Bit & Byte Ideas');
  });

  it('should render the footer logo image', () => {
    const img = nativeEl.querySelector<HTMLImageElement>('.footer-logo-img');
    expect(img).toBeTruthy();
  });

  it('should have an aria-label on the logo link', () => {
    const logoLink = nativeEl.querySelector<HTMLAnchorElement>('.footer-logo');
    expect(logoLink?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should render a tagline', () => {
    const tagline = nativeEl.querySelector('.footer-tagline');
    expect(tagline?.textContent?.trim()).toBeTruthy();
  });
});
