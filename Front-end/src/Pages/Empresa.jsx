import { useEffect } from "react";
import Sidebar from "../Componets/Sidebar";

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
      <div className="flex-1 p-8 ms-[30vh] py-20 p-40">
        <h1 className="text-4xl font-bold text-blue-900 pb-10">Empresas</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 🛠️ Cards de Serviços */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Serviços
            </h2>
          </div>

          {/* 👥 Cards de Colaboradores */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Colaboradores
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
