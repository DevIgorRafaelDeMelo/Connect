import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../Componets/Sidebar";
import {
  FaGem,
  FaStarHalfAlt,
  FaMedal,
  FaCircle,
  FaCrown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Componets/LoadingSpinner";

function ClientePageDados() {
  const navigate = useNavigate();
  const { cpf } = useParams();
  const [cliente, setCliente] = useState(null);
  const [registros, setRegistros] = useState([]);

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
        const res = await fetch(`http://localhost:5000/clientes/${cpf}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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
  }, [cpf]);

  const realizados = registros.filter((item) => item.STATUS === "REALIZADO");
  const totalRealizados = realizados.length;

  const getNivel = (total) => {
    if (total >= 100) return 5;
    if (total >= 50) return 4;
    if (total >= 30) return 3;
    if (total >= 10) return 2;
    return 1;
  };

  const nivel = getNivel(totalRealizados);
  const estilo = nivelEstilo[nivel];
  const Icon = estilo.icon;

  if (!cliente) return <LoadingSpinner texto="Buscando dados..." />;

  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-10">
          Dados do Cliente
        </h1>

        <div className="mb-10 bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start gap-6">
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

        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Serviço
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Data
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
            {registros.map((registro) => (
              <tr
                key={registro.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() =>
                  navigate(`/clienteIdAgenda/${registro.CPF}/${registro.ID}`)
                }
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

export default ClientePageDados;
