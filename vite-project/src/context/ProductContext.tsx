import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../components/Producto';
import { productoService } from '../api/productoService';

interface ProductContextType {
    products: Record<number, Producto>;
    featuredProducts: Producto[];
    addProduct: (product: Producto) => void;
    removeProduct: (productId: number) => void;
    clearProducts: () => void;
    loadProducts: () => Promise<void>;
    loadFeaturedProducts: () => Promise<void>;
    loading: boolean;
    featuredLoading: boolean;
    error: string | null;
    featuredError: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Record<number, Producto>>({});
    const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [featuredLoading, setFeaturedLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [featuredError, setFeaturedError] = useState<string | null>(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productoService.getAll();
            
            // Handle different response formats
            let productosData = response.data;
            
            // If the response is a string, try to parse it as JSON
            if (typeof productosData === 'string') {
                try {
                    productosData = JSON.parse(productosData);
                    console.log('Parsed string response to JSON');
                } catch (parseError) {
                    console.error('Failed to parse string response as JSON:', parseError);
                    throw new Error('Invalid response format from server');
                }
            }
            
            // Convert array to Record<number, Producto>
            const productsMap: Record<number, Producto> = {};
            if (Array.isArray(productosData)) {
                productosData.forEach((product: Producto) => {
                    if (product && typeof product === 'object' && product.id) {
                        productsMap[product.id] = product;
                    }
                });
                console.log(`✅ Products loaded successfully: ${Object.keys(productsMap).length}`);
            } else if (productosData && typeof productosData === 'object' && productosData.productos) {
                // Handle wrapped response format
                const productos = productosData.productos;
                if (Array.isArray(productos)) {
                    productos.forEach((product: Producto) => {
                        if (product && typeof product === 'object' && product.id) {
                            productsMap[product.id] = product;
                        }
                    });
                    console.log(`✅ Products loaded from wrapped response: ${Object.keys(productsMap).length}`);
                }
            } else {
                console.warn('❌ Expected array but got:', typeof productosData, productosData);
                throw new Error(`Invalid response format. Expected array, got ${typeof productosData}`);
            }
            
            setProducts(productsMap);
        } catch (error) {
            console.error("❌ Error loading products from API", error);
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar los productos";
            setError(errorMessage);
            
            // Set empty products on error
            setProducts({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const addProduct = async (product: Producto) => {
        try {
            const response = await productoService.create(product);
            const newProduct = response.data;
            setProducts(prevProducts => ({
                ...prevProducts,
                [newProduct.id]: newProduct
            }));
        } catch (error) {
            console.error("Error adding product", error);
            throw error;
        }
    };

    const removeProduct = async (productId: number) => {
        try {
            await productoService.delete(productId);
            setProducts(prevProducts => {
                const newProducts = { ...prevProducts };
                delete newProducts[productId];
                return newProducts;
            });
        } catch (error) {
            console.error("Error removing product", error);
            throw error;
        }
    };

    const clearProducts = () => {
        setProducts({});
    };
    
    const loadFeaturedProducts = async () => {
        try {
            setFeaturedLoading(true);
            setFeaturedError(null);
            const response = await productoService.getDestacados();
            let featuredData = response.data;
            
            // Handle string responses that need parsing
            if (typeof featuredData === 'string') {
                try {
                    featuredData = JSON.parse(featuredData);
                } catch (parseError) {
                    console.error('Failed to parse featured products string response:', parseError);
                    throw new Error('Invalid featured products response format');
                }
            }
            
            if (Array.isArray(featuredData)) {
                setFeaturedProducts(featuredData);
                console.log(`✅ Featured products loaded: ${featuredData.length}`);
            } else if (featuredData && typeof featuredData === 'object' && featuredData.productos) {
                // Handle wrapped response
                const productos = featuredData.productos;
                if (Array.isArray(productos)) {
                    setFeaturedProducts(productos);
                    console.log(`✅ Featured products loaded from wrapped response: ${productos.length}`);
                } else {
                    throw new Error('Invalid wrapped featured products format');
                }
            } else {
                console.warn('❌ Expected array for featured products but got:', typeof featuredData);
                throw new Error(`Invalid featured products format. Expected array, got ${typeof featuredData}`);
            }
        } catch (error) {
            console.error('❌ Error loading featured products from API', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar productos destacados';
            setFeaturedError(errorMessage);
            
            // Fallback: usar productos con oferta de todos los productos
            const allProducts = Object.values(products);
            const productsWithOffer = allProducts.filter(p => p.oferta && (p.descuento ?? 0) > 0);
            setFeaturedProducts(productsWithOffer.slice(0, 4));
            console.log(`📋 Using fallback featured products: ${productsWithOffer.length} products with offers`);
        } finally {
            setFeaturedLoading(false);
        }
    };

    return (
        <ProductContext.Provider value={{ 
            products,
            featuredProducts,
            addProduct, 
            removeProduct, 
            clearProducts, 
            loadProducts,
            loadFeaturedProducts,
            loading,
            featuredLoading,
            error,
            featuredError
        }}>
            {children}
        </ProductContext.Provider>
    );
};
