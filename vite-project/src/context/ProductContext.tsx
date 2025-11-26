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
            const productosData = response.data;
            
            // Convert array to Record<number, Producto>
            const productsMap: Record<number, Producto> = {};
            if (Array.isArray(productosData)) {
                productosData.forEach((product: Producto) => {
                    productsMap[product.id] = product;
                });
            } else {
                console.warn('Expected array but got:', typeof productosData);
            }
            
            console.log(`Products loaded: ${Object.keys(productsMap).length}`);
            setProducts(productsMap);
        } catch (error) {
            console.error("❌ Error loading products from API", error);
            setError("Error al cargar los productos");
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
            const featuredData = response.data;
            
            if (Array.isArray(featuredData)) {
                setFeaturedProducts(featuredData);
                console.log(`products loaded: ${featuredData.length}`);
            } else {
                console.warn('Expected array for featured products but got:', typeof featuredData);
                // Fallback: usar productos con oferta de todos los productos
                const allProducts = Object.values(products);
                const productsWithOffer = allProducts.filter(p => p.oferta && (p.descuento ?? 0) > 0);
                setFeaturedProducts(productsWithOffer.slice(0, 4));
            }
        } catch (error) {
            console.error('Error loading featured products from API', error);
            setFeaturedError('Error al cargar productos destacados');
            
            // Fallback: usar productos con oferta de todos los productos
            const allProducts = Object.values(products);
            const productsWithOffer = allProducts.filter(p => p.oferta && (p.descuento ?? 0) > 0);
            setFeaturedProducts(productsWithOffer.slice(0, 4));
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
