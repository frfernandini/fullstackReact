import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../components/User.ts';
import { authService } from '../api/authService';

interface UserContextType {
    users: User[];
    currentUser: User | null;
    addUser: (user: Omit<User, 'fechaRegistro'>) => Promise<{ success: boolean; message: string }>;
    removeUser: (email: string) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: string }>;
    logout: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthStatus = () => {
            const isLoggedIn = authService.isLogged();
            if (isLoggedIn) {
            
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const parts = token.split('.');
                        if (parts.length !== 3) {
                            throw new Error('Token JWT inválido');
                        }
                        
                        const payload = JSON.parse(atob(parts[1]));
                        
                        // Validar que tengamos un ID válido
                        const userId = payload.sub || payload.userId || payload.id;
                        if (!userId) {
                            throw new Error('No se encontró ID de usuario en el token');
                        }
                        
                        setCurrentUser({
                            id: userId,
                            nombre: payload.nombre || 'Usuario',
                            apellido: payload.apellido || '',
                            email: payload.email || '',
                            telefono: payload.telefono || '',
                            direccion: payload.direccion || '',
                            ciudad: payload.ciudad || '',
                            password: '', 
                            fechaRegistro: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
                        });
                    } catch (error) {
                        console.error('Error parsing token:', error);
                        // Si el token es inválido, hacer logout
                        authService.logout();
                        setCurrentUser(null);
                    }
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const addUser = async (user: Omit<User, 'fechaRegistro'>): Promise<{ success: boolean; message: string }> => {
        try {
            await authService.register(user);
            return { success: true, message: 'Usuario registrado con éxito.' };
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al registrar usuario';
            return { success: false, message };
        }
    };

    const removeUser = (email: string) => {
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string; role?: string }> => {
        try {
            const result = await authService.login(email, password);
            
            // Update current user after successful login
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) {
                        throw new Error('Token JWT inválido');
                    }
                    
                    const payload = JSON.parse(atob(parts[1]));
                    
                    // Validar que tengamos un ID válido
                    const userId = payload.sub || payload.userId || payload.id;
                    if (!userId) {
                        throw new Error('No se encontró ID de usuario en el token');
                    }
                    
                    setCurrentUser({
                        id: userId,
                        nombre: payload.nombre || 'Usuario',
                        apellido: payload.apellido || '',
                        email: payload.email || email,
                        telefono: payload.telefono || '',
                        direccion: payload.direccion || '',
                        ciudad: payload.ciudad || '',
                        password: '',
                        fechaRegistro: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
                    });
                } catch (error) {
                    console.error('Error parsing token:', error);
                    // Si hay error con el token, hacer logout
                    authService.logout();
                    return { success: false, message: 'Error en el token de autenticación' };
                }
            }
            
            return { success: true, message: 'Inicio de sesión exitoso', role: result.role };
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al iniciar sesión';
            return { success: false, message };
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const isLoggedIn = authService.isLogged();
    const isAdmin = authService.isAdmin();

    return (
        <UserContext.Provider value={{ 
            users, 
            currentUser,
            addUser, 
            removeUser,
            login,
            logout,
            isLoggedIn,
            isAdmin,
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};
