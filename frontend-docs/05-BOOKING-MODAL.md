# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-16
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.3 (Cinematic Waiting State)

## 1. Visión General

El `BookingModal` v2.3 perfecciona la experiencia de espera durante el pago. Hemos sustituido las ilustraciones abstractas por una **Experiencia Cinemática Inmersiva** que utiliza la fotografía real del tour para mantener la conexión emocional con el usuario.

---

## 2. Cambios Visuales (v2.3)

### 2.1 Sala de Espera Cinemática (Left Pane)
En lugar de vectores o gradientes genéricos, ahora mostramos:
- **Fondo:** La imagen principal del tour (`effectiveTour.images[0]`) en alta calidad.
- **Tratamiento:** Opacidad al 90%, filtros de mezcla de marca y un viñetado profundo (`radial-gradient`) que funde la imagen con el fondo oscuro del modal (`#020617`).
- **Minimalismo:** Se han eliminado todas las animaciones de carga, partículas y textos redundantes de esta sección para ofrecer una estética de "póster de película" limpia y serena.

### 2.2 Ticket de Reserva (Right Pane)
- **Diseño Editorial:** Información organizada en bloques lógicos (Titular, Fecha, Viajeros) con iconos sutiles.
- **Claridad Financiera:** Separación explícita entre el "Total de la Reserva" y el "Monto a Pagar Ahora" (preparado para pagos parciales).
- **Feedback de Estado:**
    - **Header Centrado:** Título grande y mensaje de UX claro: *"Esta ventana se actualizará automáticamente"*.
    - **Confirmación de Seguridad:** Un bloque azul informa explícitamente que la reserva **YA ha sido creada** en la base de datos (mostrando el ID real) y que el pago ocurre en una pestaña paralela.
    - **Recuperación:** Enlace *"¿Se cerró la pestaña de pago?"* para reabrir la pasarela sin perder datos.

### 2.3 Adaptabilidad Móvil
- **Layout:** Márgenes ajustados a 12px exactos (`p-3`).
- **Toast Integrado:** En pantallas pequeñas, la notificación flotante se reemplaza por un bloque de estado integrado (inline) para evitar obstrucciones visuales.
- **Botones:** Altura táctil garantizada de 48px en todas las acciones críticas.

---

## 3. Flujo de Datos

### 3.1 Creación de Reserva
El ID que se muestra al usuario es el **Booking ID Real** retornado por el backend (`POST /bookings/private`).
```typescript
const response = await createPrivateBooking({...});
setRealBookingId(response.bookingId); // Database ID (Firestore)
```

Este ID es la garantía del usuario de que su cupo está apartado "Pending Payment" mientras interactúa con la pasarela Bold.
