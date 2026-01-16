# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-16
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.2 (Ticket & Toasts)

## 1. Visión General

El `BookingModal` v2.2 refina el flujo de datos y la experiencia de usuario. Mantiene el patrón "Just-in-Time" para la creación de reservas pero mejora significativamente el feedback visual en el estado de espera mediante un "Ticket Editorial" y notificaciones flotantes persistentes.

---

## 2. Flujo Multi-Step (v2.2)

### Step 1: Datos del Usuario
- **Validación:** Local (Client-side).
- **Acción "Continuar":** Solo avanza al Step 2 en memoria. **NO** contacta al backend.
- **Beneficio:** Permite al usuario volver y corregir datos sin ensuciar la base de datos.

### Step 2: Resumen y Pago (Just-in-Time)
Aquí ocurre la magia. Al hacer clic en **"IR A PAGAR"**:

1.  **Browser Action:** Se abre inmediatamente una nueva pestaña (`window.open('', '_blank')`) para evitar bloqueos de popups.
2.  **Visual Feedback:** La nueva pestaña muestra un spinner de carga ("Iniciando pasarela...").
3.  **Backend Call:** En paralelo, el Modal llama a `createPrivateBooking`.
4.  **Redirección:** Una vez obtenido el `bookingId`, la pestaña pre-abierta se redirige a `/payment-bridge?bookingId=...`.

### Step 2.5: Sala de Espera (Rediseñada)
El Modal entra en modo polling (`isWaitingForPayment`), transformando la interfaz:

*   **Left Column (Visual):** Ilustración "Aurora Bridge" sutil (`bg-surface/20`) que representa la conexión de datos.
*   **Right Column (Data):** Se muestra un **"Ticket de Reserva Editorial"** detallado:
    *   Diseño limpio en bloques agrupados.
    *   Datos claros: Titular, Fecha, Pax.
    *   Desglose Financiero: Total Reserva vs Pago Pendiente.
    *   Estética: `bg-surface/40`, bordes finos, tipografía técnica.
*   **Notificación (Toast):** Se dispara un Toast persistente de `sonner` en la esquina superior derecha (`top-right`).
    *   **Estilo:** Azul Profesional (`#1E40AF`) con el logo oficial de **BOLD** (SVG).
    *   **Función:** Informa que el sistema está "Sincronizando Banco" y advierte no cerrar la pestaña.

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
    
    // 3. Redirect the pre-opened tab & Show Toast
    bridgeWindow.location.href = `/payment-bridge?bookingId=${id}`;
    setIsWaitingForPayment(true);
    
    // Trigger Persistent Toast
    toast.custom((t) => (
        <div className="bg-[#1E40AF] ...">
            {/* Bold Logo & Status */}
        </div>
    ), { duration: Infinity, id: 'payment-wait' });
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
        toast.dismiss('payment-wait');
        toast.custom(...); // Success Toast
    } 
    // CASO 2: Rechazo
    else if (data.paymentStatus === 'rejected') {
        setIsWaitingForPayment(false);
        toast.dismiss('payment-wait');
        toast.error("Pago Rechazado");
    }
};
```