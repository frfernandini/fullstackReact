// Componente de rutas protegidas

import { Navigate, Outlet } from "react-router-dom";
import { useUsers } from "../context/UserContext";

interface ProtectedRouteProps {
  adminOnly?: boolean; // si es true, solo permite administradores
}

const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin, loading } = useUsers();

  // Mostrar loading mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Si no está logueado → redirige al login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Si es solo admin y el usuario no es admin → redirige al home
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
