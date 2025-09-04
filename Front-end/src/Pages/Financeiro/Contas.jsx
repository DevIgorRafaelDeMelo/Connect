import { useEffect, useState } from "react";
import Sidebar from "../../Componets/Sidebar";

function ContasPage() {
  const [contas, setContas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [clientes, setClientes] = useState();
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [parcelas, setParcelas] = useState();
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [novaConta, setNovaConta] = useState({
    CLIENTE_NOME: "",
    DESCRICAO: "",
    VALOR_TOTAL: "",
    VALOR_PAGO: "",
    MULTA: "",
    JUROS: "",
    DESCONTO: "",
    NUMERO_PARCELAS: "",
    VENCIMENTO: "",
    TIPO: "",
    ID_DEVEDOR: "",
  });
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const TIPOS_DE_DIVIDAS = [
    "Médico",
    "Condomínio",
    "Aluguel",
    "Parcela de veículo",
    "Cartão de crédito",
    "Empréstimo pessoal",
    "Cheque especial",
    "Plano de saúde",
    "Escola / Faculdade",
    "Conta de luz",
    "Conta de água",
    "Internet / Telefone",
    "IPVA",
    "IPTU",
    "Multa de trânsito",
    "Assinaturas (streaming, academia, etc.)",
    "Financiamento imobiliário",
    "Impostos atrasados",
    "Taxas públicas (licenciamento, alvarás)",
    "Despesas médicas particulares",
  ];

  const handleNovaContaClick = () => {
    setMostrarFormulario(true);
  };

  const abrirModal = (conta) => {
    setContaSelecionada(conta);
    setModalAberto(true);
  };

  useEffect(() => {
    if (mostrarFormulario) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

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
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchClientes();
  }, [mostrarFormulario]);
  const contasComCliente = contas.map((conta) => {
    const cliente = clientes.find((c) => c.ID === conta.ID_DEVEDOR);
    return {
      ...conta,
      CLIENTE_NOME: cliente?.CLIENTE_NOME || "Cliente não encontrado",
    };
  });

  const contasFiltradas = contasComCliente.filter((conta) => {
    const nomeMatch = conta.CLIENTE_NOME.toLowerCase().includes(
      filtroNome.toLowerCase()
    );

    const statusMatch = filtroStatus ? conta.STATUS === filtroStatus : true;

    const vencimento = new Date(conta.VENCIMENTO);
    const dataInicioMatch = filtroDataInicio
      ? vencimento >= new Date(filtroDataInicio)
      : true;

    const dataFimMatch = filtroDataFim
      ? vencimento <= new Date(filtroDataFim)
      : true;

    return nomeMatch && statusMatch && dataInicioMatch && dataFimMatch;
  });

  const buscarContaPorId = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/BuscarConta`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const dados = await res.json();
      setParcelas(dados.parcelas);
    } catch (error) {
      console.error("Erro ao buscar conta por ID:", error);
    }
  };

  const salvarNovaConta = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/adicionaNovaConta`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaConta),
      });

      if (res.ok) {
        alert("Conta adicionada com sucesso!");
        setMostrarFormulario(false);
      } else {
        alert("Erro ao adicionar conta.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão.");
    }
  };

  const excluirConta = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }
    try {
      await fetch("http://localhost:5000/DeleteConta", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setContas((prevContas) => prevContas.filter((conta) => conta.ID !== id));

      alert("Conta excluída com sucesso!");
    } catch (erro) {
      console.error("Erro ao excluir conta:", erro);
      alert("Não foi possível excluir a conta.");
    }
  };
  return (
    <div className="min-h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1  ms-[30vh]  mx-auto p-32  ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
            Contas
          </h1>
          <div className="flex justify-end mb-8">
            <button
              onClick={handleNovaContaClick}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
            >
              + Nova Conta
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col w-full sm:w-1/2">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Nome do cliente
            </label>
            <input
              type="text"
              placeholder="Digite o nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/4">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Status da conta
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-1/4">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Data inicial
            </label>
            <input
              type="date"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/4">
            <label className="mb-1 text-sm font-semibold text-gray-700">
              Data final
            </label>
            <input
              type="date"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Valor da Parcela
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Qtd. Parcelas
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id} className="border-b hover:bg-blue-50"></tr>
              ))}
            </tbody>
          </table>
          <table className="min-w-full divide-y divide-blue-100">
            <tbody>
              {contasFiltradas
                .sort((a, b) => new Date(b.CRIADA_EM) - new Date(a.CRIADA_EM))
                .map((conta) => (
                  <tr
                    key={conta.ID}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      abrirModal(conta);
                      buscarContaPorId(conta.ID);
                    }}
                  >
                    <td className="px-6 py-4">{conta.CLIENTE_NOME}</td>
                    <td className="px-6 py-4">{conta.NOME}</td>
                    <td className="px-6 py-4">
                      R${" "}
                      {(
                        parseFloat(conta.VALOR_TOTAL) /
                        parseInt(conta.NUMERO_PARCELAS)
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{conta.NUMERO_PARCELAS}</td>
                    <td className="px-6 py-4">
                      {new Date(conta.VENCIMENTO).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          conta.STATUS === "PAGA"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {conta.STATUS}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {mostrarFormulario && (
        <div className="fixed top-0 right-0 z-50 h-screen w-[85%] bg-white shadow-xl border-l border-gray-200 flex flex-col p-24 ">
          <div className="   px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-700">Nova Conta</h2>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMostrarFormulario(false)}
                aria-label="Fechar"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1   gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Nome do cliente
              </label>
              <input
                type="text"
                list="lista-clientes"
                placeholder="Digite ou selecione o nome"
                value={novaConta.CLIENTE_NOME}
                onChange={(e) => {
                  const nomeSelecionado = e.target.value;
                  const clienteSelecionado = clientes.find(
                    (c) => c.CLIENTE_NOME === nomeSelecionado
                  );

                  setNovaConta({
                    ...novaConta,
                    CLIENTE_NOME: nomeSelecionado,
                    ID_DEVEDOR: clienteSelecionado?.ID || "",
                  });
                }}
                className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="lista-clientes">
                {clientes.map((cliente) => (
                  <option key={cliente.ID} value={cliente.CLIENTE_NOME} />
                ))}
              </datalist>
            </div>
            <input
              type="text"
              placeholder="Descrição"
              value={novaConta.DESCRICAO}
              onChange={(e) =>
                setNovaConta({ ...novaConta, DESCRICAO: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Valor Total"
              value={novaConta.VALOR_TOTAL}
              onChange={(e) =>
                setNovaConta({ ...novaConta, VALOR_TOTAL: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Multa"
              value={novaConta.MULTA}
              onChange={(e) =>
                setNovaConta({ ...novaConta, MULTA: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Juros"
              value={novaConta.JUROS}
              onChange={(e) =>
                setNovaConta({ ...novaConta, JUROS: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Desconto"
              value={novaConta.DESCONTO}
              onChange={(e) =>
                setNovaConta({ ...novaConta, DESCONTO: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Parcelas"
              value={novaConta.NUMERO_PARCELAS}
              onChange={(e) =>
                setNovaConta({
                  ...novaConta,
                  NUMERO_PARCELAS: e.target.value,
                })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={novaConta.VENCIMENTO}
              onChange={(e) =>
                setNovaConta({ ...novaConta, VENCIMENTO: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              list="tipos-de-dividas"
              placeholder="Tipo"
              value={novaConta.TIPO}
              onChange={(e) =>
                setNovaConta({ ...novaConta, TIPO: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />

            <datalist id="tipos-de-dividas">
              {TIPOS_DE_DIVIDAS.map((tipo, index) => (
                <option key={index} value={tipo} />
              ))}
            </datalist>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={salvarNovaConta}
              className="bg-blue-600 text-white px-4 py-2 m-8 rounded hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
      {modalAberto && contaSelecionada && (
        <div className="fixed top-0 right-0 z-50 h-screen w-[85%] bg-white shadow-xl border-l border-gray-200 flex flex-col p-24 ">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 ">
            Detalhes da Conta
          </h1>

          <div className="mt-8 flex justify-end gap-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setModalAberto(false)}
            >
              Voltar
            </button>

            <button
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => setModalExcluirAberto(true)}
            >
              Excluir Conta
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-gray-700 text-base">
            <div>
              <span className="font-semibold text-gray-900">Nome:</span>{" "}
              {contaSelecionada.CLIENTE_NOME}
            </div>

            <div>
              <span className="font-semibold text-gray-900">
                Descrição / Conta:
              </span>{" "}
              {contaSelecionada.NOME}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Valor Total:</span>{" "}
              R$ {parseFloat(contaSelecionada.VALOR_TOTAL).toFixed(2)}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Multa:</span> R${" "}
              {parseFloat(contaSelecionada.MULTA).toFixed(2)}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Juros:</span> R${" "}
              {parseFloat(contaSelecionada.JUROS).toFixed(2)}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Desconto:</span> R${" "}
              {parseFloat(contaSelecionada.DESCONTO).toFixed(2)}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Parcelas:</span>{" "}
              {contaSelecionada.NUMERO_PARCELAS}
            </div>

            <div>
              <span className="font-semibold text-gray-900">Status:</span>{" "}
              <span className={`px-3 py-1 rounded-full text-xs font-bold  `}>
                {contaSelecionada.STATUS}
              </span>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
              Parcelas
            </h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-blue-100 table-auto text-sm text-left">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Valor</th>
                    <th className="px-6 py-3 font-semibold">Vencimento</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parcelas && parcelas.length > 0 ? (
                    parcelas.map((parcela, index) => (
                      <tr
                        key={parcela.ID}
                        className="border-b hover:bg-blue-50"
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">
                          R$ {parseFloat(parcela.VALOR).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(parcela.VENCIMENTO).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              parcela.STATUS === "PAGO"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {parcela.STATUS}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhuma parcela encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {modalExcluirAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 ">
              Confirmar exclusão
            </h1>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir a conta{" "}
              <strong>{contaSelecionada.NOME}</strong>? Essa ação não poderá ser
              desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setModalExcluirAberto(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  excluirConta(contaSelecionada.ID);
                  setModalExcluirAberto(false);
                  setModalAberto(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContasPage;
