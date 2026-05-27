import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { TrustStrip } from '../trust-strip/trust-strip';
import { Services } from '../services/services';
import { Process } from '../process/process';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, TrustStrip, Services, Process, Contact],
  template: `<app-hero /><app-trust-strip /><app-services /><app-process /><app-contact />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
