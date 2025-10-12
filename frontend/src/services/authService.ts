// Servicio de autenticación y gestión de roles
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'empleado';
  activo: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'trimly_token';
  private readonly USER_KEY = 'trimly_user';

  // Hacer login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data: AuthResponse = await response.json();
      
      // Guardar token y usuario en localStorage
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw new Error('Error al iniciar sesión');
    }
  }

  // Hacer logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = '/login';
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Obtener rol del usuario actual
  getUserRole(): 'admin' | 'empleado' | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // Verificar si es empleado
  isEmpleado(): boolean {
    return this.getUserRole() === 'empleado';
  }

  // Verificar si tiene acceso a una sección específica
  canAccessSection(section: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    // Admin tiene acceso a todo
    if (role === 'admin') return true;

    // Empleado: definir accesos específicos
    const empleadoAccess: Record<string, boolean> = {
      'dashboard': true,      // ✅ Con limitaciones
      'servicios': true,      // ✅ CRUD completo
      'turnos': true,         // ✅ CRUD completo
      'clientes': true,       // ✅ CRUD completo
      'productos': true,      // ✅ CRUD completo
      'facturacion': true,    // ✅ Acceso a facturación
      'reportes': false,      // ❌ Sin acceso
      'usuarios': false,      // ❌ Sin acceso
      'configuracion': false, // ❌ Sin acceso
    };

    return empleadoAccess[section] || false;
  }

  // Verificar permisos específicos
  hasPermission(permission: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    // Admin tiene todos los permisos
    if (role === 'admin') return true;

    // Empleado: definir permisos específicos
    const empleadoPermissions: Record<string, boolean> = {
      // Dashboard
      'dashboard.view': true,
      'dashboard.financials': false,  // ❌ No ve datos financieros

      // Servicios
      'servicios.view': true,
      'servicios.create': true,
      'servicios.edit': true,
      'servicios.delete': false,      // ❌ No puede eliminar

      // Turnos
      'turnos.view': true,
      'turnos.create': true,
      'turnos.edit': true,
      'turnos.delete': true,
      'turnos.assign': true,          // ✅ Puede asignar a cualquier profesional

      // Clientes
      'clientes.view': true,
      'clientes.create': true,
      'clientes.edit': true,
      'clientes.delete': false,       // ❌ No puede desactivar

      // Productos
      'productos.view': true,
      'productos.create': true,
      'productos.edit': true,
      'productos.edit.stock': false,  // ❌ No puede modificar stock
      'productos.delete': false,      // ❌ No puede eliminar

      // Facturación
      'facturacion.view': true,
      'facturacion.create': true,
      'facturacion.reportes': false,  // ❌ Sin pestaña reportes

      // Reportes
      'reportes.view': false,
      'reportes.generate': false,

      // Usuarios
      'usuarios.view': false,
      'usuarios.create': false,
      'usuarios.edit': false,
      'usuarios.delete': false,
    };

    return empleadoPermissions[permission] || false;
  }

  // Actualizar información del usuario
  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Verificar si el token es válido (opcional, para validación en servidor)
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('http://localhost:3000/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout(); // Token inválido, hacer logout
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;