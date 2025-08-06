import React, { useEffect, useState } from "react";
import InfoCard from "../Componets/InfoCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Sidebar from "../Componets/Sidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashbord() {
  const hojeFiltro = new Date().toISOString().split("T")[0];

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const hoje = new Date().toISOString().slice(0, 10);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState(hojeFiltro);
  const [filtroDataFim, setFiltroDataFim] = useState(hojeFiltro);

  const [filtroHora, setFiltroHora] = useState("");
  const [filtroTipoServico, setFiltroTipoServico] = useState("");
  const [filtroCPF, setFiltroCPF] = useState("");
  const [mostrarMais, setMostrarMais] = useState(false);

  const dataInicio = filtroDataInicio
    ? new Date(`${filtroDataInicio}T00:00:00`)
    : null;
  const dataFim = filtroDataFim ? new Date(`${filtroDataFim}T23:59:59`) : null;

  const agendamentosFiltrados = agendamentos.filter((a) => {
    const statusValido = filtroStatus ? a.STATUS === filtroStatus : true;
    const nomeValido = filtroNome
      ? a.CLIENTE_NOME.toLowerCase().includes(filtroNome.toLowerCase())
      : true;

    const dentroDoIntervalo = (() => {
      if (!dataInicio && !dataFim) return true;

      const dataAtendimento = new Date(a.DATA_ATENDIMENTO);

      if (dataInicio && dataFim)
        return dataAtendimento >= dataInicio && dataAtendimento <= dataFim;
      if (dataInicio) return dataAtendimento >= dataInicio;
      if (dataFim) return dataAtendimento <= dataFim;
    })();

    const horaValida = filtroHora ? a.HORA_INICIO === filtroHora : true;
    const tipoValido = filtroTipoServico
      ? a.TIPO_SERVICO.toLowerCase().includes(filtroTipoServico.toLowerCase())
      : true;
    console.log(typeof a.CPF);
    const cpfValido = filtroCPF ? a.CPF.includes(filtroCPF) : true;

    return (
      statusValido &&
      nomeValido &&
      cpfValido &&
      dentroDoIntervalo &&
      horaValida &&
      tipoValido
    );
  });

  const totais = {
    total: agendamentos.length,
    ativosHoje: agendamentos.filter((a) => a.DATA_ATENDIMENTO === hoje).length,
    pendentes: agendamentos.filter(
      (a) => a.STATUS?.toLowerCase() === "AGENDADO"
    ).length,
    finalizados: agendamentos.filter(
      (a) => a.STATUS?.toLowerCase() === "REALIZADO"
    ).length,
  };

  const chartData = {
    labels: ["Total", "Hoje", "Pendentes", "Finalizados"],
    datasets: [
      {
        label: "Agendamentos",
        data: [
          totais.total,
          totais.ativosHoje,
          totais.pendentes,
          totais.finalizados,
        ],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado");
      setCarregando(false);
      return;
    }
    fetch("http://localhost:5000/agendamentos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAgendamentos(data);
        setCarregando(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Erro ao carregar agendamentos:", error);
          setCarregando(false);
        }
      });

    // Limpeza quando o componente desmontar
    return () => controller.abort();
  }, []);

  if (carregando) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <section className="flex  bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] py-20  ">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3">
          Dashboard de Agendamentos
        </h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            title="Total"
            value={totais.total}
            icon={<UserIcon className="h-6 w-6 text-blue-700" />}
          />
          <InfoCard
            title="Hoje"
            value={totais.ativosHoje}
            icon={<ClockIcon className="h-6 w-6 text-blue-700" />}
          />
          <InfoCard
            title="Pendentes"
            value={totais.pendentes}
            icon={<XCircleIcon className="h-6 w-6 text-yellow-500 " />}
          />
          <InfoCard
            title="Finalizados"
            value={totais.finalizados}
            icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
          />
        </section>

        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Gráfico de Agendamentos
        </h2>
        <div className="flex-1 w-[50%] m-auto">
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto my-20">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            📋 Lista de Agendamentos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Campo 1: Nome */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Nome do cliente
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* Campo 2: CPF */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                CPF
              </label>
              <input
                type="text"
                placeholder="Ex: 123.456.789-00"
                value={filtroCPF}
                onChange={(e) => setFiltroCPF(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Todos os Status</option>
                <option value="AGENDADO">Agendado</option>
                <option value="REALIZADO">Realizado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            {/* Campos colapsáveis */}
            {mostrarMais && (
              <>
                {/* Campo 3: Tipo de Serviço */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Tipo de serviço
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Consulta, Corte de cabelo..."
                    value={filtroTipoServico}
                    onChange={(e) => setFiltroTipoServico(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Data inicial
                  </label>
                  <input
                    type="date"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Data final
                  </label>
                  <input
                    type="date"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-700">
                    Hora agendada
                  </label>
                  <input
                    type="time"
                    value={filtroHora}
                    onChange={(e) => setFiltroHora(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </>
            )}

            {/* Botão de colapso */}
            <div className="col-span-full flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setMostrarMais((prev) => !prev)}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
              >
                {mostrarMais ? "Mostrar menos filtros" : "Mostrar mais filtros"}
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                  Cliente
                </th>
                <th className="px-4 py-2">CPF</th>
                <th className="px-4 py-2">Serviço</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {agendamentosFiltrados.map((a) => (
                <tr key={a.ID} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2">{a.CLIENTE_NOME}</td>
                  <td className="px-4 py-2">{a.CPF}</td>
                  <td className="px-4 py-2">{a.TIPO_SERVICO}</td>
                  <td className="px-4 py-2">
                    {new Date(a.DATA_ATENDIMENTO).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">
                    {a.HORA_INICIO} - {a.HORA_FIM}
                  </td>
                  <td className="px-4 py-2">{a.STATUS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Dashbord;
