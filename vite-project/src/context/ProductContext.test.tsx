import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductProvider, useProducts } from './ProductContext';
import type { Producto, Categoria } from '../components/Producto';
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
    writable: true
});

// Mock de productos de prueba

const mockCategoria: Categoria = {
    id: 2,
    nombre: 'Accesorios',
    descripcion: 'Acceosiros Gamer',
    imagen: '/public/img/mouse.png',
    activo: true
};

const mockProduct1: Producto = {
    id: 100,
    nombre: 'catan',
    precio: 10000,
    descripcion: 'catan',
    categoria: mockCategoria,
    imagen: '/public/img/catan.png',
    oferta: false
};

const mockProduct2: Producto = {
    id: 200,
    nombre: 'mouse',
    precio: 8000,
    descripcion: 'mouse ligero',
    categoria: mockCategoria,
    imagen: 'public/img/mouse.png',
    oferta: true,
    descuento: 20
};

// Wrapper para proveer el contexto
const wrapper = ({ children }: { children: ReactNode }) => (
    <ProductProvider>{children}</ProductProvider>
);

describe('ProductContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(localStorage, 'setItem');
        vi.spyOn(localStorage, 'getItem');
    });

    test('debería inicializar con productos por defecto de ProductoData', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        // Verificar que products es un objeto
        expect(typeof result.current.products).toBe('object');
        
        // Verificar que tiene al menos un producto (los datos por defecto)
        const productIds = Object.keys(result.current.products);
        expect(productIds.length).toBeGreaterThan(0);
    });

    test('debería agregar un nuevo producto', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        const initialCount = Object.keys(result.current.products).length;

        act(() => {
            result.current.addProduct(mockProduct1);
        });

        expect(Object.keys(result.current.products).length).toBe(initialCount + 1);
        expect(result.current.products['100']).toEqual(mockProduct1);
    });

    test('debería actualizar un producto existente si se agrega con el mismo id', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        act(() => {
            result.current.addProduct(mockProduct1);
        });

        const updatedProduct: Producto = {
            ...mockProduct1,
            precio: 12000,
            descripcion: 'catan actualizado'
        };

        act(() => {
            result.current.addProduct(updatedProduct);
        });

        // Debe mantener la misma cantidad de productos
        expect(result.current.products['100'].precio).toBe(12000);
        expect(result.current.products['100'].descripcion).toBe('catan actualizado');
    });

    test('debería eliminar un producto por su id', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        act(() => {
            result.current.addProduct(mockProduct1);
        });

        expect(result.current.products['100']).toBeDefined();

        act(() => {
            result.current.removeProduct(100);
        });

        expect(result.current.products['100']).toBeUndefined();
    });

    test('debería poder agregar múltiples productos', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        const initialCount = Object.keys(result.current.products).length;

        act(() => {
            result.current.addProduct(mockProduct1);
            result.current.addProduct(mockProduct2);
        });

        expect(Object.keys(result.current.products).length).toBe(initialCount + 2);
        expect(result.current.products['100']).toEqual(mockProduct1);
        expect(result.current.products['200']).toEqual(mockProduct2);
    });

    test('debería limpiar todos los productos', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        act(() => {
            result.current.addProduct(mockProduct1);
            result.current.addProduct(mockProduct2);
        });

        expect(Object.keys(result.current.products).length).toBeGreaterThan(0);

        act(() => {
            result.current.clearProducts();
        });

        expect(Object.keys(result.current.products).length).toBe(0);
    });

    test('debería guardar productos en localStorage cuando cambian', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        act(() => {
            result.current.addProduct(mockProduct1);
        });

        // Verificar que setItem fue llamado
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'productos',
            expect.any(String)
        );

        // Verificar que se guardó correctamente
        const saved = JSON.parse(localStorage.getItem('productos') || '{}');
        expect(saved['100']).toEqual(mockProduct1);
    });

    test('debería cargar productos desde localStorage si existen', () => {
        const mockProducts = {
            '100': mockProduct1,
            '200': mockProduct2
        };

        localStorage.setItem('productos', JSON.stringify(mockProducts));

        const { result } = renderHook(() => useProducts(), { wrapper });

        expect(result.current.products['100']).toEqual(mockProduct1);
        expect(result.current.products['200']).toEqual(mockProduct2);
    });

    test('debería manejar errores de localStorage corrupto', () => {
        // Simular localStorage corrupto
        localStorage.setItem('productos', 'invalid-json');

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { result } = renderHook(() => useProducts(), { wrapper });

        // Debería inicializar con productos por defecto
        expect(Object.keys(result.current.products).length).toBeGreaterThan(0);
        
        // Debería haber logueado el error
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test('no debería fallar al eliminar un producto que no existe', () => {
        const { result } = renderHook(() => useProducts(), { wrapper });

        const initialProducts = { ...result.current.products };

        act(() => {
            result.current.removeProduct(-1);
        });

        // No debería haber cambiado nada
        expect(Object.keys(result.current.products).length).toBe(Object.keys(initialProducts).length);
    });

    test('debería lanzar error si useProducts se usa fuera del Provider', () => {
        // Suprimir la salida de error en la consola durante este test
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useProducts());
        }).toThrow('useProducts must be used within a ProductProvider');

        consoleErrorSpy.mockRestore();
    });
});
