# 💳 BookingModal & Bold Integration

> **Last Updated:** 2026-01-15
> **Component:** `app-v1/app/components/tour-detail/BookingModal.tsx`
> **Version:** v1.0

## 1. Visión General

El `BookingModal` es un componente cliente (`'use client'`) que implementa un flujo de reserva multi-step completo con integración de pagos Bold. Soporta tanto reservas públicas (unirse a salidas grupales) como privadas (crear nuevas fechas), con persistencia de formulario y redirección circular tras el pago.

### Características Principales
- Flujo de 4 pasos: Selección → Datos → Pago → Éxito
- Modo público (departures) y privado (calendario)
- Smart Form con persistencia en localStorage
- Integración completa con Bold Checkout
- Carga dinámica de tour de staging para testing
- Animaciones GSAP fluidas
- Redirect loop circular tras pago

---

## 2. Componente BookingModal

### 2.1 Props del Componente

```typescript
interface BookingModalProps {
    isOpen: boolean;           // Control de visibilidad (externo)
    onClose: () => void;       // Callback al cerrar modal
    tour: Tour;                // Tour de producción (fallback)
    departures?: Departure[];  // Salidas públicas disponibles
}
```

### 2.2 Estados Internos

```typescript
// Flujo de Reserva
const [step, setStep] = useState(0);              // 0=Seleccionar, 1=Datos, 2=Pago, 3=Éxito
const [mode, setMode] = useState<'public' | 'private'>('public');
const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
const [selectedDate, setSelectedDate] = useState<Date | null>(null);

// Booking & Pago
const [realBookingId, setRealBookingId] = useState<string | null>(null);
const [isCreatingBooking, setIsCreatingBooking] = useState(false);
const [paymentRef, setPaymentRef] = useState<string | null>(null);

// Test Mode
const [isTestMode, setIsTestMode] = useState(false);
const [testTour, setTestTour] = useState<Tour | null>(null);

// Formulario
const [formData, setFormData] = useState<UserData>({...});

// Calendario
const [viewDate, setViewDate] = useState(new Date());

// Tour Efectivo (usa test tour si está disponible)
const effectiveTour = testTour || tour;
```

### 2.3 Interfaz UserData

```typescript
interface UserData {
    name: string;
    email: string;
    phone: string;
    document: string;
    note: string;
    pax: number;
}
```

---

## 3. Flujo Multi-Step

### Step 0: Selección de Fecha

**Modo Público (Departures):**
```typescript
const publicDepartures = departures.filter(d => (d.maxPax - (d.currentPax || 0)) > 0);
// Muestra grid de departures disponibles con:
// - Fecha formateada
// - Cupos restantes
// - Precio dinámico según currentPax + 1
```

**Modo Privado (Calendario):**
```typescript
// Calendario interactivo con:
// - Navegación mes a mes
// - Bloqueo de fechas pasadas (isPast)
// - Selección de fecha futura
```

### Step 1: Datos del Usuario

Campos requeridos:
- Nombre, Email, Teléfono, Documento, Pax, Notas

Validación:
```typescript
const isStepValid = () => {
    if (step === 0) return mode === 'public' ? !!selectedDeparture : !!selectedDate;
    if (step === 1) return formData.name && formData.email && formData.phone && formData.pax > 0;
    return true;
};
```

### Step 2: Resumen y Pago

Muestra:
- Ticket visual con datos de reserva
- Responsable, fecha, viajeros, total
- **BoldCheckout** (solo si `realBookingId` existe)

### Step 3: Estado de Éxito

- Check verde animado
- Mensaje de confirmación
- Referencia de transacción
- Botón "Volver al Tour"

---

## 4. Smart Form Persistence

### 4.1 Carga de Datos (Mount)

```typescript
useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('nevado_user_draft');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData(prev => ({
                ...prev,
                name: parsed.name || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                document: parsed.document || ''
            }));
        }
    }
}, []);
```

### 4.2 Guardado Automático

