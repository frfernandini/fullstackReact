import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../components/Producto';
import { productos as ProductosData } from '../components/ProductoData';

interface ProductContextType {
    products: Record<string, Producto>;
    addProduct: (product: Producto) => void;
    removeProduct: (productId: string) => void;
    clearProducts: () => void;
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
    const [products, setProducts] = useState<Record<string, Producto>>(() => {
        try {
            const storedProducts = localStorage.getItem('productos');
            if (storedProducts) {
                return JSON.parse(storedProducts);
            }
        } catch (error) {
            console.error("Error parsing products from localStorage", error);
        }
        // If nothing in localStorage or it's invalid, initialize with default data
        const initialProducts: Record<string, Producto> = {};
        ProductosData.forEach(p => {
            initialProducts[p.id] = p;
        });
        return initialProducts;
    });

    useEffect(() => {
        try {
            localStorage.setItem('productos', JSON.stringify(products));
        } catch (error) {
            console.error("Error saving products to localStorage", error);
        }
    }, [products]);

    const addProduct = (product: Producto) => {
        setProducts(prevProducts => ({
            ...prevProducts,
            [product.id]: product
        }));
    };

    const removeProduct = (productId: string) => {
        setProducts(prevProducts => {
            const newProducts = { ...prevProducts };
            delete newProducts[productId];
            return newProducts;
        });
    };

    const clearProducts = () => {
        setProducts({});
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, removeProduct, clearProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
