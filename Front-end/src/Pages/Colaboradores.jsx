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
        `http://localhost:5000/ColaboradorId/${clienteSelecionado.ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NOME: nome,
            CARGO: cargo,
            ATIVO: ativo,
            EXPEDIENTE: expediente,
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

  const diasSemana = [
    { nome: "Segunda", key: "segunda" },
    { nome: "Terça", key: "terca" },
    { nome: "Quarta", key: "quarta" },
    { nome: "Quinta", key: "quinta" },
    { nome: "Sexta", key: "sexta" },
    { nome: "Sábado", key: "sabado" },
    { nome: "Domingo", key: "domingo" },
  ];

  const [expediente, setExpediente] = useState(
    diasSemana.reduce((acc, dia) => {
      acc[dia.key] = {
        ativo: false,
        inicio: "",
        pausaInicio: "",
        pausaFim: "",
        fim: "",
      };
      return acc;
    }, {})
  );

  const atualizarDia = (key, campo, valor) => {
    setExpediente((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [campo]: campo === "ativo" ? valor : valor,
      },
    }));
  };

  return (
    <section className="flex ">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-40">
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
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl mx-4 sm:mx-0 relative overflow-y-auto max-h-[90vh]">
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Expediente
                </h3>
                {diasSemana.map(({ nome, key }) => (
                  <div key={key} className="mb-4 border-b pb-2">
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={expediente[key].ativo}
                        onChange={(e) =>
                          atualizarDia(key, "ativo", e.target.checked)
                        }
                      />
                      <span className="font-medium text-gray-700">{nome}</span>
                    </label>

                    {expediente[key].ativo && (
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">
                            Início
                          </label>
                          <input
                            type="time"
                            value={expediente[key].inicio}
                            onChange={(e) =>
                              atualizarDia(key, "inicio", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">
                            Início da Pausa
                          </label>
                          <input
                            type="time"
                            value={expediente[key].pausaInicio}
                            onChange={(e) =>
                              atualizarDia(key, "pausaInicio", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">
                            Fim da Pausa
                          </label>
                          <input
                            type="time"
                            value={expediente[key].pausaFim}
                            onChange={(e) =>
                              atualizarDia(key, "pausaFim", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">
                            Fim
                          </label>
                          <input
                            type="time"
                            value={expediente[key].fim}
                            onChange={(e) =>
                              atualizarDia(key, "fim", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
