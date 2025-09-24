import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Clientes from "./clientes/Clientes";
import Servicios from "./servicios/Servicio";
import LoginPage from "./loginpage/loginpage";
import ProductosDashboard from "./stock/ProductosDashboard.tsx";
import Usuarios from "./usuarios/Usuarios";
import Turnos from "./turnos/turno";
import { ReportesDashboard } from "./reportes/ReportesDashboard";

// ✅ CAMBIAR A sessionStorage para que no persista
const isAuthenticated = () => {
  return sessionStorage.getItem("isLoggedIn") === "true";
};

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rutas que solo se ven sin autenticación (como login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/clientes" replace />;
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

        {/* Ruta de clientes */}
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Clientes />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta de servicios */}
        <Route
          path="/servicios"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Servicios />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta de stock */}
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <ProductosDashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta de usuarios */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Usuarios />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta de turnos */}
        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Turnos />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ✅ NUEVA RUTA: Reportes y Facturación */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "100%",
                  background: "#19191d",
                  overflow: "hidden",
                }}
              >
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <ReportesDashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta catch-all para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}