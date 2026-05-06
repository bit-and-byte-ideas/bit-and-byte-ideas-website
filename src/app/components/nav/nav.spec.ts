import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nav } from './nav';

describe('Nav', () => {
  let fixture: ComponentFixture<Nav>;
  let component: Nav;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand wordmark', () => {
    expect(nativeEl.textContent).toContain('Bit');
    expect(nativeEl.textContent).toContain('Byte');
  });

  it('should have a Services link pointing to #services', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('a'));
    const link = links.find(l => l.textContent?.trim() === 'Services');
    expect(link?.getAttribute('href')).toBe('#services');
  });

  it('should have a "Get in Touch" link pointing to #contact', () => {
    const links = Array.from(nativeEl.querySelectorAll<HTMLAnchorElement>('a'));
    const link = links.find(l => l.textContent?.includes('Get in Touch'));
    expect(link?.getAttribute('href')).toBe('#contact');
  });

  it('should have an aria-label on the logo link', () => {
    const logoLink = nativeEl.querySelector<HTMLAnchorElement>('.logo');
    expect(logoLink?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should not have scrolled class on nav initially', () => {
    const nav = nativeEl.querySelector('nav');
    expect(nav?.classList.contains('scrolled')).toBe(false);
  });

  it('should add scrolled class when scrollY exceeds 50px', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    component.onScroll();
    fixture.detectChanges();
    const nav = nativeEl.querySelector('nav');
    expect(nav?.classList.contains('scrolled')).toBe(true);
  });

  it('should remove scrolled class when scrollY returns below 50px', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    component.onScroll();
    fixture.detectChanges();

    Object.defineProperty(window, 'scrollY', { value: 20, configurable: true });
    component.onScroll();
    fixture.detectChanges();

    const nav = nativeEl.querySelector('nav');
    expect(nav?.classList.contains('scrolled')).toBe(false);
  });
});