```typescript
useEffect(() => {
    if (formData.name || formData.email || formData.phone || formData.document) {
        const draft = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            document: formData.document
        };
        localStorage.setItem('nevado_user_draft', JSON.stringify(draft));
    }
}, [formData.name, formData.email, formData.phone, formData.document]);
```

### 4.3 Formato de Teléfono

```typescript
let finalPhone = formData.phone.trim();
if (!finalPhone.startsWith('+')) {
    finalPhone = `+57${finalPhone}`;  // Colombia por defecto
}
```

---

## 5. Test Mode - Staging Integration

### 5.1 Carga Dinámica del Tour de Test

```typescript
useEffect(() => {
    if (!isOpen) return;

    async function loadTestTour() {
        const fetched = await getStagingTestTour();
        if (fetched) {
            setTestTour(fetched);
            setIsTestMode(true);
            console.log("Test tour loaded from staging:", fetched);
        } else {
            console.log("Test tour not available, using production tour");
        }
    }

    loadTestTour();
}, [isOpen]);
```

### 5.2 Tour Efectivo

```typescript
const effectiveTour = testTour || tour;
// Usa testTour si está disponible, sino usa tour de producción
```

### 5.3 Indicador Visual

```jsx
{isTestMode && (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 z-30">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
        TEST MODE
    </div>
)}
```

### 5.4 Precios del Test Tour (Staging)

| Pax | Precio COP | Precio USD |
|-----|-------------|------------|
| 1   | $500,000    | $150       |
| 2   | $450,000    | $130       |
| 3   | $400,000    | $110       |
| 4-8 | $350,000    | $100       |

---

## 6. Bold Checkout Integration

### 6.1 Componente BoldCheckout

```typescript
// app-v1/app/components/ui/BoldCheckout.tsx
export default function BoldCheckout({ bookingId }: { bookingId: string }) {
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Flujo de inicialización...
}
```

### 6.2 Flujo de Inicialización

```typescript
// 1. Fetch payload seguro del backend
const data: BoldPaymentData = await initBoldPayment(bookingId);

// 2. Limpiar container
if (containerRef.current) {
    containerRef.current.innerHTML = '';
}

// 3. Crear script element
const script = document.createElement('script');
script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
script.async = true;

// 4. Configurar atributos OBLIGATORIOS ANTES de append
script.setAttribute('data-bold-button', 'true');
script.setAttribute('data-api-key', data.apiKey);
script.setAttribute('data-amount', data.amount.toString());
script.setAttribute('data-currency', data.currency);
script.setAttribute('data-order-id', data.paymentReference);
script.setAttribute('data-reference', data.paymentReference);
script.setAttribute('data-integrity-signature', data.integritySignature);
script.setAttribute('data-description', data.description);
script.setAttribute('data-redirection-url', data.redirectionUrl);
script.setAttribute('data-style-label', 'PAGAR AHORA');

// 5. Append al DOM (trigger ejecución)
containerRef.current.appendChild(script);
```

### 6.3 Atributos Obligatorios

| Atributo | Fuente | Descripción |
|----------|--------|-------------|
| `data-bold-button` | Static | Always "true" |
| `data-api-key` | API | Public key from backend |
| `data-integrity-signature` | API | Secure hash for transaction |
| `data-order-id` | API | Maps to `paymentReference` |
| `data-reference` | API | Payment reference |
| `data-amount` | API | Amount in COP |
| `data-currency` | API | "COP" |
| `data-description` | API | Transaction description |
| `data-redirection-url` | API | Target: `/payment-result` |

### 6.4 Estados del Widget

```typescript
// loading: "Conectando Bold..." (spinner)
// ready: Muestra botón "PAGAR AHORA"
// error: Mensaje de error con details
```

---

## 7. Flujo Circular de Pago

### 7.1 Path Persistence (Al Abrir Modal)

```typescript
useGSAP(() => {
    if (isOpen) {
        // Guarda ruta inmediatamente al abrir
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastTourPath', window.location.pathname);
        }
        // Animación de entrada...
    }
}, [isOpen]);
```

