import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BusinessInfoService } from './business-info.service';

describe('BusinessInfoService', () => {
  let service: BusinessInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose a non-empty email address', () => {
    expect(service.info.email).toBeTruthy();
    expect(service.info.email.length).toBeGreaterThan(0);
  });

  it('should expose a valid email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(service.info.email)).toBe(true);
  });

  it('should generate a correct mailto href', () => {
    expect(service.mailtoHref).toBe(`mailto:${service.info.email}`);
  });

  it('should expose non-empty responseTime', () => {
    expect(service.info.responseTime).toBeTruthy();
  });

  it('should expose non-empty availability', () => {
    expect(service.info.availability).toBeTruthy();
  });

  it('should expose non-empty workingWith', () => {
    expect(service.info.workingWith).toBeTruthy();
  });
});
