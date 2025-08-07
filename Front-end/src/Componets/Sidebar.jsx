import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-[30vh] bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-lg fixed top-0 h-full">
      <h1 className="text-3xl font-extrabold mb-10 text-center tracking-wide">
        Painel Admin
      </h1>

      <nav className="space-y-3">
        <Link
          to="/Dashbord"
          className="flex items-center px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-600 transition duration-200"
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
        </Link>
        <Link
          to="/Agendamentos"
          className="flex items-center px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
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
        </Link>

        <Link
          to="#"
          className="flex items-center px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
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
          <span className="font-medium">Empresas</span>
        </Link>

        <Link
          to="#"
          className="flex items-center px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>
          <span className="font-medium">Configurações</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
