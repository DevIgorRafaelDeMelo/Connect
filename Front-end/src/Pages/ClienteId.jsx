import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  FaGem,
  FaStarHalfAlt,
  FaMedal,
  FaCircle,
  FaCrown,
} from "react-icons/fa";
import LoadingSpinner from "../Componets/LoadingSpinner";

function ClienteId() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [registros, setRegistros] = useState([null]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [ordem, setOrdem] = useState("asc");
  const [filtroDataInicial, setFiltroDataInicial] = useState("");
  const [filtroDataFinal, setFiltroDataFinal] = useState("");
  const navigate = useNavigate();

  const nivelEstilo = {
    1: { color: "text-gray-500", label: "Prata", icon: FaCircle },
    2: { color: "text-yellow-600", label: "Ouro", icon: FaStarHalfAlt },
    3: { color: "text-purple-500", label: "VIP", icon: FaMedal },
    4: { color: "text-blue-500", label: "Platina", icon: FaGem },
    5: { color: "text-cyan-500", label: "Diamante", icon: FaCrown },
  };

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }
    const fetchCliente = async () => {
      try {
        const res = await fetch(`http://localhost:5000/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (isMounted) {
          setRegistros(data.registros);
          setCliente(data.cliente);
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchCliente();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!cliente) return <LoadingSpinner texto="Buscando dados..." />;

  const realizados = registros.filter((item) => item.STATUS === "REALIZADO");
  const totalRealizados = realizados.length;

  const getNivel = (total) => {
    if (total >= 100) return 5;
    if (total >= 50) return 4;
    if (total >= 30) return 3;
    if (total >= 10) return 2;
    return 1;
  };

  const registrosFiltrados = registros.filter((registro) => {
    const dataRegistro = new Date(registro.DATA_ATENDIMENTO);
    const dataInicial = filtroDataInicial ? new Date(filtroDataInicial) : null;
    const dataFinal = filtroDataFinal ? new Date(filtroDataFinal) : null;

    const dentroDoIntervalo =
      (!dataInicial || dataRegistro >= dataInicial) &&
      (!dataFinal || dataRegistro <= dataFinal);

    const correspondeStatus = filtroStatus
      ? registro.STATUS === filtroStatus
      : true;

    return dentroDoIntervalo && correspondeStatus;
  });

  const nivel = getNivel(totalRealizados);
  const estilo = nivelEstilo[nivel];
  const Icon = estilo.icon;

  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 w-[70vh] ms-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-10">
          Dados do Cliente
        </h1>

        <div className="mb-10 bg-white p-6  flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="">
            <div>
              <strong>Nome:</strong> {cliente.CLIENTE_NOME}
            </div>
            <div>
              <strong>CPF:</strong> {cliente.CPF}
            </div>
            <div>
              <strong>Telefone:</strong> {cliente.TELEFONE}
            </div>
          </div>
          <div
            className={`flex justify-between items-center gap-4 ${estilo.color}`}
          >
            <div>
              <p className="text-sm font-semibold">Nível atual</p>
              <p className="text-lg font-bold">{estilo.label}</p>
              <p className="text-xs text-gray-400">
                Total realizados: {totalRealizados}
              </p>
            </div>
            <Icon className="text-3xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-800 pb-6">
          Histórico de Agendamentos
        </h2>
        <div className="flex justify-end gap-4 mb-4 w-full">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Data inicial
            </label>
            <input
              type="date"
              value={filtroDataInicial}
              onChange={(e) => setFiltroDataInicial(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Data final
            </label>
            <input
              type="date"
              value={filtroDataFinal}
              onChange={(e) => setFiltroDataFinal(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Todos os status</option>
              <option value="REALIZADO">Realizado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="AGENDADO">Agendado</option>
            </select>
          </div>
        </div>
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Serviço
              </th>
              <th
                className="px-4 py-2 text-left font-semibold text-sm text-blue-700 cursor-pointer"
                onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}
              >
                <div className="flex justify-between items-center w-full">
                  <span>Data</span>
                </div>
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Hora
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((registro) => (
              <tr
                key={registro.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/cliente/${registro.CPF}/${registro.ID}`);
                }}
              >
                <td className="px-4 py-2">{registro.TIPO_SERVICO}</td>
                <td className="px-4 py-2">
                  {new Date(registro.DATA_ATENDIMENTO).toLocaleDateString(
                    "pt-BR"
                  )}
                </td>
                <td className="px-4 py-2">
                  {registro.HORA_INICIO} - {registro.HORA_FIM}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      registro.STATUS === "Concluído"
                        ? "text-green-600"
                        : registro.STATUS === "Cancelado"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {registro.STATUS}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ClienteId;
