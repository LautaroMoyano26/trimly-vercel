import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSection?: string;
  requiredPermission?: string;
  fallback?: string; // Ruta de redirección si no tiene permisos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredSection,
  requiredPermission,
  fallback = '/dashboard'
}) => {
  const { isAuthenticated, canAccess, hasPermission } = usePermissions();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar acceso a sección específica
  if (requiredSection && !canAccess(requiredSection)) {
    return <Navigate to={fallback} replace />;
  }

  // Verificar permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallback} replace />;
  }

  // Si todas las verificaciones pasan, renderizar el componente
  return <>{children}</>;
};

export default ProtectedRoute;