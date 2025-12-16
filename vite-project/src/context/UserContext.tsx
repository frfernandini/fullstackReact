import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../components/User.ts';
import { authService } from '../api/authService';
import { userService } from '../api/userService';

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

    // Cargar usuarios desde el backend
    const loadUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data || []);
        } catch (e) {
            setUsers([]);
        }
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            const isLoggedIn = authService.isLogged();
            if (isLoggedIn) {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const parts = token.split('.');
                        if (parts.length !== 3) throw new Error('Token JWT inválido');
                        const payload = JSON.parse(atob(parts[1]));
                        let userId = payload.sub;
                        let finalUserId: number;
                        if (typeof userId === 'string' && userId.includes('@')) {
                            finalUserId = Math.abs(userId.split('').reduce((a, b) => {
                                a = ((a << 5) - a) + b.charCodeAt(0);
                                return a & a;
                            }, 0));
                        } else {
                            finalUserId = Number(userId);
                            if (isNaN(finalUserId)) {
                                finalUserId = Math.abs(userId.toString().split('').reduce((a: number, b: string) => {
                                    a = ((a << 5) - a) + b.charCodeAt(0);
                                    return a & a;
                                }, 0));
                            }
                        }
                        setCurrentUser({
                            id: finalUserId,
                            nombre: payload.nombre || 'Usuario',
                            apellido: payload.apellido || '',
                            email: payload.email || userId.toString(),
                            telefono: payload.telefono || '',
                            direccion: payload.direccion || '',
                            ciudad: payload.ciudad || '',
                            password: '',
                            fechaCreacion: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
                        });
                    } catch (error) {
                        authService.logout();
                        setCurrentUser(null);
                    }
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
        loadUsers();
    }, []);

    const addUser = async (user: Omit<User, 'fechaRegistro'>): Promise<{ success: boolean; message: string }> => {
        try {
            await authService.register(user);
            await loadUsers();
            return { success: true, message: 'Usuario registrado con éxito.' };
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al registrar usuario';
            return { success: false, message };
        }
    };

    const removeUser = (email: string) => {
        (async () => {
            try {
                await userService.delete(email);
                await loadUsers();
            } catch (e) {
                // Manejo de error opcional
            }
        })();
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string; role?: string }> => {
        try {
            const result = await authService.login(email, password);
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Token JWT inválido');
                    const payload = JSON.parse(atob(parts[1]));
                    let userId = payload.sub;
                    let finalUserId: number;
                    if (typeof userId === 'string' && userId.includes('@')) {
                        finalUserId = Math.abs(userId.split('').reduce((a: number, b: string) => {
                            a = ((a << 5) - a) + b.charCodeAt(0);
                            return a & a;
                        }, 0));
                    } else {
                        finalUserId = Number(userId);
                        if (isNaN(finalUserId)) {
                            finalUserId = Math.abs(userId.toString().split('').reduce((a: number, b: string) => {
                                a = ((a << 5) - a) + b.charCodeAt(0);
                                return a & a;
                            }, 0));
                        }
                    }
                    setCurrentUser({
                        id: finalUserId,
                        nombre: payload.nombre || 'Usuario',
                        apellido: payload.apellido || '',
                        email: payload.email || email,
                        telefono: payload.telefono || '',
                        direccion: payload.direccion || '',
                        ciudad: payload.ciudad || '',
                        password: '',
                        fechaCreacion: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
                    });
                } catch (error) {
                    authService.logout();
                    return { success: false, message: 'Error en el token de autenticación' };
                }
            }
            await loadUsers();
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
