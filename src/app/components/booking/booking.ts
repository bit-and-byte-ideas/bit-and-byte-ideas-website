import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Booking {
  readonly calendlyUrl =
    'https://calendly.com/carlos-barajas-bitandbyteideas/30min?background_color=111827&text_color=f8fafc&primary_color=22c55e&hide_gdpr_banner=1';
}
