import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { BusinessInfoService } from '../../services/business-info.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly businessInfo = inject(BusinessInfoService);
}
