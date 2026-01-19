# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-19
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.7 (Final Staging Polish)

## 1. Visión General

El `BookingModal` v2.7 es la versión definitiva para pruebas en Staging, optimizada para garantizar la trazabilidad de las notificaciones y la limpieza de datos.

---

## 2. Lógica de Reserva Dual (Agnóstica)

El componente detecta automáticamente el modo seleccionado y utiliza el endpoint correspondiente en el backend de Staging:

- **Modo Grupal (Public):** Utiliza `POST /bookings/join`. Requiere un `departureId` válido.
- **Modo Privado (Private):** Utiliza `POST /bookings/private`. Requiere `tourId` y `date`.

---

## 3. Robustez y Testing en Staging

### 3.1 Force Staging Mode (Localhost)
Para asegurar que las notificaciones de **Telegram/Instagram** lleguen siempre durante el desarrollo:
- El modal detecta si la app corre en `localhost`.
- Sobreescribe cualquier `tourId` real con `test-tour-001`.
- Esto garantiza que el backend encuentre el tour en su base de datos de pruebas y dispare el mensaje.

### 3.2 Saneamiento de Datos
- **Teléfono:** Limpieza estricta mediante RegEx (`replace(/[^0-9+]/g, '')`). Convierte formatos como `(300) 123 4567` en `+573001234567` para compatibilidad con APIs de mensajería.
- **Precios:** Lógica de `getPrice()` blindada para asegurar comparaciones numéricas correctas entre Pax y Tiers.

### 3.3 Prevención de Estado Zombie
- Se ha desactivado temporalmente la restauración automática del `realBookingId` desde `localStorage`. 
- **Objetivo:** Forzar la creación de una reserva nueva en cada ciclo de prueba para validar siempre el trigger de notificación.

---

## 4. UI & UX (Liquid Glass)
- **Feedback de Desarrollo:** Se incluyen Toasts informativos (Sonner) cuando el "Force Mode" está activo.
- **In-Place Mutation:** El paso de espera (2.5) cambia visualmente de Naranja (Pendiente) a Esmeralda (Éxito) sin recargar, manteniendo la coherencia visual del ticket.
