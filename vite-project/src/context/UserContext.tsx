import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../components/User.ts';

interface UserContextType {
    users: User[];
    addUser: (user: Omit<User, 'fechaRegistro'>) => { success: boolean; message: string };
    removeUser: (email: string) => void;
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
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const storedUsers = localStorage.getItem('users');
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save users to localStorage", error);
        }
    }, [users]);

    const addUser = (user: Omit<User, 'fechaRegistro'>): { success: boolean; message: string } => {
        if (users.some(u => u.email === user.email)) {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }
        const newUser: User = {
            ...user,
            fechaRegistro: new Date().toISOString(),
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        return { success: true, message: 'Usuario registrado con éxito.' };
    };

    const removeUser = (email: string) => {
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
    };

    return (
        <UserContext.Provider value={{ users, addUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};
