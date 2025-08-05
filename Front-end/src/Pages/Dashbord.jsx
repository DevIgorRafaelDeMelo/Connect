import React, { useEffect, useState } from "react";

function Dashbord() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/agendamentos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAgendamentos(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar agendamentos:", error);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Dashboard de Agendamentos
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Total de Agendamentos</h3>
          <p className="text-blue-600 text-3xl">{agendamentos.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Ativos Hoje</h3>
          <p className="text-green-600 text-3xl">
            {
              agendamentos.filter(
                (a) =>
                  a.DATA_ATENDIMENTO === new Date().toISOString().slice(0, 10)
              ).length
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Pendentes</h3>
          <p className="text-yellow-500 text-3xl">
            {
              agendamentos.filter((a) => a.STATUS.toLowerCase() === "pendente")
                .length
            }
          </p>
        </div>
      </section>

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">📅 Lista de Agendamentos</h2>
        <table className="min-w-full table-auto text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2">Cliente</th>
              <th className="p-2">Serviço</th>
              <th className="p-2">Data</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.ID} className="border-b">
                <td className="p-2">{a.CLIENTE_NOME}</td>
                <td className="p-2">{a.TIPO_SERVICO}</td>
                <td className="p-2">{a.DATA_ATENDIMENTO}</td>
                <td className="p-2">
                  {a.HORA_INICIO} - {a.HORA_FIM}
                </td>
                <td className="p-2">{a.STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashbord;
