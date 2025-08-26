import React, { useEffect, useState } from "react";
import InfoCard from "../Componets/InfoCard";
import Sidebar from "../Componets/Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashbord() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  const hoje = new Date().toISOString().slice(0, 10);

  const totais = {
    total: agendamentos.length,
    ativosHoje: agendamentos.filter((a) => a.DATA_ATENDIMENTO?.startsWith(hoje))
      .length,
    pendentes: agendamentos.filter((a) => a.STATUS === "AGENDADO").length,
    finalizados: agendamentos.filter((a) => a.STATUS === "REALIZADO").length,
  };

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const agrupadoPorMes = {};

  agendamentos.forEach((a) => {
    const data = new Date(a.DATA_ATENDIMENTO);
    const chave = `${meses[data.getMonth()]}/${data.getFullYear()}`;
    agrupadoPorMes[chave] = (agrupadoPorMes[chave] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(agrupadoPorMes),
    datasets: [
      {
        label: "Agendamentos por mês",
        data: Object.values(agrupadoPorMes),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  if (carregando) {
    return <div>Carregando dados do dashboard...</div>;
  }

  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-44">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
          DashBoards
        </h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <InfoCard title="Total" value={totais.total} color="blue" />
          <InfoCard title="Hoje" value={totais.ativosHoje} color="gray" />
          <InfoCard title="Pendentes" value={totais.pendentes} color="yellow" />
          <InfoCard
            title="Finalizados"
            value={totais.finalizados}
            color="green"
          />
        </section>

        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Gráfico de Agendamentos por Mês
        </h2>
        <div className="w-full max-w-4xl mx-auto">
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </section>
  );
}

export default Dashbord;
