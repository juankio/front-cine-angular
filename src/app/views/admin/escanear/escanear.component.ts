import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-escanear',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, HlmCardImports],
  templateUrl: './escanear.component.html'
})
export class EscanearComponent {
  private http = inject(HttpClient);
  private ts = inject(ToastService);

  formats = [BarcodeFormat.QR_CODE];

  scannerEnabled = signal(true);
  procesando = signal(false);
  ticketInfo = signal<any>(null);

  onCodeResult(resultString: string) {
    if (this.procesando()) return;
    this.procesando.set(true);
    this.scannerEnabled.set(false);

    this.http.post(`${environment.apiUrl}/entradas/validar`, { codigo: resultString })
      .subscribe({
        next: (res: any) => {
          this.ts.success('Ticket Válido: ' + res.message);
          this.ticketInfo.set({ ...res.entrada, statusScan: 'success', statusMessage: '¡Acceso Permitido!' });
          this.procesando.set(false);
          
          setTimeout(() => {
            this.ticketInfo.set(null);
            this.scannerEnabled.set(true);
          }, 5000);
        },
        error: (err) => {
          this.ts.error(err.error?.message || 'Ticket Inválido o ya usado.');
          
          if (err.error?.entrada) {
            this.ticketInfo.set({ 
              ...err.error.entrada, 
              statusScan: 'error', 
              statusMessage: err.error.message.includes('EXPIRADO') ? 'TICKET EXPIRADO' : 'TICKET INVÁLIDO / USADO' 
            });
          }
          
          this.procesando.set(false);
          setTimeout(() => {
            this.ticketInfo.set(null);
            this.scannerEnabled.set(true);
          }, 5000);
        }
      });
  }
}
