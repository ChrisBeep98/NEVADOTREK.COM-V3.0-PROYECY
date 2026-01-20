# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-19
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v2.7.5 (Smart Link Redirection)

## 1. Visión General

El `BookingModal` v2.7.5 implementa el patrón de **Smart Links**, eliminando el widget embebido para delegar la seguridad y renderizado de la pasarela a Bold. Esto soluciona problemas de habilitación de tarjetas en Sandbox y mejora la estabilidad móvil.

---

## 2. Flujo de Pago "Smart Link"

1.  **Pre-apertura:** Al hacer clic en pagar, se abre una pestaña en blanco (`about:blank`) inmediatamente para evitar bloqueos de popups.
2.  **Inicialización:** Se llama a `/init` para obtener la `paymentUrl`.
3.  **Redirección:** La pestaña en blanco es redirigida a la URL segura de Bold (`checkout.bold.co/...`).

---

## 3. Manejo de Estados y Feedback

El modal implementa un sistema de polling robusto que maneja 5 estados posibles devueltos por el backend:

-   **`approved` (Verde):** Transacción exitosa. Muestra tarjeta de éxito y confeti visual.
-   **`rejected` (Rojo):** Rechazo bancario. Muestra alerta y botones de acción (WhatsApp/Reintentar).
-   **`expired` (Rojo/Naranja):** El usuario tardó mucho. Permite generar un nuevo link.
-   **`voided` (Rojo):** Anulación administrativa.
-   **`pending` (Azul):** Estado de espera animado con el mensaje "Procesando en nueva pestaña".

---

## 4. Transparencia Financiera

Debido a la lógica de backend v2.7.5, el modal ya no calcula impuestos localmente.
-   **Display:** Muestra el `amount` total entregado por el backend.
-   **Disclaimer:** Incluye el texto *"Cubres el 30% del valor total + costos de gestión"* para aclarar el recargo del 5% sin usar términos fiscales complejos como "IVA".

---

## 5. Accesibilidad y Limpieza
-   **Formulario:** Todos los inputs tienen atributos `id`, `name` y `autoComplete` correctos.
-   **Internacionalización:** Todos los textos, incluidos los mensajes de la página de resultados (`payment-result`), responden al idioma seleccionado (`ES/EN`).