### 7.2 Redirect Loop Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CIRCULAR PAYMENT FLOW                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. USER COMPLETES BOOKING                                          │
│     BookingModal Step 1 → POST /bookings/private                    │
│     → Crea reserva → Retorna bookingId                              │
│                                                                     │
│  2. BOLD CHECKOUT LOAD                                              │
│     BoldCheckout → POST /payments/init {bookingId}                  │
│     → Retorna secure payload (apiKey, signature, etc.)              │
│     → Inyecta script Bold con data-* attributes                     │
│                                                                     │
│  3. USER PAYS IN BOLD SANDBOX                                       │
│     Clic botón "PAGAR AHORA" → Bold Gateway                         │
│     → Pago simulado en sandbox                                      │
│                                                                     │
│  4. BOLD REDIRECTS TO TRAMPOLINE                                    │
│     → /payment-result?bold-tx-status=approved                       │
│       &bold-order-id=NTK-XXX                                        │
│                                                                     │
│  5. PAYMENT RESULT PAGE (Trampoline)                                │
│     useEffect → Lee lastTourPath de localStorage                    │
│     → Construye URL: /tours/[id]?payment_status=approved&ref=XXX    │
│     → Espera 2.5s (mostrar mensaje éxito)                           │
│     → window.location.href = finalUrl (navegación ABSOLUTA)         │
│                                                                     │
│  6. AUTO-APERTURE (Client-side Detection)                           │
│     TourHeader.tsx → Detecta payment_status=approved                │
│     → setIsModalOpen(true)                                          │
│                                                                     │
│  7. BOOKINGMODAL AUTO-OPENS                                         │
│     useEffect → Detecta payment_status=approved                     │
│     → setStep(3)                                                    │
│     → setPaymentRef(ref)                                            │
│     → Muestra Step 3 (Success State)                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3 Payment Result Trampoline Page

```typescript
// app-v1/app/payment-result/page.tsx
useEffect(() => {
    const txStatus = searchParams.get('bold-tx-status');
    const orderId = searchParams.get('bold-order-id');
    
    const savedPath = typeof window !== 'undefined' 
        ? localStorage.getItem('lastTourPath') 
        : null;
    
    const returnPath = savedPath || '/';

    if (txStatus === 'approved') {
        setTimeout(() => {
            setStatus('success');
            setMessage("¡Pago Exitoso! Volviendo a tu aventura...");
            
            const finalUrl = `${returnPath}${returnPath.includes('?') ? '&' : '?'}payment_status=approved&ref=${orderId}`;
            console.log("Payment Result - Final Redirect URL:", finalUrl);
            
            setTimeout(() => {
                localStorage.removeItem('lastTourPath');
                window.location.href = finalUrl;  // Navegación ABSOLUTA
            }, 2500);
        }, 0);
    }
}, [searchParams, router]);
```

### 7.4 Auto-Aperture (TourHeader)

```typescript
// app-v1/app/components/tour-detail/TourHeader.tsx
useEffect(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment_status');
        
        if (paymentStatus === 'approved') {
            console.log("TourHeader - Opening modal for approved payment");
            setTimeout(() => {
                setIsModalOpen(true);
            }, 100);
        }
    }
}, []);
```

### 7.5 Auto-Aperture (BookingModal)

```typescript
// app-v1/app/components/tour-detail/BookingModal.tsx
useEffect(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment_status');
        const ref = params.get('ref');
        console.log("BookingModal - Payment Status:", paymentStatus, "Ref:", ref);

        if (paymentStatus === 'approved') {
            console.log("BookingModal - Setting to Step 3 and opening modal");
            setStep(3);
            setPaymentRef(ref);
            window.scrollTo(0, 0);
        }
    }
}, []);
```

---

## 8. API Endpoints

### 8.1 Production API (Tours & Departures)

