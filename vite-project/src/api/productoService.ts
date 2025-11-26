import apiClient from "./apiClient";

type Id = string | number;
type AnyData = any;

export const productoService = {
  getAll: () => apiClient.get<AnyData>("/api/productos"),
  getDestacados: () => apiClient.get<AnyData>("/api/productos/destacados"),
  getById: (id: Id) => apiClient.get<AnyData>(`/api/productos/${id}`),
  getByCategoria: (categoriaId: Id) =>
    apiClient.get<AnyData>(`/api/productos/categoria/${categoriaId}`),

  search: (keyword: string) =>
    apiClient.get<AnyData>(`/api/productos/buscar`, {
      params: { keyword }
    }),

  create: (data: AnyData) => apiClient.post<AnyData>("/api/productos", data),
  update: (id: Id, data: AnyData) => apiClient.put<AnyData>(`/api/productos/${id}`, data),
  delete: (id: Id) => apiClient.delete<AnyData>(`/api/productos/${id}`)
};