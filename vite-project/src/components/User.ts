// src/components/User.ts
export interface User {
    id?: number;
    nombre: string;
    apellido?: string;
    email: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    password?: string; // Añadido campo password
    fechaRegistro: string;
}
