import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import PopupConfirmacao from "../Componets/Popup";

export default function Feriados() {
  const [registro, setRegistros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (clienteSelecionado) {
      setNome(clienteSelecionado.NOME || "");
    }

    const fetchClientes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/Colaboradores`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/ColaboradorDispensa/${clienteSelecionado.ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NOME: nome,
            DATA_INICIO: dataInicio,
            DATA_FIM: dataFim,
            DESCRICAO: descricao,
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
    <section className="flex ">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-44">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Agendar ferias e feriados
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
            </tr>
          </thead>
          <tbody>
            {registro
              .filter((Registro) => Registro.STATUS === "0")
              .map((Registro) => (
                <tr
                  key={Registro.ID}
                  className="border-b hover:bg-blue-50 cursor-pointer"
                  onClick={() => setClienteSelecionado(Registro)}
                >
                  <td className="px-4 py-2">{Registro.NOME}</td>
                  <td className="px-4 py-2">{Registro.CARGO}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {clienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl mx-4 sm:mx-0 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setClienteSelecionado(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Seleciona o inervalo de tempo
            </h2>

            <form onSubmit={atualizarServico}>
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Data de início
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Data de término
                  </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Motivo ou descrição
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  placeholder="Ex: Férias anuais, dispensa médica, feriado prolongado..."
                  className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
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
