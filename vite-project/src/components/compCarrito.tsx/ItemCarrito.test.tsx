import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { ItemCarrito } from "./ItemCarrito";

describe('ItemCarrito', () => {
    let mockUpdateQuantity: ReturnType<typeof vi.fn>;
    let mockRemoveFromCart: ReturnType<typeof vi.fn>;
    let mockCalcularPrecioFinal: ReturnType<typeof vi.fn>;

    const mockItemSinOferta = {
        id: '1',
        titulo: 'catan',
        precio: 10000,
        descripcion: 'catan',
        categoria: 'teclados',
        imagen: '/public/img/catan.png',
        oferta: false,
        cantidad: 2
    };

    const mockItemConOferta = {
        id: '2',
        titulo: 'mouse',
        precio: 8000,
        descripcion: 'mouse ligero',
        categoria: 'mouses',
        imagen: 'public/img/mouse.png',
        oferta: true,
        descuento: 20,
        cantidad: 3
    };

    beforeEach(() => {
        mockUpdateQuantity = vi.fn();
        mockRemoveFromCart = vi.fn();
        mockCalcularPrecioFinal = vi.fn((item) => {
            if (item.oferta && item.descuento) {
                return item.precio * (1 - item.descuento / 100);
            }
            return item.precio;
        });
    });

    test("Debería renderizar correctamente un item sin oferta", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        expect(screen.getByText('catan')).toBeDefined();
        expect(screen.getByText('teclados')).toBeDefined();
        expect(screen.getByAltText('catan')).toBeDefined();
    });

    test("Debería renderizar correctamente un item con oferta", () => {
        render(
            <ItemCarrito
                item={mockItemConOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        expect(screen.getByText('mouse')).toBeDefined();
        expect(screen.getByText('-20% OFF')).toBeDefined();
    });

    test("Debería mostrar el precio tachado cuando hay oferta", () => {
        const { container } = render(
            <ItemCarrito
                item={mockItemConOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const precioTachado = container.querySelector('.text-decoration-line-through');
        expect(precioTachado).toBeTruthy();
        expect(precioTachado?.textContent).toMatch(/\$8[.,]000/);
    });

    test("Debería calcular y mostrar el precio final correctamente", () => {
        render(
            <ItemCarrito
                item={mockItemConOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        expect(mockCalcularPrecioFinal).toHaveBeenCalledWith(mockItemConOferta);
        
        // Precio con descuento: 8000 * 0.8 = 6400
        expect(screen.getByText(/\$6[.,]400/)).toBeDefined();
    });

    test("Debería calcular y mostrar el subtotal correctamente (precio x cantidad)", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        // Subtotal: 10000 * 2 = 20000
        expect(screen.getByText(/\$20[.,]000/)).toBeDefined();
    });

    test("Debería mostrar el input de cantidad con el valor correcto", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const inputCantidad = screen.getByDisplayValue('2') as HTMLInputElement;
        expect(inputCantidad.value).toBe('2');
        expect(inputCantidad.type).toBe('number');
    });

    test("Debería llamar a updateQuantity al hacer clic en el botón +", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const buttons = screen.getAllByRole('button');
        const btnIncrement = buttons.find(btn => btn.textContent === '+');
        
        if (btnIncrement) {
            fireEvent.click(btnIncrement);
            expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
        }
    });

    test("Debería llamar a updateQuantity al hacer clic en el botón -", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const buttons = screen.getAllByRole('button');
        const btnDecrement = buttons.find(btn => btn.textContent === '-');
        
        if (btnDecrement) {
            fireEvent.click(btnDecrement);
            expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
        }
    });

    test("Debería llamar a updateQuantity al cambiar el input manualmente", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const inputCantidad = screen.getByDisplayValue('2') as HTMLInputElement;
        fireEvent.change(inputCantidad, { target: { value: '5' } });

        expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 5);
    });

    test("Debería llamar a removeFromCart al hacer clic en el botón de eliminar", () => {
        const { container } = render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const btnEliminar = container.querySelector('.bi-trash')?.parentElement;
        
        if (btnEliminar) {
            fireEvent.click(btnEliminar);
            expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
        }
    });

    test("Debería tener el botón de eliminar con la clase correcta", () => {
        const { container } = render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const btnEliminar = container.querySelector('.btn-danger');
        expect(btnEliminar).toBeTruthy();
    });

    test("Debería mostrar la imagen del producto con el src correcto", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const imagen = screen.getByAltText('catan') as HTMLImageElement;
        expect(imagen.src).toContain('/public/img/catan.png');
    });

    test("Debería tener input con min=1 para prevenir cantidades negativas", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const inputCantidad = screen.getByDisplayValue('2') as HTMLInputElement;
        expect(inputCantidad.min).toBe('1');
    });

    test("Debería calcular subtotal con descuento correctamente", () => {
        render(
            <ItemCarrito
                item={mockItemConOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        // Precio con descuento: 8000 * 0.8 = 6400
        // Subtotal: 6400 * 3 = 19200
        expect(screen.getByText(/\$19[.,]200/)).toBeDefined();
    });

    test("No debería mostrar badge de oferta en item sin oferta", () => {
        render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        const badge = screen.queryByText(/-\d+% OFF/);
        expect(badge).toBeNull();
    });

    test("Snapshot: Debería mantener la estructura del componente sin oferta", () => {
        const { container } = render(
            <ItemCarrito
                item={mockItemSinOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });

    test("Snapshot: Debería mantener la estructura del componente con oferta", () => {
        const { container } = render(
            <ItemCarrito
                item={mockItemConOferta}
                calcularPrecioFinal={mockCalcularPrecioFinal}
                updateQuantity={mockUpdateQuantity}
                removeFromCart={mockRemoveFromCart}
            />
        );

        expect(container.firstChild).toMatchSnapshot();
    });
});
