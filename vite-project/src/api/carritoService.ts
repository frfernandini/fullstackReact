import apiClient from "./apiClient";

type Id = string | number;
type AnyData = any;

export const carritoService = {
  getCarrito: (usuarioId: Id) =>
    apiClient.get<AnyData>(`/api/carrito/${usuarioId}`),

  add: (usuarioId: Id, productoId: Id) =>
    apiClient.post<AnyData>(`/api/carrito/${usuarioId}/${productoId}`),

  remove: (usuarioId: Id, productoId: Id) =>
    apiClient.delete<AnyData>(`/api/carrito/${usuarioId}/${productoId}`),

  vaciar: (usuarioId: Id) =>
    apiClient.delete<AnyData>(`/api/carritovacio/${usuarioId}`),

  increase: (usuarioId: Id, productoId: Id) =>
    apiClient.post<AnyData>(`/api/carrito/increase/${usuarioId}/${productoId}`),

  decrease: (usuarioId: Id, productoId: Id) =>
    apiClient.post<AnyData>(`/api/carrito/decrease/${usuarioId}/${productoId}`)
};