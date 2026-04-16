import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserLayoutComponent } from '../../layouts/user-layout/user-layout.component';
import { RecuadroInformacionComponent } from '../../components/recuadro-informacion/recuadro-informacion.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    UserLayoutComponent,
    RecuadroInformacionComponent,
    RouterLink,
    HlmCardImports,
    HlmTableImports
  ],
  template: `
    <app-user-layout>
      <div class="pt-10 pb-20 w-full px-6 md:w-3/4 md:mx-auto">
        <div class="flex flex-col md:flex-row justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <a routerLink="/">Volver al inicio</a>
            </div>
            <div>
              <p class="text-blue-500 font-medium text-sm tracking-wide uppercase mb-1">Perfil</p>
              <h1 class="text-3xl font-bold dark:text-white mb-2">Mi Cuenta</h1>
              <p class="text-gray-600 dark:text-gray-400">Administra tu información y tus reservas.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 mt-6 md:mt-0">
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
              Actualizar
            </button>
            <button class="px-4 py-2 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>

        <hlm-card class="mb-8">
          <hlm-card-header>
            <h3 hlmCardTitle>Información del Usuario</h3>
            <p hlmCardDescription>Tus datos personales de la cuenta.</p>
          </hlm-card-header>
          <div hlmCardContent class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Nombre completo</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">Juan Pérez</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Correo electrónico</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">juan.perez@example.com</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">+54 11 1234-5678</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">Enero 2024</p>
            </div>
          </div>
        </hlm-card>

        <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
          <app-recuadro-informacion label="Total de reservas" valor="3" />
          <app-recuadro-informacion label="Reservas activas" valor="1" />
          <app-recuadro-informacion label="Combos adquiridos" valor="2" />
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Mis Entradas</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Historial de tus últimas funciones reservadas.</p>
        </div>

        <div hlmTableContainer class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
          <table hlmTable class="w-full">
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>ID Reserva</th>
                <th hlmTh>Película</th>
                <th hlmTh>Fecha y Hora</th>
                <th hlmTh>Sala</th>
                <th hlmTh>Asientos</th>
                <th hlmTh>Estado</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (reserva of reservas; track reserva.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{reserva.id}}</td>
                  <td hlmTd>{{reserva.pelicula}}</td>
                  <td hlmTd>{{reserva.fecha}} - {{reserva.hora}}</td>
                  <td hlmTd>{{reserva.sala}}</td>
                  <td hlmTd>{{reserva.asientos}}</td>
                  <td hlmTd>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                          [class]="reserva.estado === 'Activa' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-800 dark:text-gray-300'">
                      {{reserva.estado}}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-center py-12 text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mb-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                      <p>Aún no hay reservas confirmadas.</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-user-layout>
  `
})
export class UserComponent {
  public reservas = [
    { id: 'RES-001', pelicula: 'Dune: Part Two', fecha: '18 Abr 2026', hora: '19:30', sala: 'Sala 4', asientos: 'E12, E13', estado: 'Activa' },
    { id: 'RES-002', pelicula: 'Kung Fu Panda 4', fecha: '10 Abr 2026', hora: '16:00', sala: 'Sala 2', asientos: 'J5, J6, J7', estado: 'Completada' },
    { id: 'RES-003', pelicula: 'Godzilla x Kong', fecha: '05 Abr 2026', hora: '20:15', sala: 'Sala 1', asientos: 'H8, H9', estado: 'Completada' }
  ];
}
