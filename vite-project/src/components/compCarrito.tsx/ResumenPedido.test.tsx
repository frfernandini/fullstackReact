import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { ResumenPedido } from "./ResumenPedido";

describe('ResumenPedido', () => {
    let mockAbrirCheckout: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAbrirCheckout = vi.fn();
    });

    test("Debería renderizar correctamente con un subtotal dado", () => {
        const subtotal = 25000;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        // Verificar título
        expect(screen.getByText('Resumen del Pedido')).toBeDefined();
        
        // Verificar subtotal usando getAllByText ya que aparece múltiples veces
        const precioElements = screen.getAllByText(/\$\s*25[.,]000/);
        expect(precioElements.length).toBeGreaterThanOrEqual(1);
        
        // Verificar envío gratis
        expect(screen.getByText('Gratis')).toBeDefined();
        
        // Verificar botón de pagar
        expect(screen.getByText(/PAGAR/i)).toBeDefined();
    });

    test("Debería mostrar el subtotal y el total iguales cuando el envío es gratis", () => {
        const subtotal = 15000;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        // Ambos deben mostrar el mismo valor
        const precioElements = screen.getAllByText(/\$\s*15[.,]000/);
        expect(precioElements.length).toBeGreaterThanOrEqual(2);
    });

    test("Debería llamar a abrirCheckout cuando se hace clic en el botón PAGAR", () => {
        const subtotal = 30000;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        const btnPagar = screen.getByText(/PAGAR/i);
        fireEvent.click(btnPagar);

        expect(mockAbrirCheckout).toHaveBeenCalledTimes(1);
    });

    test("Debería formatear correctamente subtotales grandes con separadores de miles", () => {
        const subtotal = 1250000;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        // Verificar que se formatee con separadores usando getAllByText
        const precioElements = screen.getAllByText(/\$\s*1[.,]250[.,]000/);
        expect(precioElements.length).toBeGreaterThanOrEqual(1);
    });

    test("Debería mostrar el mensaje de pago seguro", () => {
        const subtotal = 10000;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        expect(screen.getByText(/Pago 100% seguro/i)).toBeDefined();
    });

    test("Debería mostrar el ícono de tarjeta de crédito en el botón", () => {
        const subtotal = 10000;
        const { container } = render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        const icon = container.querySelector('.bi-credit-card');
        expect(icon).toBeTruthy();
    });

    test("Debería mostrar el ícono de escudo de seguridad", () => {
        const subtotal = 10000;
        const { container } = render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        const icon = container.querySelector('.bi-shield-check');
        expect(icon).toBeTruthy();
    });

    test("Debería manejar subtotal de 0 correctamente", () => {
        const subtotal = 0;
        render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        // Buscar por el ID específico del subtotal para evitar conflictos
        const subtotalElement = document.getElementById('subtotal-price');
        expect(subtotalElement?.textContent).toMatch(/\$\s*0/);
    });

    test("Snapshot: Debería mantener la estructura del componente", () => {
        const subtotal = 50000;
        const { container } = render(<ResumenPedido subtotal={subtotal} abrirCheckout={mockAbrirCheckout} />);

        expect(container.firstChild).toMatchSnapshot();
    });
});
