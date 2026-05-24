import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Nav } from './components/nav/nav';
import { Hero } from './components/hero/hero';
import { Services } from './components/services/services';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Nav, Hero, Services, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
