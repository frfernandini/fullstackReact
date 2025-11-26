import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { Producto } from '../components/Producto';
import { carritoService } from '../api/carritoService';
import { useUsers } from './UserContext';

interface CartItem extends Producto {
    cantidad: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Producto) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    loadCart: () => Promise<void>;
    cartCount: number;
    loading: boolean;
    error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Inicializar desde localStorage si existe
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const storedCart = localStorage.getItem('carrito');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Error parsing initial cart from localStorage:', error);
            return [];
        }
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser, isLoggedIn } = useUsers();

    // Manejar cambios en el estado de autenticación
    useEffect(() => {
        if (isLoggedIn && currentUser?.id) {
            // Usuario logueado: cargar desde API
            loadCart();
        } else if (!isLoggedIn) {
            // Usuario no logueado: usar localStorage
            const storedCart = localStorage.getItem('carrito');
            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);
                    if (Array.isArray(parsedCart)) {
                        setCartItems(parsedCart);
                    }
                } catch (error) {
                    console.error('Error parsing cart from localStorage:', error);
                    setCartItems([]);
                }
            }
        }
    }, [isLoggedIn, currentUser?.id]);

    // Siempre guardar en localStorage como respaldo
    useEffect(() => {
        // Guardar siempre en localStorage para persistencia
        try {
            localStorage.setItem('carrito', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    const syncCartWithServer = async (localCart: CartItem[]) => {
        if (!currentUser?.id || !isLoggedIn) return;
        
        const userId = Number(currentUser.id);
        if (isNaN(userId)) return;
        
        try {
            // Si hay productos en el carrito local, sincronizar con el servidor
            for (const item of localCart) {
                // Agregar el producto al carrito del servidor
                await carritoService.add(userId, Number(item.id));
                
                // Si la cantidad es mayor a 1, usar increase para ajustar
                for (let i = 1; i < item.cantidad; i++) {
                    await carritoService.increase(userId, Number(item.id));
                }
            }
        } catch (error) {
            console.error('Error syncing local cart with server:', error);
        }
    };

    const loadCart = async () => {
        if (!currentUser?.id || !isLoggedIn) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const userId = Number(currentUser.id);
            if (isNaN(userId)) {
                console.error('Invalid userId for loadCart:', currentUser.id);
                return;
            }

            // Obtener carrito local antes de cargar desde servidor
            const localCartString = localStorage.getItem('carrito');
            const localCart: CartItem[] = localCartString ? JSON.parse(localCartString) : [];
            
            // Si hay productos en el carrito local, sincronizar primero
            if (localCart.length > 0) {
                await syncCartWithServer(localCart);
                // Limpiar carrito local después de sincronización exitosa
                localStorage.removeItem('carrito');
            }
            
            const response = await carritoService.getCarrito(userId);
            const cartData = response.data;
            
            // Convertir respuesta de la API al formato CartItem
            const items = cartData.map((item: any) => ({
                ...item.producto,
                cantidad: item.cantidad
            }));
            
            setCartItems(items);
        } catch (error) {
            console.error('Error loading cart from API:', error);
            setError('Error al cargar el carrito');
            // En caso de error, mantener el carrito local
            const localCartString = localStorage.getItem('carrito');
            if (localCartString) {
                try {
                    const localCart = JSON.parse(localCartString);
                    setCartItems(localCart);
                } catch (parseError) {
                    console.error('Error parsing local cart:', parseError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: Producto) => {
        try {
            setError(null);
            
            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems(prevItems => {
                    const existingItem = prevItems.find(item => item.id === product.id);
                    if (existingItem) {
                        return prevItems.map(item =>
                            item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                        );
                    }
                    return [...prevItems, { ...product, cantidad: 1 }];
                });
            } else {
                // Asegurar que tenemos IDs numéricos válidos
                const userId = Number(currentUser.id);
                const productId = Number(product.id);
                
                if (isNaN(userId) || isNaN(productId)) {
                    throw new Error(`Invalid IDs: userId=${currentUser.id}, productId=${product.id}`);
                }
                
                console.log('Adding to cart with valid IDs:', { userId, productId });
                
                // Usar API
                await carritoService.add(userId, productId);
                await loadCart(); // Recargar carrito para obtener datos actualizados
            }
            
            alert(`Producto agregado al carrito`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Error al agregar al carrito');
            
            // Respaldo a localStorage si la API falla
            if (isLoggedIn) {
                setCartItems(prevItems => {
                    const existingItem = prevItems.find(item => item.id === product.id);
                    if (existingItem) {
                        return prevItems.map(item =>
                            item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                        );
                    }
                    return [...prevItems, { ...product, cantidad: 1 }];
                });
                alert(`Producto agregado al carrito`);
            }
        }
    };

    const removeFromCart = async (productId: number) => {
        try {
            setError(null);
            setLoading(true);
            
            if (!productId) {
                throw new Error('ID de producto inválido');
            }
            
            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            } else {
                const userId = Number(currentUser.id);
                const numericProductId = Number(productId);
                
                if (isNaN(userId) || isNaN(numericProductId) || userId <= 0 || numericProductId <= 0) {
                    throw new Error(`IDs inválidos: userId=${currentUser.id}, productId=${productId}`);
                }
                    // Usar API
                await carritoService.remove(userId, numericProductId);
                await loadCart(); 
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al eliminar del carrito: ${errorMessage}`);
            
            if (isLoggedIn && currentUser?.id) {
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: number, newQuantity: number) => {
        try {
            setError(null);
            setLoading(true);
            
            // Validaciones
            if (!productId || isNaN(productId) || productId <= 0) {
                throw new Error('ID de producto inválido');
            }
            
            if (isNaN(newQuantity) || newQuantity < 0) {
                throw new Error('Cantidad inválida');
            }
            
            if (newQuantity === 0) {
                await removeFromCart(productId);
                return;
            }
            
            // Limitar la cantidad máxima a un número razonable
            if (newQuantity > 99) {
                throw new Error('Cantidad máxima: 99 unidades');
            }

            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === productId ? { ...item, cantidad: newQuantity } : item
                    )
                );
            } else {
                const userId = Number(currentUser.id);
                const numericProductId = Number(productId);
                
                if (isNaN(userId) || isNaN(numericProductId) || userId <= 0 || numericProductId <= 0) {
                    throw new Error(`IDs inválidos: userId=${currentUser.id}, productId=${productId}`);
                }
                
                // Usar API - encontrar cantidad actual y ajustar
                const currentItem = cartItems.find(item => item.id === productId);
                if (!currentItem) {
                    throw new Error('Producto no encontrado en el carrito');
                }
                
                const difference = newQuantity - currentItem.cantidad;
                if (difference !== 0) {
                    if (difference > 0) {
                        // Incrementar cantidad
                        for (let i = 0; i < difference; i++) {
                            await carritoService.increase(userId, numericProductId);
                        }
                    } else {
                        // Decrementar cantidad
                        for (let i = 0; i < Math.abs(difference); i++) {
                            await carritoService.decrease(userId, numericProductId);
                        }
                    }
                    await loadCart(); // Reload cart to get updated data
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al actualizar cantidad: ${errorMessage}`);
            
            if (isLoggedIn && currentUser?.id) {
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === productId ? { ...item, cantidad: newQuantity } : item
                    )
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (cartItems.length === 0) {
            return;
        }
        
        if (!window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            return;
        }

        try {
            setError(null);
            setLoading(true);
            
            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems([]);
            } else {
                const userId = Number(currentUser.id);
                
                if (isNaN(userId) || userId <= 0) {
                    throw new Error(`ID de usuario inválido: ${currentUser.id}`);
                }
                
                // Use API
                await carritoService.vaciar(userId);
                await loadCart(); 
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al vaciar el carrito: ${errorMessage}`);
            
            if (isLoggedIn && currentUser?.id) {
                setCartItems([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            loadCart,
            cartCount,
            loading,
            error
        }}>
            {children}
        </CartContext.Provider>
    );
};
