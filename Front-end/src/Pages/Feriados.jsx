import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import PopupConfirmacao from "../Componets/Popup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaRegFileAlt } from "react-icons/fa";

export default function Feriados() {
  const [registro, setRegistros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filtroCargo, setFiltroCargo] = useState();
  const [filtroData, setFiltroData] = useState();
  const [filtroNome, setFiltroNome] = useState();
  const [dispensas, setDispensas] = useState();
  const [filtroNomeCadastro, setFiltroNomeCadastro] = useState("");

  const [showFormulario, setShowFormulario] = useState(false);

  const gerarRelatorioPDF = (item) => {
    const doc = new jsPDF();

    const inicio = new Date(item.DATA_INICIO);
    const fim = new Date(item.DATA_FIM);

    const diasDispensa =
      Math.abs(Math.floor((fim - inicio) / (1000 * 60 * 60 * 24))) + 1;

    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.text("TERMO DE DISPENSA TEMPORÁRIA", 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.text("Empresa: Nome da Empresa LTDA", 105, 40, { align: "center" });
    doc.text("CNPJ: 00.000.000/0001-00", 105, 46, { align: "center" });
    doc.text("Endereço: Rua Exemplo, 123 - Cidade/UF", 105, 52, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text("Informações do Colaborador", 105, 70, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Nome: ${item.NOME}`, 105, 78, { align: "center" });
    doc.text(`Cargo: ${item.CARGO}`, 105, 84, { align: "center" });
    doc.text(`Data de Início: ${item.DATA_INICIO.slice(0, 10)}`, 105, 90, {
      align: "center",
    });
    doc.text(`Data de Término: ${item.DATA_FIM.slice(0, 10)}`, 105, 96, {
      align: "center",
    });
    doc.text(`Motivo: ${item.DESCRICAO || "—"}`, 105, 102, { align: "center" });
    doc.text(`Total de dias de dispensa: ${diasDispensa} dia(s)`, 105, 108, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text("Termo de Ciência", 105, 125, { align: "center" });

    doc.setFontSize(12);
    const termo = `Declaro estar ciente da dispensa temporária acima descrita, comprometendo-me a retornar às minhas atividades no dia seguinte ao término informado.`;
    doc.text(doc.splitTextToSize(termo, 180), 15, 135);

    doc.line(30, 170, 100, 170);
    doc.text("Assinatura do colaborador", 65, 175, { align: "center" });

    doc.line(110, 170, 180, 170);
    doc.text("Assinatura do responsável", 145, 175, { align: "center" });

    doc.setFontSize(10);
    doc.text(
      `Documento gerado em: ${new Date().toLocaleDateString()}`,
      105,
      190,
      { align: "center" }
    );

    doc.save(`relatorio-dispensa-${item.NOME}.pdf`);
  };

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
        setDispensas(data.dispensas); 
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

  const registrosOrdenados = Array.isArray(dispensas)
    ? dispensas
        .map((dispensa) => {
          const colaborador = registro.find(
            (r) => r.ID === dispensa.FUNCIONARIO_ID
          );
          return colaborador
            ? {
                ...dispensa,
                NOME: colaborador.NOME,
                CARGO: colaborador.CARGO,
              }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => new Date(a.DATA_INICIO) - new Date(b.DATA_INICIO))
    : [];

  return (
    <section className="flex ">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-44">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Cadastros Agendados
        </h1>
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowFormulario(!showFormulario)}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
          >
            Cadastrar Serviço
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              placeholder="Filtrar por nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <input
              type="text"
              placeholder="Filtrar por cargo"
              value={filtroCargo}
              onChange={(e) => setFiltroCargo(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data Inicio
            </label>
            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Nome
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Cargo
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Início
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Término
              </th>
              <th className="px-4 py-2 text-left font-semibold text-sm text-blue-700">
                Descrição
              </th>
            </tr>
          </thead>
          <tbody>
            {registrosOrdenados
              .filter(
                (item) =>
                  !filtroNome ||
                  item.NOME.toLowerCase().includes(filtroNome.toLowerCase())
              )
              .filter(
                (item) =>
                  !filtroCargo ||
                  item.CARGO.toLowerCase().includes(filtroCargo.toLowerCase())
              )
              .filter(
                (item) =>
                  !filtroData || item.DATA_INICIO.slice(0, 10) === filtroData
              )
              .map((item) => (
                <tr key={item.ID} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2">{item.NOME}</td>
                  <td className="px-4 py-2">{item.CARGO}</td>
                  <td className="px-4 py-2">{item.DATA_INICIO.slice(0, 10)}</td>
                  <td className="px-4 py-2">{item.DATA_FIM.slice(0, 10)}</td>
                  <td className="px-4 py-2 flex items-center justify-between">
                    {item.DESCRICAO || "—"}
                    <button
                      onClick={() => gerarRelatorioPDF(item)}
                      className="ml-4 text-black hover:text-gray-700"
                      title="Gerar relatório"
                    >
                      <FaRegFileAlt size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showFormulario && (
        <div className="fixed top-0 right-0 z-50 h-full p-44 w-[85%] bg-white shadow-xl overflow-y-auto transition-all duration-300 border-l border-gray-200">
          <div className="  relative">
            <h1 className="text-4xl font-bold text-blue-900 mb-10">
              Cadastro de afastamento
            </h1>
            <button
              onClick={() => {
                setShowFormulario(false);
                setClienteSelecionado(null);
              }}
              aria-label="Fechar"
              className="absolute  right-4 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
            >
              Voltar
            </button>

            {!clienteSelecionado ? (
              <>
                <h2 className="text-2xl font-bold text-blue-800 mb-6">
                  Selecione o colaborador
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Filtrar por nome..."
                    value={filtroNomeCadastro}
                    onChange={(e) => setFiltroNomeCadastro(e.target.value)}
                    className="mb-6 px-4 py-3 border border-blue-300 rounded-md w-[20vh]"
                  />
                </div>
                <div className="overflow-auto max-h-[400px]">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-sm text-blue-700">
                          Nome
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-sm text-blue-700">
                          Cargo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registro
                        .filter((r) => r.STATUS === "0")
                        .filter((r) =>
                          r.NOME.toLowerCase().includes(
                            filtroNomeCadastro.toLowerCase()
                          )
                        )
                        .map((r) => (
                          <tr
                            key={r.ID}
                            className="border-b hover:bg-blue-50 cursor-pointer"
                            onClick={() => setClienteSelecionado(r)}
                          >
                            <td className="px-4 py-3">{r.NOME}</td>
                            <td className="px-4 py-3">{r.CARGO}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <section className="w-full       ">
                <header className="mb-12">
                  <p className="text-2xl sm:text-2xl font-semibold text-blue-700">
                    <span className="text-gray-900 font-bold">
                      {clienteSelecionado.NOME}
                    </span>
                  </p>
                </header>

                <form onSubmit={atualizarServico} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de início
                      </label>
                      <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de término
                      </label>
                      <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo ou descrição
                    </label>
                    <select
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um motivo</option>
                      <option value="Férias">Férias</option>
                      <option value="Dispensa médica">Dispensa médica</option>
                      <option value="Exame médico">Exame médico</option>
                      <option value="Feriado prolongado">
                        Feriado prolongado
                      </option>
                      <option value="Licença paternidade">
                        Licença paternidade
                      </option>
                      <option value="Licença maternidade">
                        Licença maternidade
                      </option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setClienteSelecionado(null)}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </section>
            )}
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
