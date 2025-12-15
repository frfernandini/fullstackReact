import apiClient from './apiClient';
import type { Pedido, PedidoRequest, EstadoPedido } from '../components/Pedido';

export const pedidoService = {

    //Obtener todos los pedidos 
    getAllPedidos: async (): Promise<Pedido[]> => {
        const response = await apiClient.get<Pedido[]>('/api/pedidos');
        return response.data;
    },
        //Obtener pedido por ID
    getPedidoById: async (id: number): Promise<Pedido> => {
        const response = await apiClient.get<Pedido>(`/api/pedidos/${id}`);
        return response.data;
    },
        //Obtener pedidos de un usuario
    getPedidosByUsuario: async (usuarioId: number): Promise<Pedido[]> => {
        const response = await apiClient.get<Pedido[]>(`/api/pedidos/usuario/${usuarioId}`);
        return response.data;
    },
        //Crear nuevo pedido desde el carrito
    createPedido: async (pedidoRequest: PedidoRequest): Promise<Pedido> => {
        const response = await apiClient.post<Pedido>('/api/pedidos', pedidoRequest);
        return response.data;
    },
        //Actualizar estado del pedido (Admin)
    updateEstadoPedido: async (id: number, estado: EstadoPedido): Promise<Pedido> => {
        const response = await apiClient.patch<Pedido>(
        `/api/pedidos/${id}/estado`,
        null,
        { params: { estado } }
        );
        return response.data;
    }
};