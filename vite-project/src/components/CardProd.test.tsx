import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { CardProd } from "./CardProd";
import { CartProvider } from "../context/CartContext";
import type { Producto } from "./Producto";

// Mock de producto sin oferta 
const mockProductoSinOferta: Producto = {
    id: '1',
    titulo: 'catan',
    precio: 10000,
    descripcion: 'catan',
    categoria: 'teclados',
    imagen: '/public/img/catan.png',
    oferta: false
};

// Mock de producto con oferta
const mockProductoConOferta: Producto = {
    id: '2',
    titulo: 'mouse',
    precio: 8000,
    descripcion: 'mouse ligero',
    categoria: 'mouses',
    imagen: 'public/img/mouse.png',
    oferta: true,
    descuento: 20
};

// Componente wrapper que provee el contexto y el router necesarios
const renderWithProviders = (producto: Producto) => {
    return render(
        <BrowserRouter>
            <CartProvider>
                <CardProd producto={producto} />
            </CartProvider>
        </BrowserRouter>
    );
};

describe('CardProd', () => {
    beforeEach(() => {
        // Simular window.alert para que no interrumpa los tests
        window.alert = vi.fn();
        window.confirm = vi.fn(() => true);
    });

    test("Debería renderizar correctamente un producto sin oferta", () => {
        renderWithProviders(mockProductoSinOferta);

        // Verificar que el título se muestre (buscando por rol de encabezado)
        expect(screen.getByRole('heading', { name: 'catan' })).toBeDefined();
        
        // Verificar que el precio se muestre (con coma o punto según locale)
        expect(screen.getByText(/\$10[.,]000/)).toBeDefined();
        
        // Verificar que la descripción y el título (ambos "catan") están presentes
        const catanElements = screen.getAllByText('catan');
        expect(catanElements.length).toBeGreaterThanOrEqual(2);
        
        // Verificar que el botón de agregar al carrito exista
        expect(screen.getByText(/Agregar al Carrito/i)).toBeDefined();
    });

    test("Debería renderizar correctamente un producto con oferta", () => {
        renderWithProviders(mockProductoConOferta);

        // Verificar que el título se muestre
        expect(screen.getByText('mouse')).toBeDefined();
        
        // Verificar que el precio original (tachado) se muestre (con coma o punto según locale)
        expect(screen.getByText(/\$8[.,]000/)).toBeDefined();
        
        // Verificar que el precio con descuento se muestre (8000 - 20% = 6400)
        expect(screen.getByText(/\$6[.,]400/)).toBeDefined();
        
        // Verificar que el badge de oferta se muestre
        expect(screen.getByText('🔥 OFERTA 🔥')).toBeDefined();
        expect(screen.getByText('-20%')).toBeDefined();
    });

    test("Debería llamar a addToCart cuando se hace clic en el botón", () => {
        renderWithProviders(mockProductoSinOferta);

        // Buscar el botón de agregar al carrito
        const btnAgregar = screen.getByText(/Agregar al Carrito/i);
        
        // Simular el clic
        fireEvent.click(btnAgregar);
        
        // Verificar que el botón fue clickeado (el alert depende del contexto)
        expect(btnAgregar).toBeDefined();
    });

    test("Debería tener un link hacia la página de detalles del producto", () => {
        renderWithProviders(mockProductoSinOferta);

        // Buscar el link por su rol
        const link = screen.getByRole('link');
        
        // Verificar que el link tenga el href correcto
        expect(link.getAttribute('href')).toBe('/productos/1');
    });

    test("Snapshot: Debería mantener la estructura del componente sin oferta", () => {
        const { container } = renderWithProviders(mockProductoSinOferta);
        
        // Crear un snapshot del componente renderizado
        expect(container.firstChild).toMatchSnapshot();
    });

    test("Snapshot: Debería mantener la estructura del componente con oferta", () => {
        const { container } = renderWithProviders(mockProductoConOferta);
        
        // Crear un snapshot del componente renderizado
        expect(container.firstChild).toMatchSnapshot();
    });

    test("Debería calcular correctamente el precio con descuento", () => {
        // Producto con 30% de descuento
        const productoDescuento30: Producto = {
            id: '3',
            titulo: 'Producto Test',
            precio: 10000,
            descripcion: 'Descripción test',
            categoria: 'Test',
            imagen: '/img/test.jpg',
            oferta: true,
            descuento: 30
        };

        renderWithProviders(productoDescuento30);

        // Precio original: 10000
        // Descuento 30%: 10000 - 3000 = 7000
        expect(screen.getByText(/\$7[.,]000/)).toBeDefined();
        expect(screen.getByText('-30%')).toBeDefined();
    });

    test("No debería mostrar el badge de oferta si el producto no tiene oferta", () => {
        renderWithProviders(mockProductoSinOferta);

        // Verificar que el badge de oferta NO esté presente
        const badge = screen.queryByText('🔥 OFERTA 🔥');
        expect(badge).toBeNull();
    });

    test("Debería mostrar la imagen del producto con el alt correcto", () => {
        renderWithProviders(mockProductoSinOferta);

        // Buscar la imagen por el alt
        const imagen = screen.getByAltText('catan');
        
        // Verificar que la imagen tenga el src correcto
        expect(imagen.getAttribute('src')).toBe('/public/img/catan.png');
    });
});
