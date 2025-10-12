import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface ConditionalRenderProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  empleadoOnly?: boolean;
  requiredSection?: string;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

// Componente para renderizar condicionalmente según permisos
const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  adminOnly = false,
  empleadoOnly = false,
  requiredSection,
  requiredPermission,
  fallback = null
}) => {
  const { isAdmin, isEmpleado, canAccess, hasPermission } = usePermissions();

  // Verificar rol específico
  if (adminOnly && !isAdmin) {
    return <>{fallback}</>;
  }

  if (empleadoOnly && !isEmpleado) {
    return <>{fallback}</>;
  }

  // Verificar acceso a sección
  if (requiredSection && !canAccess(requiredSection)) {
    return <>{fallback}</>;
  }

  // Verificar permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Si todas las verificaciones pasan, renderizar el contenido
  return <>{children}</>;
};

export default ConditionalRender;