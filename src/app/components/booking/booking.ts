import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  DOCUMENT,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: { url: string; parentElement: Element }): void;
    };
  }
}

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Booking implements AfterViewInit {
  readonly calendlyUrl =
    'https://calendly.com/carlos-barajas-bitandbyteideas/30min?background_color=111827&text_color=f8fafc&primary_color=22c55e&hide_gdpr_banner=1';

  @ViewChild('calendlyContainer') private container!: ElementRef<HTMLElement>;
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) this.initWidget();
  }

  private initWidget(): void {
    const mount = () =>
      window.Calendly?.initInlineWidget({
        url: this.calendlyUrl,
        parentElement: this.container.nativeElement,
      });

    if (window.Calendly) {
      mount();
    } else {
      const script = this.doc.querySelector<HTMLScriptElement>(
        'script[src*="calendly.com/assets/external/widget.js"]',
      );
      script?.addEventListener('load', mount, { once: true });
    }
  }
}
