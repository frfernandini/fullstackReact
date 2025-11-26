import axios from "axios";

// Configuración de Axios Api Client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // URL de Beanstalk o Local
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    const token = localStorage.getItem("token");

    // para NO enviar el token en login/register
    if (token && !config.url?.includes("/api/auth/login") && !config.url?.includes("/api/auth/register")) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejar 401 (ej: logout o intentar refresh)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // aquí puedes implementar refresh token antes de forzar logout
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // redirigir a login para que el usuario re-autentique
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;