import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-pasarela-pagos',
  standalone: true,
  imports: [CommonModule, HlmCardImports, HlmButton, HlmInput],
  templateUrl: './pasarela-pagos.component.html',
})
export class PasarelaPagosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  entradaId = signal('');
  procesando = signal(false);
  exito = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['ticketId']) {
        this.entradaId.set(params['ticketId']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  simularPago() {
    this.procesando.set(true);
    
    // Simulamos un delay de procesador de pagos
    setTimeout(() => {
      this.http.post(`${environment.apiUrl}/pagos/confirmar/${this.entradaId()}`, {})
        .subscribe({
          next: () => {
            this.procesando.set(false);
            this.exito.set(true);
            setTimeout(() => {
              this.router.navigate(['/user']);
            }, 3000);
          },
          error: (err) => {
            console.error('Error pagando:', err);
            this.procesando.set(false);
            alert('Error en el pago. Intenta de nuevo.');
          }
        });
    }, 2000);
  }
}
