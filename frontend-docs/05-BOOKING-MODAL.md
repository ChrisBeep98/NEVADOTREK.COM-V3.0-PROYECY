# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-16
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.1 (Just-in-Time Booking)

## 1. Visión General

El `BookingModal` v2.1 refina el flujo de datos. Para evitar "reservas fantasma" en la base de datos, la creación de la reserva (`POST /bookings/private`) se ha movido del Step 1 al botón de pago final, utilizando una estrategia de **"Pre-open Tab"** para evitar bloqueos de popups.

---

## 2. Flujo Multi-Step (v2.1)

### Step 1: Datos del Usuario
- **Validación:** Local (Client-side).
- **Acción "Continuar":** Solo avanza al Step 2 en memoria. **NO** contacta al backend.
- **Beneficio:** Permite al usuario volver y corregir datos sin ensuciar la base de datos.

### Step 2: Resumen y Pago (Just-in-Time)
Aquí ocurre la magia. Al hacer clic en **"IR A PAGAR"**:

1.  **Browser Action:** Se abre inmediatamente una nueva pestaña (`window.open('', '_blank')`) para "reservar" el hilo del navegador y evitar bloqueos de popups.
2.  **Visual Feedback:** La nueva pestaña muestra un spinner de carga ("Iniciando pasarela...").
3.  **Backend Call:** En paralelo, el Modal llama a `createPrivateBooking`.
4.  **Redirección:** Una vez obtenido el `bookingId`, la pestaña pre-abierta se redirige a `/payment-bridge?bookingId=...`.

### Step 2.5: Sala de Espera
El Modal entra en modo polling (`isWaitingForPayment`), consultando el estado de esa reserva recién creada.

---

## 3. Implementación Técnica (`handlePay`)

```typescript
const handlePay = async () => {
    // 1. Bypass Popup Blockers
    const bridgeWindow = window.open('', '_blank');
    
    // 2. Create Booking (Only if not already created)
    if (!realBookingId) {
        const response = await createPrivateBooking({...});
        setRealBookingId(response.bookingId);
    }
    
    // 3. Redirect the pre-opened tab
    bridgeWindow.location.href = `/payment-bridge?bookingId=${id}`;
}
```

---

## 4. Polling & Status Check

### 4.1 Función `checkPaymentStatus`

```typescript
const checkPaymentStatus = async () => {
    const data = await getBookingStatus(realBookingId);
    
    // CASO 1: Éxito (Bold confirmó por Webhook)
    if (data.paymentStatus === 'approved' || data.status === 'confirmed') {
        setIsWaitingForPayment(false);
        setStep(3);
    } 
    // CASO 2: Rechazo
    else if (data.paymentStatus === 'rejected') {
        setIsWaitingForPayment(false);
        setPaymentError("Pago rechazado. Intenta con otro medio.");
    }
};
```
