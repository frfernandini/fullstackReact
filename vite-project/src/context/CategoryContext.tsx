import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Categoria } from '../components/Producto';
import { categoriaService } from '../api/categoriaService';

interface CategoryContextType {
    categories: Categoria[];
    loadCategories: () => Promise<void>;
    addCategory: (category: Omit<Categoria, 'id'>) => Promise<void>;
    updateCategory: (id: number, category: Partial<Categoria>) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await categoriaService.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading categories from API", error);
            setError("Error al cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const addCategory = async (category: Omit<Categoria, 'id'>) => {
        try {
            const response = await categoriaService.create(category);
            const newCategory = response.data;
            setCategories(prevCategories => [...prevCategories, newCategory]);
        } catch (error) {
            console.error("Error adding category", error);
            throw error;
        }
    };

    const updateCategory = async (id: number, category: Partial<Categoria>) => {
        try {
            const response = await categoriaService.update(id, category);
            const updatedCategory = response.data;
            setCategories(prevCategories =>
                prevCategories.map(cat => cat.id === id ? updatedCategory : cat)
            );
        } catch (error) {
            console.error("Error updating category", error);
            throw error;
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await categoriaService.delete(id);
            setCategories(prevCategories =>
                prevCategories.filter(cat => cat.id !== id)
            );
        } catch (error) {
            console.error("Error deleting category", error);
            throw error;
        }
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            loadCategories,
            addCategory,
            updateCategory,
            deleteCategory,
            loading,
            error
        }}>
            {children}
        </CategoryContext.Provider>
    );
};