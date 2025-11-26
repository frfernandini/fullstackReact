import apiClient from "./apiClient";

type Id = string | number;
type AnyData = any;

export const contactoService = {
  getAll: () => apiClient.get<AnyData>("/api/contacto"),
  getNoLeidos: () => apiClient.get<AnyData>("/api/contacto/no-leidos"),
  getById: (id: Id) => apiClient.get<AnyData>(`/api/contacto/${id}`),
  create: (data: AnyData) => apiClient.post<AnyData>("/api/contacto", data),
  marcarLeido: (id: Id) => apiClient.patch<AnyData>(`/api/contacto/${id}/leido`)
};