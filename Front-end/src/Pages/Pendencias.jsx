import { useEffect, useState } from "react";
import PopupConfirmacao from "../Componets/Popup";
import Sidebar from "../Componets/Sidebar";
import LoadingSpinner from "../Componets/LoadingSpinner";

export default function Empresa() {
  const [pendencias, setPendencias] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const controller = new AbortController();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/Pendencias", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
        const data = await res.json();
        setPendencias(data);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchEmpresas();
  }, [mostrarPopup, msg, pendencias]);

  const handleConfirmar = async (id, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado");
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

      setMostrarPopup(true);
      setMsg(data.message);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setMsg("Erro ao atualizar serviço");
      setMostrarPopup(true);
    }
  };

  if (!pendencias) return <LoadingSpinner texto="Buscando dados..." />;

  return (
    <section className="flex ">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Agendamentos pendentes
        </h1>
        <div className="overflow-x-auto  shadow">
          <table className="min-w-full divide-y divide-blue-100">
            {pendencias.length > 0 && (
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                    Cliente
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                    Horário
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                    Data
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                    Ações
                  </th>
                </tr>
              </thead>
            )}

            <tbody>
              {pendencias.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500 italic"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg">
                        Nenhuma pendência encontrada.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                pendencias.map((registro) => (
                  <tr
                    key={registro.ID}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-4 py-2">{registro.CLIENTE_NOME}</td>
                    <td className="px-4 py-2">{registro.HORA_INICIO}</td>
                    <td className="px-4 py-2">
                      {new Date(registro.DATA_ATENDIMENTO).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center md:justify-end gap-4">
                        <button
                          onClick={() =>
                            handleConfirmar(registro.ID, "REALIZADO")
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded shadow-sm transition"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmar(registro.ID, "CANCELADO")
                          }
                          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-1 rounded shadow-sm transition"
                        >
                          Cancelado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
