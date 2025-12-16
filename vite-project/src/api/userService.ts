import apiClient from "./apiClient";

type AnyData = any;

export const userService = {
    getAll: () => apiClient.get<AnyData>("/api/usuarios"),
    delete: (email: string) => apiClient.delete<AnyData>(`/api/usuario/${email}`) 
}