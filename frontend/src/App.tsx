import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Clientes from "./clientes/Clientes";
import Servicios from "./servicios/Servicio"; 
import ProductosDashboard from "./stock/ProductosDashboard.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", height: "100vh", width: "100%", background: "#19191d", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/stock" element={<ProductosDashboard />} />
            {/* Agrega más rutas según tus vistas */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}