```typescript
API_BASE_URL = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api/public'

// GET /tours - Lista de tours activos
GET ${API_BASE_URL}/tours

// GET /departures - Salidas disponibles
GET ${API_BASE_URL}/departures
```

### 8.2 Staging API (Payments)

```typescript
PAYMENTS_API_URL = 'https://api-6ups4cehla-uc.a.run.app/public'

// POST /bookings/private - Crear reserva privada
POST ${PAYMENTS_API_URL}/bookings/private

Request:
{
  tourId: "test-tour-001",
  date: "2025-02-01",
  pax: 2,
  customer: {
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+573001234567",
    document: "12345678"
  }
}

Response:
{
  success: true,
  bookingId: "B7GsNokzJNWWJ7XiR9pi",
  departureId: "eJJAALswaig5sP51YY7J"
}

// POST /payments/init - Inicializar pago Bold
POST ${PAYMENTS_API_URL}/payments/init

Request:
{
  bookingId: "B7GsNokzJNWWJ7XiR9pi"
}

Response:
{
  paymentReference: "NTK-B7GsNokzJNWWJ7XiR9pi-1768518374558",
  amount: 900000,
  currency: "COP",
  apiKey: "_GA1B83TxaKPxI6m6zy1A8oaKxUTAXM9qknBWE2uo0Q",
  integritySignature: "032243f7bb13e3e3e1bdc57e2c10a983d069fe2dfee9b5f33d857aa752e05691",
  redirectionUrl: "https://nevado-trek.com/payment-result",
  description: "Reserva Nevado Trek - B7GsNokzJNWWJ7XiR9pi",
  tax: 0
}
```

### 8.3 Staging Test Tour

```typescript
STAGING_API_URL = 'https://api-6ups4cehla-uc.a.run.app/public'

// GET /tours - Obtener test-tour-001
GET ${STAGING_API_URL}/tours
// Filtra: tours.find(t => t.tourId === 'test-tour-001')

Response (test-tour-001):
{
  tourId: "test-tour-001",
  name: { "es": "Tour de Prueba", "en": "Test Tour" },
  shortDescription: { "es": "Un tour de ejemplo para pruebas", "en": "A sample tour for testing" },
  isActive: true,
  pricingTiers: [
    { "minPax": 1, "maxPax": 1, "priceCOP": 500000, "priceUSD": 150 },
    { "minPax": 2, "maxPax": 2, "priceCOP": 450000, "priceUSD": 130 },
    { "minPax": 3, "maxPax": 3, "priceCOP": 400000, "priceUSD": 110 },
    { "minPax": 4, "maxPax": 8, "priceCOP": 350000, "priceUSD": 100 }
  ]
}
```

---

## 9. Animaciones GSAP

### 9.1 Modal Entry

```typescript
useGSAP(() => {
    if (isOpen) {
        const isMobile = window.innerWidth < 768;
        gsap.fromTo(modalRef.current,
            { autoAlpha: 0, y: isMobile ? '100vh' : 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power4.out" }
        );
    }
}, [isOpen]);
```

### 9.2 Step Transition

```typescript
useEffect(() => {
    if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
            { autoAlpha: 0, y: 15 },
            { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.025, ease: "power2.out", force3D: true }
        );
    }
}, [step, mode]);
```

### 9.3 Progress Bar

```typescript
// Header del modal
<div 
    className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
    style={{ width: `${(step / 2) * 100}%` }}
></div>
```

---

## 10. Helper Functions

### 10.1 Calendario

```typescript
const getDaysInMonth = (date: Date) => 
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday start
};

const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date < today;
};
```

### 10.2 Formato de Dinero

```typescript
const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ES' ? 'es-CO' : 'en-US', { 
        style: 'currency', 
        currency: 'COP',
        maximumFractionDigits: 0 
    }).format(amount);
};
```

### 10.3 Cálculo de Precio

