import { Injectable } from '@angular/core';

export interface BusinessInfo {
  email: string;
  responseTime: string;
  availability: string;
  workingWith: string;
}

@Injectable({ providedIn: 'root' })
export class BusinessInfoService {
  readonly info: BusinessInfo = {
    email: 'info@bitandbyteideas.com',
    responseTime: 'Within 24 hours',
    availability: 'Currently accepting clients',
    workingWith: 'Small & medium businesses',
  };

  get mailtoHref(): string {
    return `mailto:${this.info.email}`;
  }
}
