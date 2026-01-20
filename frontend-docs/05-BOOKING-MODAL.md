# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-19
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.7.5 (Production Release)

## 1. Visión General

El `BookingModal` v2.7.5 es la versión de **Producción**, optimizada para procesar pagos reales mediante la arquitectura de **Smart Links** de Bold.

---

## 2. Lógica de Reserva (Producción)

El componente utiliza los endpoints de la API de Producción:

-   **Modo Grupal (Public):** `POST /bookings/join` (con `departureId`).
-   **Modo Privado (Private):** `POST /bookings/private` (con `tourId` real).

### Eliminación de Lógica de Prueba
Se ha retirado el "Force Staging Mode".
-   ✅ **Tour ID Real:** El modal envía el ID exacto del tour que el usuario está viendo.
-   ✅ **Pagos Reales:** Las transacciones iniciadas son procesadas en el entorno LIVE de Bold.

---

## 3. Flujo de Pago "Smart Link"

1.  **Pre-apertura:** Al hacer clic en pagar, se abre una pestaña en blanco (`about:blank`) inmediatamente.
2.  **Inicialización:** Se llama a `/init` para obtener la `paymentUrl` de producción.
3.  **Redirección:** La pestaña en blanco es redirigida a la pasarela segura (`checkout.bold.co`).

---

## 4. Manejo de Estados

El modal implementa polling sobre `/public/bookings/:id`:

-   **`approved` (Verde):** Transacción exitosa.
-   **`rejected` (Rojo):** Rechazo bancario.
-   **`expired` (Rojo/Naranja):** Link caducado.
-   **`voided` (Rojo):** Anulación administrativa.

---

## 5. Accesibilidad y Limpieza
-   **Formulario:** Persistencia automática en `localStorage`.
-   **Internacionalización:** Soporte completo ES/EN.
-   **Depuración:** El componente `BoldCheckout` (widget antiguo) ha sido marcado como *deprecated*.
