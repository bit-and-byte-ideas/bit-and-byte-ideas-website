import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { Services } from '../services/services';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Services, Contact],
  template: `<app-hero /><app-services /><app-contact />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
