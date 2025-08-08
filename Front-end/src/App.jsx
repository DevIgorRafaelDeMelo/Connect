import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import AdminPainel from "./AdminPainel";
import Dashbord from "./Pages/Dashbord";
import { Navigate } from "react-router-dom";
import Agendamentos from "./Pages/Agendamentos";
import ClientePage from "./Pages/ClientePage";
import Clientes from "./Pages/Clientes";
import Empresa from "./Pages/Empresa";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Admin" element={<Admin />} />
      <Route
        path="/AdminPainel"
        element={
          <RotaProtegida>
            <AdminPainel />
          </RotaProtegida>
        }
      />
      <Route
        path="/Dashbord"
        element={
          <RotaProtegida>
            <Dashbord />
          </RotaProtegida>
        }
      />
      <Route
        path="/Agendamentos"
        element={
          <RotaProtegida>
            <Agendamentos />
          </RotaProtegida>
        }
      />
      <Route
        path="/cliente/:id"
        element={
          <RotaProtegida>
            <ClientePage />
          </RotaProtegida>
        }
      />
      <Route
        path="/clientes"
        element={
          <RotaProtegida>
            <Clientes />
          </RotaProtegida>
        }
      />
      <Route
        path="/Empresa"
        element={
          <RotaProtegida>
            <Empresa />
          </RotaProtegida>
        }
      />
    </Routes>
  );
}

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Admin" replace />;
  }

  return children;
}

export default App;
