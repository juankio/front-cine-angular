import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', title?: string) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, title };
    
    this.toasts.update(t => [...t, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  success(message: string, title: string = 'Éxito') {
    this.show(message, 'success', title);
  }

  error(message: string, title: string = 'Error') {
    this.show(message, 'error', title);
  }

  info(message: string, title: string = 'Información') {
    this.show(message, 'info', title);
  }

  warning(message: string, title: string = 'Atención') {
    this.show(message, 'warning', title);
  }

  remove(id: string) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
