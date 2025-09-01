import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/freepik__a-minimalist-icon-for-an-erp-company-depicting-int__4309-removebg-preview (1).png";
function SidebarNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
          isActive ? "bg-blue-800" : "hover:bg-blue-600"
        }`
      }
    >
      <span className="w-5 h-5 mr-3 text-blue-300">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside className="w-[30vh] bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-lg fixed top-0 h-full overflow-y-auto">
      <img src={Logo} alt="Logo" className="h-36 m-auto mb-6" />

      {/* Botões principais */}
      <nav className="space-y-3">
        <button
          onClick={() => toggleMenu("financeiro")}
          className={`flex items-center px-4 py-2 rounded-lg w-full transition duration-200 ${
            activeMenu === "financeiro" ? "bg-blue-800" : "hover:bg-blue-600"
          }`}
        >
          <svg
            className="w-5 h-5 mr-3 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3m0 0c1.657 0 3-1.343 3-3s-1.343-3-3-3zm0 0v12"
            />
          </svg>
          <span className="font-medium">Financeiro</span>
        </button>
        <div className="mt-4 space-y-4">
          {activeMenu === "financeiro" && (
            <div className="border-t border-blue-400 pt-4 mb-4 ms-4">
              <SidebarNavItem
                to="/contas"
                label="Contas"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/relatorios"
                label="Relatórios"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/receitas-despesas"
                label="Receitas & Despesas"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
            </div>
          )}
        </div>
        <button
          onClick={() => toggleMenu("agenda")}
          className={`flex items-center px-4 py-2 rounded-lg w-full transition duration-200 ${
            activeMenu === "agenda" ? "bg-blue-800" : "hover:bg-blue-600"
          }`}
        >
          <svg
            className="w-5 h-5 mr-3 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">Agenda</span>
        </button>
        <div className="mt-4 space-y-4  ">
          {activeMenu === "agenda" && (
            <div className="border-t border-blue-400 pt-4 ms-4">
              <SidebarNavItem
                to="/Dashbord"
                label="Dashboard"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7m-9 13h4"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/Agendamentos"
                label="Agendamentos"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/Agendar"
                label="Agendar"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/Clientes"
                label="Clientes"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                }
              />
              <SidebarNavItem
                to="/Empresa"
                label="Empresa"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h10M7 16h10"
                    />
                  </svg>
                }
              />
            </div>
          )}
        </div>
      </nav>

      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-blue-200">
        <span className="font-semibold">Connect V 1.2 27.8.25</span>
      </div>
    </aside>
  );
}

export default Sidebar;
