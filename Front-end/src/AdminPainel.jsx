import React from "react";
import Sidebar from "./Componets/Sidebar";

function AdminPainel() {
  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Painel de Gestão
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> 
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Agendamentos
            </h2>
            <p className="text-gray-600">Hoje: 5 agendamentos confirmados</p>
          </div>
 
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Clientes
            </h2>
            <p className="text-gray-600">Total de clientes cadastrados: 120</p>
          </div>
 
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Funcionários
            </h2>
            <p className="text-gray-600">Equipe ativa: 8 colaboradores</p>
          </div>
        </div>
 
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Atividades Recentes
          </h2>
          <ul className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <li className="text-gray-700">✔️ João agendou consulta às 10h</li>
            <li className="text-gray-700">✔️ Novo cliente cadastrado: Maria</li>
            <li className="text-gray-700">
              ✔️ Funcionário Ana atualizou perfil
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AdminPainel;
