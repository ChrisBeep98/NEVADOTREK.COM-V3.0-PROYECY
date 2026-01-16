# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-15
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.0 (Payment Bridge)

## 1. Visión General

El `BookingModal` v2.0 implementa el patrón **Payment Bridge**. En lugar de inyectar scripts de terceros directamente, delega el pago a una pestaña segura y monitorea el resultado en tiempo real.

### Características Principales
- **Estados:** Selección → Datos → Puente (Espera) → Éxito/Error.
- **Payment Bridge:** Abre `/payment-bridge` para aislar el script de Bold.
- **Polling Inteligente:** Consulta el estado de la reserva cada 5 segundos.
- **Manejo de Errores:** Soporte nativo para pagos rechazados (`rejected`) sin recargar la página.

---

## 2. Componente BookingModal

### 2.2 Estados Internos Actualizados

```typescript
// Booking & Pago
const [realBookingId, setRealBookingId] = useState<string | null>(null);
const [paymentRef, setPaymentRef] = useState<string | null>(null);

// Payment Bridge State (New)
const [isWaitingForPayment, setIsWaitingForPayment] = useState(false); // Activa Step 2.5
const [isCheckingStatus, setIsCheckingStatus] = useState(false);       // Spinner manual
const [paymentError, setPaymentError] = useState<string | null>(null); // Mensajes de rechazo
```

---

## 3. Flujo Multi-Step (v2.0)

### Step 2: Resumen y Puente
En lugar de mostrar el botón de Bold, mostramos un botón propio:
- **Botón:** "IR A PAGAR" (Abre nueva pestaña).
- **Acción:** 
  1. `setIsWaitingForPayment(true)`
  2. `window.open('/payment-bridge?bookingId=...', '_blank')`

### Step 2.5: Sala de Espera (Polling)
Vista intermedia mientras el usuario paga en la otra pestaña.
- **UI:** "Finalizando tu reserva...", Spinner, Timer visual.
- **Botones:** 
  - "Ya realicé el pago" (Polling manual).
  - "El botón no abrió" (Cancelar espera).
- **Lógica:** Ejecuta `checkPaymentStatus` automáticamente cada 5s.

### Step 3: Éxito
Se activa automáticamente cuando el Polling recibe `status: confirmed` o `paymentStatus: approved`.

### Manejo de Errores (Unhappy Path)
Si el Polling recibe `paymentStatus: rejected`:
1. `setIsWaitingForPayment(false)` (Sale de la sala de espera).
2. `setPaymentError("El pago fue rechazado...")`.
3. El usuario regresa al **Step 2** con el mensaje de error visible y puede intentar pagar de nuevo.

---

## 4. Polling & Status Check

### 4.1 Función `checkPaymentStatus`

```typescript
const checkPaymentStatus = async () => {
    const data = await getBookingStatus(realBookingId);
    
    // CASO 1: Éxito (Bold confirmó por Webhook)
    if (data.paymentStatus === 'approved' || data.status === 'confirmed') {
        setIsWaitingForPayment(false);
        setPaymentRef(data.paymentRef); // Usar referencia real del backend
        setStep(3);
    } 
    // CASO 2: Rechazo (Tarjeta denegada, fondos insuficientes)
    else if (data.paymentStatus === 'rejected') {
        setIsWaitingForPayment(false);
        setPaymentError("Pago rechazado. Intenta con otro medio.");
    }
    // CASO 3: Pendiente (Seguir esperando)
    // No hace nada, el intervalo volverá a ejecutar en 5s.
};
```

---

## 5. Payment Bridge Page

Ubicación: `app-v1/app/payment-bridge/page.tsx`

Esta página es un contenedor ligero y seguro.
- **Propósito:** Cargar `BoldCheckout.tsx` en un entorno aislado.
- **Ventaja:** Si el script de Bold secuestra el historial o redirige, solo afecta a esta pestaña "desechable", protegiendo la sesión principal del usuario en el Modal.

---

## 13. Estructura de Archivos (Actualizada)

```
app-v1/
├── app/
│   ├── components/
│   │   ├── tour-detail/
│   │   │   ├── BookingModal.tsx      # Lógica de Polling y Estados
│   │   └── ui/
│   │       └── BoldCheckout.tsx      # Solo inyección de script (Simplificado)
│   ├── payment-bridge/
│   │   └── page.tsx                  # Nueva página "Puente"
│   └── services/
│       └── nevado-api.ts             # getBookingStatus() polling endpoint
```