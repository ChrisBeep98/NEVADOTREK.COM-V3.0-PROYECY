# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-16
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.3 (Cinematic Waiting State)

## 1. Visión General

El `BookingModal` v2.5 implementa una interfaz de cristal líquido (**Liquid Glass**) de alta gama. La modal ha sido expandida a **92vw** con un tope de **1520px** para un impacto visual máximo en monitores de alta resolución.

---

## 2. Cambios Visuales & UI (v2.5)

### 2.1 Liquid Glass (Apple-Style)
- **Dark Mode:** Fondo `#040918/70` con desenfoque de 40px y bordes `white/10`. Sensación de profundidad tecnológica.
- **Light Mode:** Fondo `white/80` con degradado iridiscente (`white` -> `blue-50` -> `indigo-50`). Los inputs usan `bg-white/40` con bordes `border-slate-200` para garantizar legibilidad.
- **Micro-interacciones:** Los botones de selección y fechas ahora usan cristales translúcidos que reaccionan al hover con sutiles cambios de opacidad.

### 2.2 Notificaciones Inteligentes
- **Desktop:** Toasts flotantes en la esquina superior derecha (Stack de Estado).
- **Mobile:** Notificaciones **incrustadas** integradas directamente en el flujo, ubicadas debajo del enlace de ayuda del pago para evitar obstrucciones.
- **Estado In-Place:** El paso 2.5 muta de "Esperando" (Naranja) a "Éxito" (Esmeralda) sin recargar la página ni cambiar de paso, manteniendo el ticket visible.

### 2.3 Adaptabilidad Móvil
- **Altura:** 96% de la pantalla (`96vh`).
- **Radio:** Bordes superiores de 8px para un look más "App-Native".
- **Márgenes:** Estándar de 12px (`p-3`) en todos los contenedores de información.

---

## 3. Lógica Financiera (v2.5)
Se ha implementado un desglose transparente del 5% de tasa transaccional:
- **Reserva:** 30% del valor total del tour.
- **Tasa:** 5% adicional sobre el valor de la reserva (cobro de pasarela).
- **Total a Pagar:** `(Total * 0.3) * 1.05`.

---

## 3. Flujo de Datos

### 3.1 Creación de Reserva
El ID que se muestra al usuario es el **Booking ID Real** retornado por el backend (`POST /bookings/private`).
```typescript
const response = await createPrivateBooking({...});
setRealBookingId(response.bookingId); // Database ID (Firestore)
```

Este ID es la garantía del usuario de que su cupo está apartado "Pending Payment" mientras interactúa con la pasarela Bold.
