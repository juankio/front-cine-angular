# 🎬 Guía Técnica: Proyecto Cine Angular

¡Bienvenidos, Nakamas! Esta guía explica cómo está construido el motor de nuestro cine por dentro. Hemos usado **Angular 21** moderno, Tailwind CSS y Spartan UI.

---

## 🧠 1. Manejo de Estados (El Cerebro del Barco)

En Angular moderno ya no nos enredamos con cosas complejas si no es necesario. Usamos **Signals** y **Servicios** para mantener la información fluyendo rápido.

<div class="box">
  <strong>¿Qué es un Signal?</strong> Es como un semáforo interactivo. Cuando el valor cambia, Angular actualiza la pantalla automáticamente sin esfuerzo extra.
</div>

### A. Estados Globales (Servicios)
Usamos servicios (`@Injectable`) para guardar información que toda la app necesita (ej: el usuario logueado o las películas en el carrito).

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Estado reactivo de películas seleccionadas
  movies = signal<Movie[]>([]); 
  
  // Computed: Se calcula solo (ej. total a pagar)
  total = computed(() => this.movies().length * 10);

  addMovie(movie: Movie) {
    // Actualizamos el estado de forma inmutable
    this.movies.update(current => [...current, movie]);
  }
}
```

---

## 🌐 2. Consumo de APIs (Hablando con el Mundo)

Para pedir las películas al servidor (Backend) o a TMDB, usamos el moderno `HttpClient` junto con la función mágica `inject()`.

### Flujo de una Petición HTTP
1. Se crea un servicio para centralizar las llamadas.
2. Se inyecta `HttpClient`.
3. Nos suscribimos a los datos en el componente (o los pasamos a un Signal).

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.cine.com/v1/movies';

  getMovies() {
    // Retorna un Observable que los componentes pueden consumir
    return this.http.get<Movie[]>(this.apiUrl);
  }
}
```

---

## 🧩 3. Mapa de Componentes (Nuestras Piezas de Lego)

Todo el frontend está dividido en piezas reutilizables (Standalone Components). Aquí está el inventario tipo "Excel" con los componentes clave de nuestra interfaz:

| Nombre del Componente | Tipo <span class="badge badge-layout">L</span> | Responsabilidad Principal | Tecnologías / UI |
| :--- | :--- | :--- | :--- |
| **`app-root`** | <span class="badge badge-layout">Layout</span> | Contenedor principal y Router Outlet. | Angular Core |
| **`movie-card`** | <span class="badge badge-ui">UI</span> | Tarjeta visual de una película (Póster, Título, Estrellas). | Spartan UI, Tailwind |
| **`movie-list`** | <span class="badge badge-feature">Feature</span> | Consume la API y dibuja un grid con varias `movie-card`. | Signals, HttpClient |
| **`navbar`** | <span class="badge badge-layout">Layout</span> | Menú superior. Muestra el buscador y estado del usuario. | Lucide Icons, Flexbox |
| **`seat-selector`** | <span class="badge badge-feature">Feature</span> | Matriz interactiva para elegir asientos de la sala. | CSS Grid, Signals |
| **`login-modal`** | <span class="badge badge-ui">UI</span> | Ventana emergente para iniciar sesión. | `@spartan-ng/ui-core` |

---

## 🎨 4. Diseño y Librerías (La Fachada del Cine)

Para que nuestro cine no se vea como un barco fantasma, usamos un set de librerías modernas que nos ahorran meses de trabajo y hacen que todo luzca premium.

<div class="box">
  <strong>¿Por qué estas librerías?</strong> Nos permiten programar más rápido, mantener el código limpio y asegurar que la interfaz sea accesible para todos los usuarios.
</div>

### 🛠️ Librerías Principales Usadas

| Librería | Uso en el Proyecto | Ventaja Principal |
| :--- | :--- | :--- |
| **Tailwind CSS** | Estilos de toda la aplicación. | En vez de crear archivos `.css` gigantes, usamos clases directamente en el HTML (ej. `bg-red-500 text-white`). |
| **Spartan UI** | Botones, Modales, Formularios. | Es la versión de Angular de *shadcn/ui*. Nos da componentes hermosos listos para usar (`@spartan-ng`). |
| **Lucide Icons** | Iconografía. | Íconos SVG súper livianos y elegantes, usando el paquete `@ng-icons/lucide`. |
| **Social Login** | Autenticación. | Permite iniciar sesión fácilmente con Google usando `@abacritt/angularx-social-login`. |

### Ejemplo de Diseño en el Código
Así de fácil construimos un botón hermoso usando Tailwind y Spartan UI, todo en el mismo HTML:

```html
<!-- Botón del cine con esquinas redondeadas y efecto hover -->
<button hlmBtn variant="destructive" class="rounded-full shadow-md hover:scale-105 transition-transform">
  <ng-icon name="lucideTicket" class="mr-2"></ng-icon>
  Comprar Entrada
</button>
```

---
*Documento generado automáticamente por el Capitán Luffy y la tripulación.* 🍖⚓