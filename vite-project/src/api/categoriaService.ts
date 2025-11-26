import apiClient from "./apiClient";

type Id = string | number;
type AnyData = any;

export const categoriaService = {
  getAll: () => apiClient.get<AnyData>("/api/categorias"),
  getById: (id: Id) => apiClient.get<AnyData>(`/api/categorias/${id}`),
  create: (data: AnyData) => apiClient.post<AnyData>("/api/categorias", data),
  update: (id: Id, data: AnyData) => apiClient.put<AnyData>(`/api/categorias/${id}`, data),
  delete: (id: Id) => apiClient.delete<AnyData>(`/api/categorias/${id}`)
};