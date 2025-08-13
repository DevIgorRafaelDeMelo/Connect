import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import PopupConfirmacao from "../Componets/Popup";

export default function Colaboradores() {
  const [registro, setRegistros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [ativo, setAtivo] = useState(1);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (clienteSelecionado) {
      setNome(clienteSelecionado.NOME || "");
      setCargo(clienteSelecionado.CARGO || "");
    }

    const fetchClientes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/Colaboradores`);
        const data = await res.json();
        setRegistros(data.registros);
        console.log(registro);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, [clienteSelecionado, msg, mostrarPopup]);

  const atualizarServico = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/ColaboradorId/${clienteSelecionado.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NOME: nome,
            CARGO: cargo,
            ATIVO: ativo,
          }),
        }
      );
      const data = await response.json();
      setMostrarPopup(true);
      setMsg(data.message);
      setClienteSelecionado(null);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao atualizar serviço");
    }
  };

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] py-20   p-52">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Colaboradores
        </h1>

        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Descrição
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Cargo
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {registro.map((Registro) => (
              <tr
                key={Registro.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => setClienteSelecionado(Registro)}
              >
                <td className="px-4 py-2">{Registro.NOME}</td>
                <td className="px-4 py-2">{Registro.CARGO}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      Registro.STATUS === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Registro.STATUS === 1 ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {clienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[400px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setClienteSelecionado(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Editar Serviço
            </h2>

            <form onSubmit={atualizarServico}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={ativo}
                  onChange={(e) => setAtivo(Number(e.target.value))}
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Inativo</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
      {mostrarPopup && (
        <PopupConfirmacao
          mensagem={msg}
          onClose={() => setMostrarPopup(false)}
        />
      )}
    </section>
  );
}
