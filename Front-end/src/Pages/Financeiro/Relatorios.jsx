import { useEffect, useState } from "react";
import Sidebar from "../../Componets/Sidebar";

function Relatorios() {
  const [contas, setContas] = useState([]);
  const [clientes, setClientes] = useState();
  const [Prestacoes, setPrestacoes] = useState();

  const contasComCliente = contas.map((conta) => {
    const cliente = clientes.find((c) => c.ID === conta.ID_DEVEDOR);
    return {
      ...conta,
      CLIENTE_NOME: cliente?.CLIENTE_NOME || "Cliente não encontrado",
    };
  });

  const contasOrdenadas = [...contas].sort(
    (a, b) => new Date(b.CRIADA_EM) - new Date(a.CRIADA_EM)
  );

  const formatCurrency = (value) =>
    `R$ ${parseFloat(value).toFixed(2).replace(".", ",")}`;

  const totalReceber = contas
    .filter((c) => c.TIPO === "A RECEBER")
    .reduce((acc, c) => acc + parseFloat(c.VALOR_TOTAL), 0);

  const totalPagar = contas
    .filter((c) => c.TIPO === "A PAGAR")
    .reduce((acc, c) => acc + parseFloat(c.VALOR_TOTAL), 0);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/Contas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setContas(data.contas);
        setClientes(data.Cadastros);
        setPrestacoes(data.Prestacoes);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchClientes();
  }, [contas]);

  return (
    <div className="  flex  ">
      <Sidebar />
      <div className="flex-1 ms-[30vh] p-32 h-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-800">
            Relatório de Contas
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Contas a Receber
              </h2>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalReceber)}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Contas a Pagar
              </h2>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalPagar)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
