import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import BookingModal from '../app/components/tour-detail/BookingModal';
import * as api from '../app/services/nevado-api';
import { useLanguage } from '../app/context/LanguageContext';

// Mocks
vi.mock('../app/services/nevado-api', () => ({
    createPrivateBooking: vi.fn(),
    joinPublicBooking: vi.fn(),
    getStagingTestTour: vi.fn(),
    getTestTourDepartures: vi.fn(),
    getBookingStatus: vi.fn(),
    initBoldPayment: vi.fn(),
}));

vi.mock('../app/context/LanguageContext', () => ({
    LanguageProvider: ({ children }: any) => <div>{children}</div>,
    useLanguage: vi.fn().mockReturnValue({
        lang: 'ES',
        t: {
            booking_modal: {
                step_label: 'Reserva',
                price_per_person: 'Precio por persona',
                pax_label: 'Pax',
                mode_group: 'Grupal',
                mode_private: 'Privada',
                slots_left: '{count} cupos',
                info_title: 'Info',
                form: {
                    name_label: 'Nombre',
                    name_placeholder: 'Nombre completo',
                    email_label: 'Email',
                    email_placeholder: 'Email',
                    phone_label: 'Teléfono',
                    phone_placeholder: 'Teléfono',
                    document_label: 'Documento',
                    document_placeholder: 'Documento',
                    notes_label: 'Notas',
                    notes_placeholder: 'Notas',
                    pax_count_label: 'Viajeros'
                },
                confirmation: {
                    title: 'Confirmar',
                    responsible: 'Responsable',
                    guest: 'Invitado',
                    start_date: 'Fecha',
                    travelers: 'Viajeros',
                    pax_singular: 'Viajero',
                    pax_plural: 'Viajeros',
                    total_investment: 'Total'
                },
                waiting: {
                    syncing_bank: 'Sincronizando',
                    processing_msg: 'Procesando',
                    booking_created: 'Reserva creada',
                    dont_close: 'No cierres',
                    help_whatsapp: 'Ayuda',
                    verify_payment: 'Ya realicé el pago',
                    verifying: 'Verificando'
                },
                success: {
                    title: '¡Todo Listo!',
                    message: 'Mensaje éxito',
                    transaction_ref: 'Ref',
                    back_to_tour: 'Volver',
                    payment_approved: 'Aprobado',
                    booking_confirmed: 'Confirmado',
                    success_contact: 'Contacto'
                },
                footer: {
                    back: 'Atrás',
                    continue: 'Continuar',
                    pay_action: 'Ir a Pagar',
                    processing: 'Procesando'
                }
            }
        }
    })
}));

vi.mock('../app/components/ui/BoldCheckout', () => ({
    default: ({ onPaymentClick }: any) => (
        <button data-testid="mock-bold-btn" onClick={onPaymentClick}>
            Mock Pay
        </button>
    )
}));

const mockTour: any = {
    tourId: 't1',
    name: { es: 'Tour Test', en: 'Test Tour' },
    pricingTiers: [{ minPax: 1, maxPax: 10, priceCOP: 1000 }]
};

const renderModal = () => {
    return render(
        <BookingModal isOpen={true} onClose={vi.fn()} tour={mockTour} />
    );
};

describe('BookingModal Payment Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should allow manual check of payment status and advance to success', async () => {
        // 1. Setup mocks
        (api.createPrivateBooking as any).mockResolvedValue({ bookingId: 'B123' });
        (api.getBookingStatus as any).mockResolvedValue({ status: 'confirmed', paymentStatus: 'approved' });

        renderModal();

        // 2. FORCE ADVANCE TO STEP 2
        fireEvent.click(screen.getByText(/Privada/i));
        
        // Select a date
        const dayButtons = screen.getAllByRole('button');
        const dateBtn = dayButtons.find(b => !b.hasAttribute('disabled') && b.textContent === '28');
        if (dateBtn) fireEvent.click(dateBtn);

        fireEvent.click(screen.getByText(/CONTINUAR/i));

        // Fill Form
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: 'Juan' } });
            fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
            fireEvent.change(screen.getByPlaceholderText(/Teléfono/i), { target: { value: '3001234567' } });
            fireEvent.change(screen.getByPlaceholderText(/Documento/i), { target: { value: '123' } });
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/CONTINUAR/i));
        });

        // 3. TRIGGER PAYMENT (Click "Ir a Pagar")
        const payBtn = await waitFor(() => screen.getByText(/Ir a Pagar/i));

        await act(async () => {
            fireEvent.click(payBtn);
        });

        // 4. VERIFY WAITING STATE
        await waitFor(() => {
            expect(screen.getByText(/Reserva Recibida/i)).toBeTruthy();
        });

        // 5. MANUAL CHECK (Click "Ya realicé el pago")
        const checkBtn = screen.getByText(/Ya realicé el pago/i);
        await act(async () => {
            fireEvent.click(checkBtn);
        });

        // 6. VERIFY SUCCESS STATE (In-place mutation)
        await waitFor(() => {
            expect(screen.getByText(/¡Reserva Confirmada!/i)).toBeTruthy();
        });
    });

    it('should allow joining a public departure and advance to payment', async () => {
        // 1. Setup mocks
        const mockDeparture = {
            departureId: 'dep1',
            date: { _seconds: Math.floor(Date.now() / 1000) + 86400 },
            maxPax: 10,
            currentPax: 2,
            pricingSnapshot: [{ minPax: 1, maxPax: 10, priceCOP: 1000 }]
        };

        // Mock Test Tour & Departures to simulate Staging Test Mode
        (api.getStagingTestTour as any).mockResolvedValue(mockTour);
        (api.getTestTourDepartures as any).mockResolvedValue([mockDeparture]);
        (api.joinPublicBooking as any).mockResolvedValue({ bookingId: 'B_PUB_123' });
        
        render(
            <BookingModal isOpen={true} onClose={vi.fn()} tour={mockTour} departures={[]} />
        );

        // 2. Select Group Mode (it is default, but click anyway)
        fireEvent.click(screen.getByText(/Grupal/i));

        // Select the departure (Wait for it to load from "Test API")
        const depBtn = await waitFor(() => screen.getByText(/8 cupos/i));
        fireEvent.click(depBtn);

        fireEvent.click(screen.getByText(/CONTINUAR/i));

        // Fill Form
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: 'Maria' } });
            fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'maria@test.com' } });
            fireEvent.change(screen.getByPlaceholderText(/Teléfono/i), { target: { value: '3009876543' } });
            fireEvent.change(screen.getByPlaceholderText(/Documento/i), { target: { value: '456' } });
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/CONTINUAR/i));
        });

        // 3. TRIGGER PAYMENT
        const payBtn = await waitFor(() => screen.getByText(/Ir a Pagar/i));
        
        await act(async () => {
            fireEvent.click(payBtn);
        });

        // Verify joinPublicBooking was called with correct ID
        expect(api.joinPublicBooking).toHaveBeenCalledWith(expect.objectContaining({
            departureId: 'dep1'
        }));

        // 4. VERIFY WAITING STATE
        await waitFor(() => {
            expect(screen.getByText(/Reserva Recibida/i)).toBeTruthy();
        });
        expect(screen.getAllByText(/B_PUB_123/i).length).toBeGreaterThan(0);
    });
});
