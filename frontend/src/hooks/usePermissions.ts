import { useState, useEffect } from 'react';
import authService from '../services/authService';
import type { User } from '../services/authService';

interface UsePermissionsReturn {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmpleado: boolean;
  canAccess: (section: string) => boolean;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
}

// Hook personalizado para manejar permisos de usuario
export const usePermissions = (): UsePermissionsReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticación al montar el componente
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();
        
        setUser(currentUser);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.log('Error verificando autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listener para cambios en localStorage (para logout en otras pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'trimly_user' || e.key === 'trimly_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const canAccess = (section: string): boolean => {
    try {
      return authService.canAccessSection(section);
    } catch {
      return false; // Si no está autenticado, no puede acceder
    }
  };

  const hasPermission = (permission: string): boolean => {
    try {
      return authService.hasPermission(permission);
    } catch {
      return false; // Si no está autenticado, no tiene permisos
    }
  };

  const logout = (): void => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error en logout:', error);
      // Forzar limpieza manual
      localStorage.removeItem('trimly_token');
      localStorage.removeItem('trimly_user');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin: isAuthenticated ? authService.isAdmin() : false,
    isEmpleado: isAuthenticated ? authService.isEmpleado() : false,
    canAccess,
    hasPermission,
    logout,
  };
};

// Hook para proteger componentes que requieren autenticación
export const useAuthGuard = () => {
  const { isAuthenticated, user } = usePermissions();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  return { isAuthenticated, user };
};

// Hook para proteger componentes que requieren permisos específicos
export const usePermissionGuard = (requiredPermission: string) => {
  const { hasPermission, isAuthenticated } = usePermissions();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!hasPermission(requiredPermission)) {
      setCanRender(false);
      // Opcionalmente redirigir o mostrar mensaje de error
      console.warn(`Acceso denegado: se requiere permiso ${requiredPermission}`);
    } else {
      setCanRender(true);
    }
  }, [isAuthenticated, requiredPermission, hasPermission]);

  return { canRender, hasPermission };
};

export default usePermissions;