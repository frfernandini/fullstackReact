import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { CardProd } from "./CardProd";
import { CartProvider } from "../context/CartContext";
import type { Producto } from "./Producto";

// Mock de producto sin oferta
const mockProductoSinOferta: Producto = {
    id: '1',
    titulo: 'Café Colombiano Premium',
    precio: 15000,
    descripcion: 'Café de alta calidad con notas frutales',
    categoria: 'Café',
    imagen: '/img/cafe-colombiano.jpg',
    oferta: false
};

// Mock de producto con oferta
const mockProductoConOferta: Producto = {
    id: '2',
    titulo: 'Té Verde Orgánico',
    precio: 12000,
    descripcion: 'Té verde natural con propiedades antioxidantes',
    categoria: 'Té',
    imagen: '/img/te-verde.jpg',
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

        // Verificar que el título se muestre
        expect(screen.getByText('Café Colombiano Premium')).toBeDefined();
        
        // Verificar que el precio se muestre (con coma o punto según locale)
        expect(screen.getByText(/\$15[.,]000/)).toBeDefined();
        
        // Verificar que la descripción se muestre
        expect(screen.getByText('Café de alta calidad con notas frutales')).toBeDefined();
        
        // Verificar que el botón de agregar al carrito exista
        expect(screen.getByText(/Agregar al Carrito/i)).toBeDefined();
    });

    test("Debería renderizar correctamente un producto con oferta", () => {
        renderWithProviders(mockProductoConOferta);

        // Verificar que el título se muestre
        expect(screen.getByText('Té Verde Orgánico')).toBeDefined();
        
        // Verificar que el precio original (tachado) se muestre (con coma o punto según locale)
        expect(screen.getByText(/\$12[.,]000/)).toBeDefined();
        
        // Verificar que el precio con descuento se muestre (12000 - 20% = 9600)
        expect(screen.getByText(/\$9[.,]600/)).toBeDefined();
        
        // Verificar que el badge de descuento se muestre
        expect(screen.getByText('-20% OFF')).toBeDefined();
    });

    test("Debería llamar a addToCart cuando se hace clic en el botón", () => {
        renderWithProviders(mockProductoSinOferta);

        // Buscar el botón de agregar al carrito
        const btnAgregar = screen.getByText(/Agregar al Carrito/i);
        
        // Simular el clic
        fireEvent.click(btnAgregar);
        
        // Verificar que se haya llamado a window.alert (por el addToCart)
        expect(window.alert).toHaveBeenCalledWith('Café Colombiano Premium agregado al carrito');
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
        // Usar regex para aceptar tanto punto como coma como separador de miles
        expect(screen.getByText(/\$7[.,]000/)).toBeDefined();
        expect(screen.getByText('-30% OFF')).toBeDefined();
    });

    test("No debería mostrar el badge de oferta si el producto no tiene oferta", () => {
        renderWithProviders(mockProductoSinOferta);

        // Verificar que el badge de oferta NO esté presente
        const badge = screen.queryByText(/-\d+% OFF/);
        expect(badge).toBeNull();
    });

    test("Debería mostrar la imagen del producto con el alt correcto", () => {
        renderWithProviders(mockProductoSinOferta);

        // Buscar la imagen por el alt
        const imagen = screen.getByAltText('Café Colombiano Premium');
        
        // Verificar que la imagen tenga el src correcto
        expect(imagen.getAttribute('src')).toBe('/img/cafe-colombiano.jpg');
    });
});
