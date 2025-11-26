export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    activo: boolean;
}

export interface Producto {
    id: number;
    titulo: string;
    precio: number;
    descripcion: string;
    categoria: Categoria;   // ← aquí cambia
    imagen: string;
    oferta: boolean;
    descuento?: number;
}