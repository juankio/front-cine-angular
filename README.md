# 🎬 Cine POOR - Frontend (Angular)

![Cine POOR Banner](https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop)

> **Cine POOR** es una plataforma premium de gestión de cines y reserva de taquillas, construida con una estética inmersiva inspirada en la **Época Dorada del Cine** (*Cine Noir*, Art Déco, tonos negro mate, oro antiguo y terciopelo rojo).

## ✨ Características Principales

### 🎟️ Experiencia del Cliente (B2C)
- **Cartelera y Reserva Interactiva:** Explora películas con carteles inmersivos, selecciona funciones y elige tus butacas en un mapa de sala en tiempo real.
- **Smart Tickets (Códigos QR):** Tras la compra, tus boletos se generan como "Smart Tickets" con códigos QR escaneables desde tu perfil.
- **Dulcería Retro:** Añade combos y comida a tu carrito desde una interfaz que simula una cartelera de menú vintage.
- **Pasarela de Pagos Segura:** Integración simulada (preparada para Stripe) con efectos visuales *Glassmorphism* y validación en vivo.

### 🎥 Panel de Dirección (Admin Dashboard)
- **Gestión Cinematográfica:** Panel completo para crear y editar Películas, Salas, Menús, Insumos y Fichas de Recetas.
- **Escáner de Accesos:** Utiliza la cámara web o del móvil (`@zxing/ngx-scanner`) para validar los códigos QR de los clientes en la entrada del teatro.
- **Auditoría de Ventas:** Visualiza todos los tickets cortados y transacciones en tiempo real.
- **Diseño Inmersivo:** Todo el panel abandona las clásicas "tablas de Excel" por un sistema de *Grid de Fichas* y *Pizarras*, manteniendo el flujo retro.

## 🛠️ Stack Tecnológico
- **Framework:** Angular 17+ (Standalone Components, Signals, nuevo Control Flow `@if/@for`).
- **Estilos:** Tailwind CSS + Spartan UI (Componentes headless inspirados en Shadcn UI).
- **Animaciones:** Anime.js (`v4.4.1`) para transiciones de estado, Staggering y micro-interacciones suaves.
- **Utilidades:** 
  - `angularx-qrcode` (Generación de QRs).
  - `@zxing/ngx-scanner` (Escáner de QRs por cámara).

## 🚀 Instalación y Uso

Asegúrate de usar **Bun** (prohibido estrictamente `npm` en este navío).

```bash
# 1. Instalar dependencias
bun install

# 2. Configurar variables de entorno (Crea un archivo .env)
# API_URL=http://localhost:3000/api

# 3. Levantar servidor de desarrollo
bun run start
```

## 📐 Decisiones de Diseño (UX/UI)
- **Paleta de Color:** `#0A0A0A` (Negro Ónix), `#C5A059` (Oro Antiguo), `#7A0000` (Rojo Terciopelo).
- **Tipografía:** `Playfair Display` para dar el peso clásico en los titulares, y `Lora` para una lectura cómoda y literaria en los párrafos.
- **Texturas:** Uso de ruido blanco (*film grain*) e imágenes estilo *Stardust* en opacidades mínimas para dar tacto analógico a los fondos oscuros.

---
*Desarrollado con 🏴‍☠️ Haki y mucha elegancia.*
