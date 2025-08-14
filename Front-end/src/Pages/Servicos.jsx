import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import PopupConfirmacao from "../Componets/Popup";

export default function Servicos() {
  const [registro, setRegistros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [horarios, setHorarios] = useState("");
  const [ativo, setAtivo] = useState(1);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [showFormulario, setShowFormulario] = useState(false);
  const [descricao, setDescricao] = useState();

  useEffect(() => {
    if (clienteSelecionado) {
      setNome(clienteSelecionado.NOME || "");
      setValor(clienteSelecionado.VALOR || "");
      setHorarios(clienteSelecionado.HORARIOS || "");
      setAtivo(clienteSelecionado.ATIVO ?? 1);
    }

    const fetchClientes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/servicos`);
        const data = await res.json();
        setRegistros(data.registros);
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
        `http://localhost:5000/servicosId/${clienteSelecionado.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NOME: nome,
            VALOR: valor,
            HORARIOS: horarios,
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

  const handleCadastro = async (e) => {
    e.preventDefault();

    const novoServico = {
      descricao,
      valor,
      horarios,
      ativo,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/CadastroServico`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoServico),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar serviço");
      }

      const resultado = await response.json();
      console.log("Serviço cadastrado com sucesso:", resultado);

      setDescricao("");
      setValor("");
      setHorarios("");
      setAtivo("1");
      setShowFormulario(false);
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível cadastrar o serviço.");
    }
  };

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">Serviços</h1>
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowFormulario(!showFormulario)}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
          >
            Cadastrar Serviço
          </button>
        </div>
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Descrição
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Valor
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Horarios
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
                <td className="px-4 py-2">{Registro.VALOR}</td>
                <td className="px-4 py-2">{Registro.HORARIOS}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      Registro.ATIVO === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Registro.ATIVO === 1 ? "Ativo" : "Inativo"}
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
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Horários
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={horarios}
                  onChange={(e) => setHorarios(e.target.value)}
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
      {showFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
            <h2 className="text-xl font-bold text-blue-800 mb-6">
              Cadastrar Serviço
            </h2>
            <form onSubmit={handleCadastro}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Horários
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={horarios}
                    onChange={(e) => setHorarios(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={ativo}
                    onChange={(e) => setAtivo(e.target.value)}
                  >
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFormulario(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Salvar
                </button>
              </div>
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
