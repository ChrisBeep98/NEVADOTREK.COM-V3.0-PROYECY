import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import BookingModal from '../app/components/tour-detail/BookingModal';
import * as api from '../app/services/nevado-api';
import { useLanguage } from '../app/context/LanguageContext';

// Mocks
vi.mock('../app/services/nevado-api', () => ({
    createPrivateBooking: vi.fn(),
    getStagingTestTour: vi.fn(),
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
                footer: {
                    back: 'Atrás',
                    continue: 'Continuar'
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



                // Note: The button text is uppercase in CSS but check actual text content



                const payBtn = await waitFor(() => screen.getByText(/Ir a Pagar/i));



                fireEvent.click(payBtn);



        



                // 4. VERIFY WAITING STATE

        expect(screen.getByText(/Finalizando tu reserva/i)).toBeTruthy();



        // 5. MANUAL CHECK (Click "Ya realicé el pago")

        const checkBtn = screen.getByText(/Ya realicé el pago/i);

        await act(async () => {

            fireEvent.click(checkBtn);

        });



        // 6. VERIFY SUCCESS STATE

        await waitFor(() => {

            expect(screen.getByText(/¡Todo Listo!/i)).toBeTruthy();

        });

    });

});