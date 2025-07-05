import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Clientes from "./clientes/Clientes";
import Servicios from "./servicios/Servicio"; 
import LoginPage from "./loginpage/loginpage"; 
import ProductosDashboard from "./stock/ProductosDashboard.tsx";

// ✅ CAMBIAR A sessionStorage para que no persista
const isAuthenticated = () => {
  return sessionStorage.getItem('isLoggedIn') === 'true';
};

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Componente para rutas que solo se ven sin autenticación (como login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/servicios" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login (sin navbar) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        {/* Rutas protegidas (con navbar) */}
        <Route 
          path="/servicios" 
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", height: "100vh", width: "100%", background: "#19191d", overflow: "hidden" }}>
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Servicios />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/clientes" 
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", height: "100vh", width: "100%", background: "#19191d", overflow: "hidden" }}>
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <Clientes />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* ✅ NUEVA RUTA: Stock/Productos */}
        <Route 
          path="/stock" 
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", height: "100vh", width: "100%", background: "#19191d", overflow: "hidden" }}>
                <Navbar />
                <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
                  <ProductosDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta por defecto */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to="/servicios" /> : 
              <Navigate to="/login" />
          } 
        />
        
        {/* Ruta para rutas no encontradas */}
        <Route 
          path="*" 
          element={
            isAuthenticated() ? 
              <Navigate to="/servicios" /> : 
              <Navigate to="/login" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}