import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './loginpage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ VERIFICAR SI ESTÁ LOGUEADO AL INICIAR LA APP
  useEffect(() => {
    // Usar el nuevo sistema de autenticación
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // ✅ VALIDACIONES ESPECÍFICAS
    if (!username && !password) {
      setError('El nombre de usuario y la contraseña son requeridos');
      setIsLoading(false);
      return;
    }

    if (!username) {
      setError('El nombre de usuario es requerido');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('La contraseña es requerida');
      setIsLoading(false);
      return;
    }

    try {
      // ✅ VALIDACIÓN CON USUARIOS PREDEFINIDOS (temporal)
      const usuarios = [
        { 
          username: 'admin', 
          password: 'admin', 
          user: {
            id: 1,
            nombre: 'Administrador',
            apellido: 'Principal',
            email: 'admin',
            rol: 'admin' as const,
            activo: true
          }
        },
        { 
          username: 'empleado', 
          password: 'emp123', 
          user: {
            id: 2,
            nombre: 'Empleado',
            apellido: 'Ejemplo',
            email: 'empleado',
            rol: 'empleado' as const,
            activo: true
          }
        },
      ];

      // ✅ VALIDACIÓN ESPECÍFICA DE USUARIO Y CONTRASEÑA
      const usuarioExiste = usuarios.find(user => user.username === username);
      
      if (!usuarioExiste) {
        throw new Error('El usuario es incorrecto');
      }

      if (usuarioExiste.password !== password) {
        throw new Error('La contraseña es incorrecta');
      }

      // Simulación de delay de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ USAR EL NUEVO SISTEMA DE AUTENTICACIÓN
      const mockToken = `mock_token_${usuarioExiste.user.rol}_${Date.now()}`;
      
      // Guardar usando el authService
      localStorage.setItem('trimly_token', mockToken);
      localStorage.setItem('trimly_user', JSON.stringify(usuarioExiste.user));

      // ✅ FUNCIONALIDAD RECORDAR SESIÓN (opcional)
      if (rememberMe) {
        localStorage.setItem('trimly_remember', 'true');
      } else {
        localStorage.removeItem('trimly_remember');
      }

      // Redirigir al dashboard
      navigate('/dashboard');

    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="formSection">
        <div className="formWrapper">
          {/* Logo y título */}
          <div className="logoSection">
            <div className="logoContainer">
              <div className="logo">
                <span className="logoText">T</span>
              </div>
            </div>
            <h1 className="title">
              Trim<span className="titleGradient">ly</span>
            </h1>
            <p className="subtitle">Tu plataforma de gestión para peluquerías</p>
          </div>

          {/* Formulario de login */}
          <form className="form" onSubmit={handleLogin}>
            {/* Mostrar error si existe */}
            {error && (
              <div className="errorMessage">
                {error}
              </div>
            )}

            {/* Campo Usuario */}
            <div className="inputGroup">
              <label htmlFor="username" className="label">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Ingresa tu nombre de usuario"
                disabled={isLoading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="inputGroup">
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
            </div>

            {/* Recordar sesión y olvidar contraseña */}
            <div className="formOptions">
              <div className="checkboxGroup">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="checkboxLabel">
                  Recordar sesión
                </label>
              </div>
              <button
                type="button"
                className="forgotPassword"
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="loginButton"
            >
              {isLoading ? (
                <div className="loadingContent">
                  <div className="spinner"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="additionalInfo">
            <p className="supportText">
              ¿No tienes una cuenta?{' '}
              <button className="supportLink">
                Contacta con soporte
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="demoCredentials">
            <h3 className="demoTitle">Credenciales válidas:</h3>
            <div className="demoList">
              <p>
                <span className="demoLabel">Admin:</span> admin / admin
              </p>
              <p>
                <span className="demoLabel">Empleado:</span> empleado / emp123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;