```typescript
const getPrice = () => {
    const pricing = mode === 'public' && selectedDeparture 
        ? selectedDeparture.pricingSnapshot 
        : effectiveTour.pricingTiers;
    
    const totalPax = (mode === 'public' && selectedDeparture 
        ? selectedDeparture.currentPax 
        : 0) + formData.pax;
    
    const tier = pricing.find(t => 
        totalPax >= t.minPax && totalPax <= t.maxPax
    ) || pricing[0];
    
    return tier.priceCOP;
};
```

---

## 11. Debug Logs

### 11.1 Consola del Navegador

**Al abrir modal:**
```
Test tour loaded from staging: {tourObject}
```

**Al detectar pago exitoso:**
```
TourHeader - Payment Status: approved isModalOpen: false
TourHeader - Opening modal for approved payment
BookingModal - Payment Status: approved Ref: NTK-XXX
BookingModal - Setting to Step 3 and opening modal
```

**Al crear reserva:**
```
Booking Creation Error: Error message
```

**Al cargar Bold:**
```
Bold Payload Ready: NTK-XXX
Bold Script Injected into DOM
```

**En Payment Result:**
```
Payment Result - Saved Path: /tours/XXX
Payment Result - txStatus: approved orderId: NTK-XXX
Payment Result - Final Redirect URL: /tours/XXX?payment_status=approved&ref=NTK-XXX
```

---

## 12. Troubleshooting

### 12.1 Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| Modal no abre tras pago | `payment_status` no detectado | Verificar `URLSearchParams` en useEffect con `[]` |
| Redirección falla en GH Pages | `router.replace` no incluye basePath | Usar `window.location.href` |
| Bold button no carga | Atributos `data-*` después de append | Configurar ANTES de `appendChild` |
| Datos perdidos en reload | No se guarda en localStorage | Verificar `nevado_user_draft` |
| Tour test no carga | API staging no responde | Verificar `getStagingTestTour()` |
| Calendario permite fechas pasadas | `isPast()` falla | Verificar helper function |
| Error "data-api-key required" | Inyección sucia | Usar "Clean Injection Pattern" |
| Hydration mismatch | useSearchParams en SSR | Usar `window.location.search` + useEffect |

### 12.2 GitHub Pages Considerations

**Base Path:**
```typescript
// next.config.ts
const isProd = process.env.NODE_ENV === 'production';
basePath: isProd ? `/${repoName}` : ""
// Producción: /NEVADOTREK.COM-V3.0-PROYECY
// Desarrollo: / (empty)
```

**Navegación Absoluta:**
```typescript
// ✅ Correcto - Incluye basePath
window.location.href = finalUrl;

// ❌ Incorrecto - No incluye basePath
router.replace(finalUrl);
```

### 12.3 Rate Limiting

- **Límite:** 5 requests por IP cada 15 minutos
- **Error:** `"Demasiados intentos de reserva. Por favor intenta de nuevo en 15 minutos."`
- **Headers:** `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

---

## 13. Estructura de Archivos

```
app-v1/
├── app/
│   ├── components/
│   │   ├── tour-detail/
│   │   │   ├── BookingModal.tsx      # Modal principal (619 líneas)
│   │   │   ├── TourHeader.tsx        # Auto-apertura tras pago
│   │   │   └── ...
│   │   └── ui/
│   │       └── BoldCheckout.tsx      # Integración Bold (128 líneas)
│   ├── services/
│   │   └── nevado-api.ts             # Funciones API
│   └── payment-result/
│       └── page.tsx                  # Trampoline page
└── ...
```

---

## 14. Consideraciones de Rendimiento

### 14.1 Optimizaciones
- **No-Suspense Pattern:** Evita `useSearchParams` en layout principal
- **GPU Acceleration:** `transform-gpu`, `will-change-transform`
- **Static Export:** `output: "export"` en next.config.ts
- **Font Fallbacks:** Sistema como fallback de Google Fonts

### 14.2 Evitar
- Animar `width`, `height`, `left`, `top` (usar `transform`)
- `useSearchParams` en componentes con GSAP (causa hydration errors)
- `any` en TypeScript (strict mode)

---

**Documentación completada: 2026-01-15**
