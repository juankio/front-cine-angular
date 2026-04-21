import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styles: [`
    @keyframes progress {
      0% { transform: scaleX(1); }
      100% { transform: scaleX(0); }
    }
    .animate-progress {
      animation-name: progress;
      animation-timing-function: linear;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
