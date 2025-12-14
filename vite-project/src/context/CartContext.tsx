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
        console.log('💾 [useEffect] Evaluando si guardar en localStorage');
        console.log('💾 [useEffect] isLoggedIn:', isLoggedIn);
        console.log('💾 [useEffect] CartItems:', cartItems);
        
        // ✅ CRÍTICO: Solo guardar en localStorage si NO está logueado
        if (!isLoggedIn) {
            if (cartItems.length > 0) {
                const validItems = cartItems.filter(item => 
                    item.id && 
                    typeof item.id === 'number' && 
                    item.cantidad > 0
                );
                
                if (validItems.length > 0) {
                    try {
                        const jsonString = JSON.stringify(validItems);
                        localStorage.setItem('carrito', jsonString);
                        console.log('✅ [useEffect] Guardado en localStorage (usuario NO logueado)');
                    } catch (error) {
                        console.error('❌ [useEffect] Error saving cart:', error);
                    }
                }
            } else {
                localStorage.removeItem('carrito');
                console.log('🗑️ [useEffect] localStorage limpiado (carrito vacío)');
            }
        } else {
            // ✅ Si está logueado, NO usar localStorage
            localStorage.removeItem('carrito');
            console.log('🗑️ [useEffect] localStorage limpiado (usuario logueado)');
        }
    }, [cartItems, isLoggedIn]);
    
    /*const syncCartWithServer = async (localCart: CartItem[]) => {
        if (!currentUser?.id || !isLoggedIn) return;
        
        const userId = currentUser.id;
        if (!userId || userId <= 0) return;
        
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
            
            const userId = currentUser.id;
            if (!userId || userId <= 0) {
                console.error('Invalid userId for loadCart:', {
                    userId,
                    userObject: currentUser
                });
                setError('ID de usuario inválido');
                return;
            }
            
            console.log('📡 Loading cart for user ID:', userId);

            // ✅ Cargar desde API
            const response = await carritoService.getCarrito(userId);
            const cartData = response.data;
            
            console.log('📦 Cart data from API:', JSON.stringify(cartData, null, 2));

            // ✅ SIEMPRE limpiar localStorage cuando el usuario está logueado
            localStorage.removeItem('carrito');
            console.log('🗑️ localStorage limpiado');
            
            // ✅ Mapear datos de la API
            const items = cartData.map((item: any) => {
                console.log('🔍 Mapeando item:', {
                    id: item.producto?.id,
                    nombre: item.producto?.nombre,
                    cantidad: item.cantidad
                });
                
                return {
                    ...item.producto,
                    titulo: item.producto?.nombre || item.producto?.titulo, // ✅ Soportar ambos campos
                    cantidad: item.cantidad || 1
                };
            });
            
            console.log('✅ Items finales:', items);
            setCartItems(items);
            
        } catch (error) {
            console.error('❌ Error loading cart from API:', error);
            setError('Error al cargar el carrito');
            
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
    };*/

    const syncCartWithServer = async (localCart: CartItem[]) => {
        if (!currentUser?.id || !isLoggedIn) return;
        
        const userId = currentUser.id;
        if (!userId || userId <= 0) return;
        
        try {
            //Obtener carrito actual de la API primero
            const currentApiCart = await carritoService.getCarrito(userId);
            const existingIds = new Set(currentApiCart.data.map((item: any) => item.producto.id));
            
            console.log('🔄 Sincronizando carrito. Items en API:', existingIds);
            
            //Solo sincronizar los productos que NO existen en la API, Iterara entre los items del carrito local y verificara la existencia de estos
            for (const item of localCart) {
                const productId = Number(item.id);
                
                if (existingIds.has(productId)) {
                    console.log(`⏭️Producto ${productId} ya existe en API, saltando...`);//VERIFICAR DESDE CONSOLA PRODUCTO EXISTENTE
                    continue; // ← EVITA DUPLICAR LOS PRODUCTOS
                }
                
                console.log(`➕ Agregando producto ${productId} a la API`);
                
                // Agregar el producto al carrito del servidor en caso de no existir de forma LOCAL
                await carritoService.add(userId, productId);
                
                //Si la cantidad es mayor a 1, usar increase para ajustar
                for (let i = 1; i < item.cantidad; i++) {
                    await carritoService.increase(userId, productId);
                }
            }
            
            console.log('✅Sincronización completada sin duplicados');
        } catch (error) {
            console.error('Error syn local cart with server:', error);
        }
    };

    const loadCart = async () => {
        if (!currentUser?.id || !isLoggedIn) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const userId = currentUser.id;
            if (!userId || userId <= 0) {
                console.error('Invalid userId for loadCart:', { userId, userObject: currentUser });
                setError('ID de usuario inválido');
                return;
            }
            
            console.log('📡 Loading cart for user ID:', userId);

            //Obtener carrito local
            const localCartString = localStorage.getItem('carrito');
            let localCart: CartItem[] = [];
            
            if (localCartString) {
                try {
                    localCart = JSON.parse(localCartString);
                    const validLocalCart = localCart.filter(item => 
                        item.id && 
                        typeof item.id === 'number' && 
                        !isNaN(item.id) &&
                        item.cantidad > 0
                    );
                    
                    if (validLocalCart.length > 0) {
                        console.log('🛒 Encontrados', validLocalCart.length, 'items en localStorage');
                        
                        //Sincronizar sin duplicar productos
                        await syncCartWithServer(validLocalCart);
                    }
                } catch (parseError) {
                    console.error('Error parsing local cart:', parseError);
                }
            }

            //Cargar desde API (después de sincronizar)
            const response = await carritoService.getCarrito(userId);
            const cartData = response.data;
            
            console.log('📦 Cart data from API:', JSON.stringify(cartData, null, 2));

            //Limpiar localStorage una vez la sincronizacion este lista
            localStorage.removeItem('carrito');
            console.log('🗑️ localStorage limpiado');
            
            //Mapear datos de la API
            const items = cartData.map((item: any) => ({
                ...item.producto,
                titulo: item.producto?.nombre || item.producto?.titulo,
                cantidad: item.cantidad || 1
            }));
            
            console.log('✅ Items finales:', items);
            setCartItems(items);
            
        } catch (error) {
            console.error('❌ Error loading cart from API:', error);
            setError('Error al cargar el carrito');
            
            // Respaldo: usar localStorage
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

    


    //CODIGO ANTIGUO EL DE ABAJO

    const addToCart = async (product: Producto) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🛒 [addToCart] INICIO');
        console.log('🛒 [addToCart] Producto recibido:', product);
        /*console.log('🛒 [addToCart] ID:', product?.id, 'Tipo:', typeof product?.id);
        console.log('🛒 [addToCart] Precio:', product?.precio, 'Tipo:', typeof product?.precio);
        console.log('🛒 [addToCart] Titulo:', product?.titulo);
        console.log('🛒 [addToCart] Propiedades del producto:', Object.keys(product));
        console.log('🛒 [addToCart] Usuario logueado:', isLoggedIn);
        console.log('🛒 [addToCart] User ID:', currentUser?.id);*/
        
        try {
            setError(null);
            
            if (!isLoggedIn || !currentUser?.id) {
                console.log('💾 [addToCart] Usuario NO autenticado - usando localStorage');
                
                setCartItems(prevItems => {
                    console.log('📦 [addToCart] Items previos:', prevItems);
                    
                    const existingItem = prevItems.find(item => item.id === product.id);
                    
                    if (existingItem) {
                        console.log('➕ [addToCart] Producto YA existe, incrementando cantidad');
                        const updated = prevItems.map(item =>
                            item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                        );
                        console.log('📦 [addToCart] Items actualizados:', updated);
                        return updated;
                    } else {
                        console.log('🆕 [addToCart] Producto NUEVO, agregando...');
                        const newItem = { ...product, cantidad: 1 };
                        console.log('🆕 [addToCart] Nuevo item creado:', newItem);
                        console.log('🆕 [addToCart] ID del nuevo item:', newItem.id);
                        console.log('🆕 [addToCart] Precio del nuevo item:', newItem.precio);
                        console.log('🆕 [addToCart] Propiedades del nuevo item:', Object.keys(newItem));
                        
                        const updated = [...prevItems, newItem];
                        console.log('📦 [addToCart] Array final de items:', updated);
                        return updated;
                    }
                });
            } else {
                console.log('📡 [addToCart] Usuario autenticado - usando API');
                
                const userId = currentUser.id;
                const productId = Number(product.id);
                
                console.log('📡 [addToCart] userId:', userId, 'productId:', productId);
                
                if (!userId || isNaN(productId) || userId <= 0 || productId <= 0) {
                    console.error('❌ [addToCart] IDs inválidos:', { userId, productId });
                    throw new Error(`IDs inválidos: userId=${userId}, productId=${product.id}`);
                }
                
                console.log('📡 [addToCart] Llamando a carritoService.add...');
                await carritoService.add(userId, productId);
                console.log('📡 [addToCart] Producto agregado a la API, recargando carrito...');
                await loadCart();
            }
            
            console.log('✅ [addToCart] Producto agregado exitosamente');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            alert(`Producto agregado al carrito`);
        } catch (error) {
            console.error('❌ [addToCart] Error:', error);
            setError('Error al agregar al carrito');
            
            if (isLoggedIn) {
                console.log('⚠️ [addToCart] Usando respaldo localStorage por error en API');
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
            //MANTENER LOADING DE MOMENTO
            setLoading(true);
            
            if (!productId) {
                throw new Error('ID de producto inválido');
            }
            
            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            } else {
                const userId = currentUser.id;
                const numericProductId = Number(productId);
                
                if (!userId || isNaN(numericProductId) || userId <= 0 || numericProductId <= 0) {
                    throw new Error(`IDs inválidos: userId=${userId}, productId=${productId}`);
                }
                
                // ✅ Log para debug
                console.log('🗑️ RemoveFromCart:', {
                    userId,
                    productId: numericProductId
                });

                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

                // Usar API
                const response = await carritoService.remove(userId, numericProductId);
                //await loadCart(); 
                console.log('✅ Respuesta remove:', response.data);
                //NUEVO LO DE ABAJO
                // ✅ SEGUNDO: Actualizar UI después de éxito en API
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al eliminar del carrito: ${errorMessage}`);
            
            if (isLoggedIn && currentUser?.id) {
                await loadCart();
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: number, newQuantity: number) => {
        try {
            setError(null);
            //MANTENER LOADING DE MOMENTO
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
                const userId = currentUser.id;
                const numericProductId = Number(productId);
                
                if (!userId || isNaN(numericProductId) || userId <= 0 || numericProductId <= 0) {
                    throw new Error(`IDs inválidos: userId=${userId}, productId=${productId}`);
                }
                
                // Usar API - encontrar cantidad actual y ajustar
                const currentItem = cartItems.find(item => item.id === productId);
                if (!currentItem) {
                    throw new Error('Producto no encontrado en el carrito');
                }
                
                // ✅ Log para debug
                console.log('🔄 UpdateQuantity:', {
                    userId,
                    productId: numericProductId,
                    oldQuantity: currentItem.cantidad,
                    newQuantity,
                    difference: newQuantity - currentItem.cantidad
                });
                //Actualizar UI
                setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, cantidad: newQuantity } : item
                ));

                //Sincronizar con API
                const difference = newQuantity - currentItem.cantidad;
                if (difference !== 0) {
                    if (difference > 0) {
                        // Incrementar cantidad
                        for (let i = 0; i < difference; i++) {
                            const response =await carritoService.increase(userId, numericProductId);
                            console.log('✅ Respuesta increase:', response.data);
                        }
                    } else {
                        // Decrementar cantidad
                        for (let i = 0; i < Math.abs(difference); i++) {
                            /*BORRAR RESPONSE*/const response = await carritoService.decrease(userId, numericProductId);
                            console.log('✅ Respuesta decrease:', response.data);
                        }
                    }
                    // ✅ SEGUNDO: Actualizar UI después de éxito en API
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.id === productId ? { ...item, cantidad: newQuantity } : item
                        )
                    );
                    //CODIGO ELIMINAR EVITAR BUCLE -> await loadCart(); // Reload cart to get updated data
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al actualizar cantidad: ${errorMessage}`);
            
            if (isLoggedIn && currentUser?.id) {
                await loadCart();
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
            //MANTENER LOADING DE MOMENTO
            setLoading(true);
            
            if (!isLoggedIn || !currentUser?.id) {
                // Usar respaldo de localStorage
                setCartItems([]);
            } else {
                const userId = currentUser.id;
                
                if (!userId || userId <= 0) {
                    throw new Error(`ID de usuario inválido: ${userId}`);
                }
                
                // Use API
                // ✅ Log para debug
                console.log('🧹 ClearCart:', { userId });
                
                
                // ✅ SEGUNDO: Sincronizar con API (sin loadCart)
                const response = await carritoService.vaciar(userId);
                console.log('✅ Respuesta vaciar:', response.data);
                //await loadCart();
                // ✅ PRIMERO: Actualizar UI inmediatamente
                setCartItems([]);
                localStorage.removeItem('carrito'); 
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al vaciar el carrito: ${errorMessage}`);
            
            //Recargar desde API en caso de error
            if (isLoggedIn && currentUser?.id) {
                await loadCart();
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
