import Navbar from "./navbar/Navbar";
import Clientes from "./clientes/Clientes";
import "./App.css";

export default function App() {
  return (
    <div className="container-fluid h-100" style={{ minHeight: "100vh", background: "#19191d" }}>
      <div className="row h-100 flex-nowrap" style={{ height: "100vh" }}>
        <div className="col-auto p-0">
          <Navbar />
        </div>
        <div className="col p-0" style={{ minHeight: "100vh", width: "100%" }}>
          <Clientes />
        </div>
      </div>
    </div>
  );
}