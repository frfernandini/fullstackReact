import apiClient from "./apiClient";

// Servicio de autenticación
function decodeToken(token: string) {
    try {
        const payload = token.split(".")[1] || "";
        // JWT usa codificación base64url - convertir a base64 estándar
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        // Añadir relleno correcto
        const padLength = (4 - (base64.length % 4)) % 4;
        const padded = base64 + '='.repeat(padLength);
        const decodedJson = typeof atob === 'function'
            ? atob(padded)
            : (globalThis as any).Buffer.from(padded, 'base64').toString('utf-8');
        return JSON.parse(decodedJson);
    } catch (e) {
        console.error('Error al decodificar Token', e);
        return null;
    }
}

export const authService = {
    login: async (email: string, password: string): Promise<{ token: string; role: string }> => {

        // Limpiar token viejo
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        const res = await apiClient.post("/api/auth/login", { email, password });
        console.log("Login response:", res.data);
        const token = res.data.token || res.data.accessToken || null;
        if (!token) throw new Error("No se recibió token");

        localStorage.setItem("token", token);

        const decode = decodeToken(token);
        // Puede venir roles como array o string; se adaptara
        const roles = decode?.roles || decode?.authorities || [];
        let role: any = Array.isArray(roles) ? (roles[0] || "USER") : roles || "USER";

        // Normalizar si el rol viene como objeto (ej: { authority: 'ROLE_ADMIN' })
        if (role && typeof role === 'object') {
            role = role.authority || role.role || JSON.stringify(role);
        }

        let roleStr = String(role || 'USER');
        // Guardar en mayúsculas para comparaciones fáciles, conservar prefijo ROLE_ si existe
        roleStr = roleStr.toUpperCase();

        localStorage.setItem("role", roleStr);
        return { token, role: roleStr };
    },

    register: async (payload: any): Promise<any> => {
        return apiClient.post("/api/auth/register", payload);
    },

    logout: (): void => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    },

    isAdmin: (): boolean => {
            // Comprobar token decodificado si existe, respaldo a rol en localStorage
            const token = localStorage.getItem("token");
            if (token) {
                const decode = decodeToken(token);
                const roles = decode?.roles || decode?.authorities || [];
                const first = Array.isArray(roles) ? roles[0] : roles;
                const roleStr = String(first || localStorage.getItem("role") || "").toUpperCase();
                return roleStr.includes("ADMIN");
            }
            const r = localStorage.getItem("role") || "";
            return String(r).toUpperCase().includes("ADMIN");
    },

    isLogged: (): boolean => {
        const token = localStorage.getItem("token");
        if (!token) return false;
        const decoded = decodeToken(token);
        if (!decoded) return true; // sin claim exp, asumimos válido
        const exp = decoded.exp;
        if (typeof exp === 'number') {
            const now = Math.floor(Date.now() / 1000);
            if (exp < now) {
                // token expirado - limpiar
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                return false;
            }
        }
        return true;
    },
};