import { useEffect } from "react";
import Sidebar from "../Componets/Sidebar";
import { Link } from "react-router-dom";

export default function Empresa() {
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const controller = new AbortController();
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/Empresa", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchEmpresas = async () => {};

    fetchEmpresas();
  }, []);

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Painel de Gestão
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <Link
            to="/servicos"
            className="bg-white border rounded-xl p-8 shadow hover:shadow-lg cursor-pointer transition block"
          >
            <div className="flex items-center mb-4">
              {/* Ícone de serviços */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-800 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 3v2.25M14.25 3v2.25M3 7.5h18M4.5 7.5v11.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V7.5"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-blue-800">Serviços</h2>
            </div>
            <p className="text-gray-600">
              Gerencie os serviços oferecidos pela empresa.
            </p>
          </Link>

          <Link
            to="/colaboradores"
            className="bg-white border rounded-xl p-8 shadow hover:shadow-lg cursor-pointer transition block"
          >
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-800 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20h6M4 20h5v-2a4 4 0 00-4-4H4m4-4a4 4 0 100-8 4 4 0 000 8zm12 0a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-blue-800">
                Colaboradores
              </h2>
            </div>
            <p className="text-gray-600">
              Visualize e edite informações dos colaboradores.
            </p>
          </Link>
          <Link
            to="/pendencias"
            className="bg-white border rounded-xl p-8 shadow hover:shadow-lg cursor-pointer transition block"
          >
            <div className="flex items-center mb-4">
              {/* Ícone de pendências */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-800 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-blue-800">
                Pendências
              </h2>
            </div>
            <p className="text-gray-600">
              Acompanhe agendamentos pendentes ou não concluídos.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
