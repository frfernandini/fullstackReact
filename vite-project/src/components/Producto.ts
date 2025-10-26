export interface Producto {
    id: string;
    titulo: string;
    precio: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    oferta: boolean;
    descuento?: number;
}