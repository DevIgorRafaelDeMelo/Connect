import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../Componets/Sidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Agendamentos() {
  const hojeFiltro = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState(hojeFiltro);
  const [filtroDataFim, setFiltroDataFim] = useState(hojeFiltro);

  const [filtroHora, setFiltroHora] = useState("");
  const [filtroTipoServico, setFiltroTipoServico] = useState("");
  const [filtroCPF, setFiltroCPF] = useState("");
  const [mostrarMais, setMostrarMais] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);

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

  const ordenarAgendamentos = (coluna) => {
    if (ordenarPor === coluna) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(coluna);
      setOrdemAscendente(true);
    }
  };

  const agendamentosOrdenados = [...agendamentosFiltrados].sort((a, b) => {
    if (!ordenarPor) return 0;

    let valorA = a[ordenarPor];
    let valorB = b[ordenarPor];

    valorA = valorA ?? "";
    valorB = valorB ?? "";

    if (ordenarPor === "DATA_ATENDIMENTO") {
      return ordemAscendente
        ? new Date(valorA) - new Date(valorB)
        : new Date(valorB) - new Date(valorA);
    }

    if (typeof valorA === "string" && typeof valorB === "string") {
      return ordemAscendente
        ? valorA.localeCompare(valorB)
        : valorB.localeCompare(valorA);
    }

    return ordemAscendente ? valorA - valorB : valorB - valorA;
  });

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

    return () => controller.abort();
  }, []);

  if (carregando) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <section className="flex  ">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh]  p-40">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
          Lista de Agendamentos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

          {mostrarMais && (
            <>
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
        <table className="min-w-full divide-y divide-blue-100  ">
          <thead className="bg-blue-50">
            <tr>
              {[
                { label: "Cliente", key: "CLIENTE_NOME" },
                { label: "CPF", key: "CPF" },
                { label: "Serviço", key: "TIPO_SERVICO" },
                { label: "Data", key: "DATA_ATENDIMENTO" },
                { label: "Hora", key: "HORA_INICIO" },
                { label: "Status", key: "STATUS" },
              ].map(({ label, key }) => {
                const isActive = ordenarPor === key;
                const icon = isActive ? (ordemAscendente ? "🔼" : "🔽") : "⬍";

                return (
                  <th
                    key={key}
                    onClick={() => ordenarAgendamentos(key)}
                    className={`px-4 py-2 text-left font-semibold text-sm text-blue-700 cursor-pointer select-none ${
                      isActive ? "bg-blue-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{label}</span>
                      <span className="pl-2">{icon}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {agendamentosOrdenados.map((a) => (
              <tr
                key={a.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => navigate(`/cliente/${a.CPF}/${a.ID}`)}
              >
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
    </section>
  );
}

export default Agendamentos;
