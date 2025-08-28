import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/freepik__a-minimalist-icon-for-an-erp-company-depicting-int__4309-removebg-preview (1).png";

function Sidebar() {
  return (
    <aside className="w-[30vh] bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-lg fixed top-0 h-full">
      <img src={Logo} alt="Descrição da imagem" className="h-36 m-auto" />

      <nav className="space-y-3">
        <NavLink
          to="/Dashbord"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
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
              d="M3 12l2-2m0 0l7-7 7 7m-9 13h4"
            />
          </svg>
          <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink
          to="/Agendamentos"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Agendamentos</span>
        </NavLink>
        <NavLink
          to="/Agendar"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium">Agendar</span>
        </NavLink>

        <NavLink
          to="/Clientes"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
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
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="font-medium">Clientes</span>
        </NavLink>

        <NavLink
          to="/Empresa"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition duration-200 ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
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
              d="M7 8h10M7 12h10M7 16h10"
            />
          </svg>
          <span className="font-medium">Empresa</span>
        </NavLink>
      </nav>
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-blue-200">
        <span className="font-semibold">Connect V 1.2 27.8.25 </span>
      </div>
    </aside>
  );
}

export default Sidebar;
