import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Services } from './services';

describe('Services', () => {
  let fixture: ComponentFixture<Services>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services],
    }).compileComponents();

    fixture = TestBed.createComponent(Services);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have id="services" on the section for anchor navigation', () => {
    const section = nativeEl.querySelector('section');
    expect(section?.getAttribute('id')).toBe('services');
  });

  it('should render exactly 3 service cards', () => {
    const cards = nativeEl.querySelectorAll('.service-card');
    expect(cards.length).toBe(3);
  });

  it('should render a Static Website Development card', () => {
    const titles = Array.from(nativeEl.querySelectorAll('.card-title'));
    expect(titles.some(t => t.textContent?.includes('Static Website Development'))).toBe(true);
  });

  it('should render a Web Application Development card', () => {
    const titles = Array.from(nativeEl.querySelectorAll('.card-title'));
    expect(titles.some(t => t.textContent?.includes('Web Application Development'))).toBe(true);
  });

  it('should render a Maintenance + Hosting card', () => {
    const titles = Array.from(nativeEl.querySelectorAll('.card-title'));
    expect(titles.some(t => t.textContent?.includes('Maintenance + Hosting'))).toBe(true);
  });

  it('should show the "Add-on subscription" badge only on the Maintenance + Hosting card', () => {
    const badges = nativeEl.querySelectorAll('.card-badge');
    expect(badges.length).toBe(1);
    expect(badges[0].textContent?.trim()).toBe('Add-on subscription');
  });

  it('should have all "Get a Quote" CTAs linking to #contact', () => {
    const ctas = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('.card-cta'));
    expect(ctas.length).toBe(3);
    ctas.forEach(cta => expect(cta.getAttribute('href')).toBe('#contact'));
  });
});
