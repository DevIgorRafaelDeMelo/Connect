import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";

function ClientePageDados() {
  const { cpf } = useParams();
  const [cliente, setCliente] = useState(null);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCliente = async () => {
      try {
        const res = await fetch(`http://localhost:5000/clientes/${cpf}`);
        const data = await res.json();
        console.log(data);
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

  if (!cliente) return <p>Carregando...</p>;

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-10">
          Dados do Cliente
        </h1>

        <div className="  mb-10">
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
                        : "text-yellow-600"
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
