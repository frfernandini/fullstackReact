import apiClient from "./apiClient";

type Id = string | number;
type AnyData = any;

export const blogService = {
  getPublished: () => apiClient.get<AnyData>("/api/blogs"),
  getAll: () => apiClient.get<AnyData>("/api/blogs/all"),
  getById: (id: Id) => apiClient.get<AnyData>(`/api/blogs/${id}`),
  create: (data: AnyData) => apiClient.post<AnyData>("/api/blogs", data),
  update: (id: Id, data: AnyData) => apiClient.put<AnyData>(`/api/blogs/${id}`, data),
  delete: (id: Id) => apiClient.delete<AnyData>(`/api/blogs/${id}`)
};