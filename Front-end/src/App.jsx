import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import AdminPainel from "./AdminPainel";
import Dashbord from "./Pages/Dashbord.JSX";
import { Navigate } from "react-router-dom";
import Agendamentos from "./Pages/Agendamentos";
import ClientePage from "./Pages/ClientePage";
import Clientes from "./Pages/Clientes";
import Empresa from "./Pages/Empresa";
import Servicos from "./Pages/Servicos";
import Colaboradores from "./Pages/Colaboradores";
import ClientePageDados from "./Pages/ClienteDados";
import Pendencias from "./Pages/Pendencias";
import Agendar from "./Pages/Agendar";
import Administracao from "./Pages/Administracao";
import { useAuth } from "./AuthContext/useAuth";

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
        path="/clientes/:id"
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
      <Route
        path="/Servicos"
        element={
          <RotaProtegida>
            <Servicos />
          </RotaProtegida>
        }
      />
      <Route
        path="/Colaboradores"
        element={
          <RotaProtegida>
            <Colaboradores />
          </RotaProtegida>
        }
      />

      <Route
        path="/ClientePageDados/:cpf"
        element={
          <RotaProtegida>
            <ClientePageDados />
          </RotaProtegida>
        }
      />
      <Route
        path="/Pendencias"
        element={
          <RotaProtegida>
            <Pendencias />
          </RotaProtegida>
        }
      />
      <Route
        path="/Agendar"
        element={
          <RotaProtegida>
            <Agendar />
          </RotaProtegida>
        }
      />
      <Route
        path="/administracao"
        element={
          <RotaProtegida>
            <Administracao />
          </RotaProtegida>
        }
      />
    </Routes>
  );
}

function RotaProtegida({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/Admin" replace />;
  }

  return children;
}

export default App;
