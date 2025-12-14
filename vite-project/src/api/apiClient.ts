import axios from "axios";

// Configuración de Axios Api Client
const baseURL = import.meta.env.VITE_BACKEND_URL;

// Log the configuration for debugging
console.log('🔧 API Client Configuration:', {
  baseURL,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV
});

if (!baseURL) {
  console.error('❌ VITE_BACKEND_URL is not defined! Please check your .env file.');
}

const apiClient = axios.create({
  baseURL, // URL de Beanstalk o Local
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    const token = localStorage.getItem("token");

    // para NO enviar el token en login/register
    if (token && !config.url?.includes("/api/auth/login") && !config.url?.includes("/api/auth/registro")) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejar 401 (ej: logout o intentar refresh)
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    const method = error?.config?.method?.toUpperCase();
    
    // Enhanced error logging
    console.error(`❌ API Error: ${method} ${url}`, {
      status,
      message: error.message,
      response: error.response?.data,
      baseURL: error.config?.baseURL
    });
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('🚫 Backend server is not running or unreachable!');
    } else if (status === 404) {
      console.error('🔍 API endpoint not found - check backend routes');
    } else if (status === 401) {
      console.warn('🔐 Authentication failed - redirecting to login');
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