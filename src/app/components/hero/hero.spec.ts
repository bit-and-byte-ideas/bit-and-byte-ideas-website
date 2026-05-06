import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from './hero';

describe('Hero', () => {
  let fixture: ComponentFixture<Hero>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the full headline copy in h1', () => {
    const h1 = nativeEl.querySelector('h1');
    expect(h1?.textContent).toContain('We Build');
    expect(h1?.textContent).toContain('Digital');
    expect(h1?.textContent).toContain('Products');
    expect(h1?.textContent).toContain('That Work.');
  });

  it('should wrap "Products" in an em element for accent styling', () => {
    const em = nativeEl.querySelector('h1 em');
    expect(em?.textContent?.trim()).toBe('Products');
  });

  it('should have an "Explore Services" CTA linking to #services', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('.hero-ctas a'));
    const link = links.find(l => l.textContent?.includes('Explore Services'));
    expect(link?.getAttribute('href')).toBe('#services');
  });

  it('should have a "Get in Touch" CTA linking to #contact', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('.hero-ctas a'));
    const link = links.find(l => l.textContent?.includes('Get in Touch'));
    expect(link?.getAttribute('href')).toBe('#contact');
  });

  it('should have aria-label on the section for screen readers', () => {
    const section = nativeEl.querySelector('section');
    expect(section?.getAttribute('aria-label')).toBe('Hero');
  });
});
