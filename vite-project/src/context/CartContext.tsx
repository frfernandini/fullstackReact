import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { Producto } from '../components/Producto';

interface CartItem extends Producto {
    cantidad: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Producto) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('carrito');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Producto) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevItems, { ...product, cantidad: 1 }];
        });
        alert(`${product.titulo} agregado al carrito`);
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, cantidad: newQuantity } : item
                )
            );
        }
    };

    const clearCart = (mostrarConfirm: boolean = true) => {
        if (!mostrarConfirm || window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            setCartItems([]); // vacía el carrito
        }
    };

    const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
