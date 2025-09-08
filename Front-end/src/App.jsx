import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import AdminPainel from "./AdminPainel";
import Dashbord from "./Pages/Agenda/Dashbord.JSX";
import { Navigate } from "react-router-dom";
import Agendamentos from "./Pages/Agenda/Agendamentos";
import ClientePage from "./Pages/Agenda/ClientePage";
import Clientes from "./Pages/Agenda/Clientes";
import Empresa from "./Pages/Agenda/Empresa";
import Servicos from "./Pages/Agenda/Servicos";
import Colaboradores from "./Pages/Agenda/Colaboradores";
import ClientePageDados from "./Pages/Agenda/ClienteDados";
import ClienteId from "./Pages/Agenda/ClienteId";
import Pendencias from "./Pages/Agenda/Pendencias";
import Agendar from "./Pages/Agenda/Agendar";
import Administracao from "./Pages/Agenda/Administracao";
import Feriados from "./Pages/Agenda/Feriados";
import Contas from "./Pages/Financeiro/Contas";
import { useAuth } from "./AuthContext/useAuth";
import Relatorios from "./Pages/Financeiro/Relatorios";

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
        path="/clienteId/:id"
        element={
          <RotaProtegida>
            <ClienteId />
          </RotaProtegida>
        }
      />
      <Route
        path="/cliente/:id/:cpf"
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
      <Route
        path="/feriados"
        element={
          <RotaProtegida>
            <Feriados />
          </RotaProtegida>
        }
      />
      <Route
        path="/contas"
        element={
          <RotaProtegida>
            <Contas />
          </RotaProtegida>
        }
      />
      <Route
        path="/Relatorios"
        element={
          <RotaProtegida>
            <Relatorios />
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
