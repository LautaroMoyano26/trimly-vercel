import Navbar from "./components/navbar";

export default function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <Navbar />
      <div style={{ marginLeft: "100px", padding: "32px", color: "#fff", flex: 1 }}>
        <h1>Bienvenido a Trimly-APP</h1>
      </div>
    </div>
  );
}