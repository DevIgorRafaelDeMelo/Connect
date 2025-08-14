import Sidebar from "../Componets/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/clientesList`);
        const data = await res.json();
        setClientes(data.registros);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const clientesFiltrados = clientes
    .filter((cliente) =>
      cliente.CLIENTE_NOME.toLowerCase().includes(busca.toLowerCase())
    )
    .slice(0, 10);

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-10">
          Clientes
        </h1>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Cliente
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Telefone
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                CPF
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Status
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Trabalhos
              </th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => navigate(`/ClientePageDados/${cliente.CPF}`)}
              >
                <td className="px-4 py-2">{cliente.CLIENTE_NOME}</td>
                <td className="px-4 py-2">{cliente.TELEFONE}</td>
                <td className="px-4 py-2">{cliente.CPF}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      cliente.STATUS === "Ativo"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {cliente.STATUS}
                  </span>
                </td>
                <td className="px-4 py-2">{cliente.TRABALHOS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Clientes;
