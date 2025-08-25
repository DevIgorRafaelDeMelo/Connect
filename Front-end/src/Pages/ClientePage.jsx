import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import PopupConfirmacao from "../Componets/Popup";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ClientePage() {
  const { id, cpf } = useParams(); 
  const [cliente, setCliente] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [aberto, setAberto] = useState(false);
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [ordem, setOrdem] = useState("asc");
  const navigate = useNavigate();
  const registrosFiltrados = registros
    .filter((registro) => {
      const dataFormatada = new Date(registro.DATA_ATENDIMENTO)
        .toISOString()
        .split("T")[0];

      const correspondeData = filtroData ? dataFormatada === filtroData : true;
      const correspondeStatus = filtroStatus
        ? registro.STATUS === filtroStatus
        : true;

      return correspondeData && correspondeStatus;
    })
    .sort((a, b) => {
      const dataA = new Date(a.DATA_ATENDIMENTO);
      const dataB = new Date(b.DATA_ATENDIMENTO);

      return ordem === "asc" ? dataA - dataB : dataB - dataA;
    });

  const handleConfirmar = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/AtualizaStatus/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ATIVO: status }),
      });

      const data = await res.json();

      setMsg(data.message);
      setMostrarPopup(true);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setMsg("Erro ao atualizar serviço");
      setMostrarPopup(true);
    }
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
        const res = await fetch(
          `http://localhost:5000/clienteIdCpf/${id}/${cpf}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (isMounted) {
          setCliente(data.atendimento);
          setRegistros(data.registros);
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchCliente();

    return () => {
      isMounted = false;
    };
  }, [id, msg, cliente, registros, cpf]);

  if (!cliente) return <p>Carregando...</p>;

  return (
    <section className="flex ">
      <Sidebar />
      <div className="flex-1   w-[70vh] ms-[30vh] p-40">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-10">
          Dados do Cliente
        </h1>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-10">
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

        <h2 className="text-2xl font-bold text-blue-800 pb-6 ">Agendado</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <div
            key={cliente.ID}
            className="flex flex-col justify-center space-y-3"
          >
            <div>
              <span className="text-sm text-gray-500">Serviço</span>
              <p className="text-lg font-medium text-gray-800">
                {cliente.TIPO_SERVICO}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Data</span>
              <p className="text-lg font-medium text-gray-800">
                {new Date(cliente.DATA_ATENDIMENTO).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Horário</span>
              <p className="text-lg font-medium text-gray-800">
                {cliente.HORA_INICIO} - {cliente.HORA_FIM}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p
                className={`text-lg font-semibold ${
                  cliente.STATUS === "REALIZADO"
                    ? "text-green-600"
                    : cliente.STATUS === "CANCELADO"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {cliente.STATUS}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-end">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setAberto(!aberto)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition flex items-center gap-2"
              >
                <FaCog className="text-white text-lg" />
                Ações
              </button>

              {aberto && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      handleConfirmar(cliente.ID, "REALIZADO");
                      setAberto(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      handleConfirmar(cliente.ID, "CANCELADO");
                      setAberto(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
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
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
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
                  <span>{ordem === "asc" ? "🔼" : "🔽"}</span>
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
      {mostrarPopup && (
        <PopupConfirmacao
          mensagem={msg}
          onClose={() => setMostrarPopup(false)}
        />
      )}
    </section>
  );
}

export default ClientePage;
