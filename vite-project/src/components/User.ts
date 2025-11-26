// src/components/User.ts
export interface User {
    id?: number;
    nombre: string;
    apellido?: string;
    email: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    password?: string; // Password might be optional depending on where it's used
    fechaRegistro: string;
}
