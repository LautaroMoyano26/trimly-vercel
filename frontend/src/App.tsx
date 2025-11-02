import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Clientes from "./clientes/Clientes";
import Servicios from "./servicios/Servicio";
import LoginPage from "./loginpage/loginpage";
import ProductosDashboard from "./stock/ProductosDashboard.tsx";
import Usuarios from "./usuarios/Usuarios";
import Turnos from "./turnos/turno";
import ReportesDashboard from "./reportes/ReportesDashboard";
import Dashboard from "./dashboard/Dashboard";
import FacturacionPage from "./facturacion/FacturacionPage";
import authService from "./services/authService";
import "./App.css";

// Usar el nuevo sistema de autenticación
const isAuthenticated = () => {
  return authService.isAuthenticated();
};

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rutas que solo se ven sin autenticación (como login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Layout wrapper para rutas autenticadas
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Clientes */}
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Clientes />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Servicios */}
        <Route
          path="/servicios"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Servicios />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Stock */}
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProductosDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Usuarios */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Usuarios />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Turnos */}
        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Turnos />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Facturación */}
        <Route
          path="/facturacion"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FacturacionPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReportesDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Ruta catch-all para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}