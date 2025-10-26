// src/components/User.ts
export interface User {
    nombre: string;
    email: string;
    password?: string; // Password might be optional depending on where it's used
    fechaRegistro: string;
}
