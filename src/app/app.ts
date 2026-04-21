import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { AuthStore } from './state/auth.store';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('front-cine-angular');
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  ngOnInit() {
    // Si Google nos redirige de vuelta con un "?token=...", lo atrapamos aquí
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        if (typeof localStorage !== 'undefined') localStorage.setItem('auth_token', token);
        // Recargar la app limpiando la URL, o actualizar el Store
        this.router.navigate([], {
          queryParams: { token: null },
          queryParamsHandling: 'merge'
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
