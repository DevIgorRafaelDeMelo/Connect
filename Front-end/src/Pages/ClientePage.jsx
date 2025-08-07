import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";

function ClientePage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCliente = async () => {
      try {
        const res = await fetch(`http://localhost:5000/clientes/${id}`);
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
  }, [id]);

  if (!cliente) return <p>Carregando...</p>;

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] py-20 p-40">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6">
          <div
            key={cliente.ID}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p>
              <strong>Serviço:</strong> {cliente.TIPO_SERVICO}
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(cliente.DATA_ATENDIMENTO).toLocaleDateString()}
            </p>
            <p>
              <strong>Hora:</strong> {cliente.HORA_INICIO} - {cliente.HORA_FIM}
            </p>
            <p>
              <strong>Status:</strong> {cliente.STATUS}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-800 pb-6">
          Histórico de Agendamentos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {registros.map((registro) => (
            <div
              key={registro.ID}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p>
                <strong>Serviço:</strong> {registro.TIPO_SERVICO}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(registro.DATA_ATENDIMENTO).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora:</strong> {registro.HORA_INICIO} -{" "}
                {registro.HORA_FIM}
              </p>
              <p>
                <strong>Status:</strong> {registro.STATUS}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientePage;
