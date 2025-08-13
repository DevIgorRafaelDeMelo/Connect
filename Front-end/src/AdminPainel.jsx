import React from "react";
import Sidebar from "./Componets/Sidebar";

function AdminPainel() {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Bem-vindo, Admin 👋
          </h2>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Resumo de Empresas</h3>
            <p className="text-gray-600">Número de empresas registradas: 10</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Agendamentos Recentes</h3>
            <p className="text-gray-600">Hoje: 5 agendamentos confirmados</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPainel;
