
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import type { Producto } from '../components/Producto';
import type { ReactNode } from 'react';

// Mock de localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock de datos de productos para usar en los tests
const mockProduct1: Producto = {
    id: '1',
    titulo: 'Café Colombiano',
    precio: 10,
    descripcion: 'Un café suave y balanceado.',
    categoria: 'Café',
    imagen: 'colombiano.jpg',
    oferta: false
};

const mockProduct2: Producto = {
    id: '2',
    titulo: 'Té Verde',
    precio: 8,
    descripcion: 'Té verde antioxidante.',
    categoria: 'Té',
    imagen: 'te_verde.jpg',
    oferta: true,
    descuento: 10
};

// Wrapper para proveer el contexto a nuestro hook en los tests
const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
    // Mock para localStorage antes de cada test
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(localStorage, 'setItem');
        window.alert = vi.fn();
        window.confirm = vi.fn(() => true); // Simula que el usuario siempre hace clic en "Aceptar"
    });

    test('debería tener un carrito vacío por defecto', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartCount).toBe(0);
    });

    test('debería añadir un nuevo producto al carrito', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartItems[0].id).toBe(mockProduct1.id);
        expect(result.current.cartItems[0].cantidad).toBe(1);
        expect(result.current.cartCount).toBe(1);
    });

    test('debería incrementar la cantidad si el producto ya existe en el carrito', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Añadimos el producto dos veces
        act(() => {
            result.current.addToCart(mockProduct1);
        });
        act(() => {
            result.current.addToCart(mockProduct1);
        });

        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartItems[0].cantidad).toBe(2);
        expect(result.current.cartCount).toBe(2);
    });

    test('debería eliminar un producto del carrito', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        expect(result.current.cartItems.length).toBe(1); // Verificamos que se añadió

        act(() => {
            result.current.removeFromCart(mockProduct1.id);
        });

        expect(result.current.cartItems.length).toBe(0);
        expect(result.current.cartCount).toBe(0);
    });

    test('debería actualizar la cantidad de un producto', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        act(() => {
            result.current.updateQuantity(mockProduct1.id, 5);
        });

        expect(result.current.cartItems[0].cantidad).toBe(5);
        expect(result.current.cartCount).toBe(5);
    });

    test('debería eliminar el producto si la cantidad se actualiza a 0 o menos', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        act(() => {
            result.current.updateQuantity(mockProduct1.id, 0);
        });

        expect(result.current.cartItems.length).toBe(0);
    });

    test('debería limpiar todo el carrito', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Añadimos dos productos diferentes
        act(() => {
            result.current.addToCart(mockProduct1);
        });
        act(() => {
            result.current.addToCart(mockProduct2);
        });

        expect(result.current.cartItems.length).toBe(2);
        expect(result.current.cartCount).toBe(2);

        act(() => {
            result.current.clearCart();
        });

        expect(result.current.cartItems.length).toBe(0);
        expect(result.current.cartCount).toBe(0);
    });

    test('debería llamar a localStorage.setItem cuando el carrito cambia', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        // Verificamos que setItem fue llamado con los datos correctos
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'carrito',
            JSON.stringify([{ ...mockProduct1, cantidad: 1 }])
        );
    });
});
