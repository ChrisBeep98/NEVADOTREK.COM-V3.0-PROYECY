# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-19
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.6 (Staging Robustness)

## 1. Visión General

El `BookingModal` v2.6 implementa una lógica agnóstica al tipo de reserva (Public/Private) y garantiza la entrega de notificaciones en entornos de Staging.

---

## 2. Lógica de Reserva Dual

El componente detecta automáticamente el modo seleccionado por el usuario:

- **Modo Grupal (Public):** El usuario elige una fecha de la grilla. Se utiliza el endpoint `/bookings/join`.
- **Modo Privado (Private):** El usuario elige una fecha del calendario. Se utiliza el endpoint `/bookings/private`.

---

## 3. Robustez en Staging & Desarrollo

### 3.1 Force Staging Mode (Local)
Para evitar fallos en las notificaciones de Telegram durante el desarrollo local (`localhost`), el modal sobreescribe automáticamente cualquier `tourId` real con `test-tour-001`. Esto garantiza que el backend de Staging encuentre el tour y dispare los webhooks de notificación.

### 3.2 Saneamiento de Teléfono
Se aplica una limpieza estricta mediante RegEx antes del envío:
- Entrada: `(300) 123 4567`
- Salida: `+573001234567` (Cumple con estándar E.164 para APIs de mensajería).

---

## 4. Cambios Visuales & UI (v2.6)

### 4.1 Liquid Glass (Apple-Style)
- **Desenfoque:** 40px backdrop blur constante.
- **Micro-interacciones:** Feedback visual inmediato al alternar entre modos Grupal y Privado.
- **Toasts de Desarrollo:** Notificaciones de sistema (Sonner) informan al desarrollador cuando se está aplicando la lógica de "Force Mode".

---

## 5. Lógica Financiera
Desglose transparente del 5% de tasa transaccional:
- **Reserva:** 30% del valor total.
- **Tasa Pasarela:** 5% sobre el valor del depósito.
- **Fórmula:** `(Total * 0.3) * 1.05`.