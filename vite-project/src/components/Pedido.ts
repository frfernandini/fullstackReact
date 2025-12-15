import type { Producto } from './Producto';
import type { User } from './User';

export const EstadoPedido = {
  PENDIENTE: 'PENDIENTE',
  PROCESANDO: 'PROCESANDO',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO'
} as const;

export type EstadoPedido = typeof EstadoPedido[keyof typeof EstadoPedido];

export interface ItemCarrito {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoRequest {
  usuarioId: number;
  direccionEnvio: string;
  notas: string;
  items: ItemCarrito[];
}

export interface DetallePedido {
  id: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  usuario: User;
  total: number;
  estado: EstadoPedido;
  direccionEnvio: string;
  notas: string;
  detalles: DetallePedido[];
  fechaCreacion: string;
  fechaActualizacion: string;
}