import { useEffect, useState } from "react";
import Sidebar from "../../Componets/Sidebar";
import PopupConfirmacao from "../../Componets/Popup";
import LoadingSpinner from "../../Componets/LoadingSpinner";

export default function Colaboradores() {
  const [registro, setRegistros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [ativo] = useState("0");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [showFormulario, setShowFormulario] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [cargoCadastro, setCargoCadastro] = useState();
  const [departamentoCadastro, setDepartamentoCadastro] = useState();
  const [cpf, setCpf] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [erros, setErros] = useState({});

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
        setCargoCadastro(data.cargo);
        setDepartamentoCadastro(data.departamento);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, [clienteSelecionado, msg, mostrarPopup]);

  const registrosFiltrados = registro.filter((r) =>
    r.NOME.toLowerCase().includes(filtroNome.toLowerCase())
  );

  const validarCampos = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!cpf.trim()) novosErros.cpf = "CPF é obrigatório";
    if (!telefone.trim()) novosErros.telefone = "Telefone é obrigatório";
    if (!email.trim()) novosErros.email = "E-mail é obrigatório";
    if (!cargo) novosErros.cargo = "Cargo é obrigatório";
    if (!departamento) novosErros.departamento = "Departamento é obrigatório";
    if (!dataInicio) novosErros.dataInicio = "Data de início é obrigatória";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const atualizarServico = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }

    if (!validarCampos()) return;

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
            CPF: cpf,
            TELEFONE: telefone,
            EMAIL: email,
            CARGO_ID: cargo,
            DEPARTAMENTO_ID: departamento,
            DATA_INICIO: dataInicio,
            OBSERVACOES: observacoes,
          }),
        }
      );
      const data = await response.json();
      setMostrarPopup(true);
      setMsg(data.message);
      setClienteSelecionado(null);
      setNome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setCargo("");
      setDepartamento("");
      setDataInicio("");
      setObservacoes("");
      setExpediente({});
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao atualizar serviço");
    }
  };

  const cadastrarColaborador = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/cadastrocolaboradore",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NOME: nome,
            CPF: cpf,
            TELEFONE: telefone,
            EMAIL: email,
            CARGO_ID: cargo,
            DEPARTAMENTO_ID: departamento,
            DATA_INICIO: dataInicio,
            OBSERVACOES: observacoes,
            EXPEDIENTE: expediente,
          }),
        }
      );

      const data = await response.json();
      setMostrarPopup(true);
      setMsg(data.message || "Colaborador cadastrado com sucesso!");
      setClienteSelecionado(null);
      setNome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setCargo("");
      setDepartamento("");
      setDataInicio("");
      setObservacoes("");
      setExpediente({});
    } catch (error) {
      console.error("Erro ao cadastrar colaborador:", error);
      alert("Erro ao cadastrar colaborador");
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

  const expedientePadrao = diasSemana.reduce((acc, dia) => {
    acc[dia.key] = {
      ativo: false,
      inicio: "",
      pausaInicio: "",
      pausaFim: "",
      fim: "",
    };
    return acc;
  }, {});

  const preencherExpediente = (expedienteDoRegistro) => {
    const novoExpediente = { ...expedientePadrao };

    for (const key in expedienteDoRegistro) {
      if (novoExpediente[key]) {
        novoExpediente[key] = {
          ...novoExpediente[key],
          ...expedienteDoRegistro[key],
        };
      }
    }

    setExpediente(novoExpediente);
  };

  const atualizarDia = (key, campo, valor) => {
    setExpediente((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [campo]: valor,
      },
    }));
  };

  if (!registro) return <LoadingSpinner texto="Buscando dados..." />;

  return (
    <section className="flex ">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 mb-12">
          Colaboradores
        </h1>
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowFormulario(!showFormulario)}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
          >
            Cadastrar Serviço
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            placeholder="Filtrar por nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="mb-4 px-3 py-2 border rounded"
          />
        </div>

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
            {registrosFiltrados.map((Registro) => (
              <tr
                key={Registro.ID}
                className="border-b hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setClienteSelecionado(Registro);
                  setNome(Registro.NOME || "");
                  setCpf(Registro.CPF || "");
                  setTelefone(Registro.TELEFONE || "");
                  setEmail(Registro.EMAIL || "");
                  setCargo(Registro.CARGO_ID || "");
                  setDepartamento(Registro.DEPARTAMENTO_ID || "");
                  setDataInicio(Registro.DATA_INICIO || "");
                  setObservacoes(Registro.OBSERVACOES || "");
                  preencherExpediente(Registro.EXPEDIENTE || {});
                }}
              >
                <td className="px-4 py-2">{Registro.NOME}</td>
                <td className="px-4 py-2">{Registro.CARGO}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      Registro.STATUS === "0"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Registro.STATUS === "0" ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {clienteSelecionado && (
        <div className="fixed top-0 right-0 z-50 h-full p-32 w-[85%] bg-white shadow-xl overflow-y-auto transition-all duration-300 border-l border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Editar Serviço
          </h2>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setClienteSelecionado(null)}
              aria-label="Fechar"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
            >
              Voltar
            </button>
          </div>
          <form onSubmit={atualizarServico}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {erros.nome && (
                <p className="text-red-500 text-sm mt-1">{erros.nome}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              >
                <option value="">Selecione um cargo</option>
                {cargoCadastro.map((c) => (
                  <option key={c.ID} value={c.ID}>
                    {c.NOME}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Departamento
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Selecione um departamento</option>
                {departamentoCadastro.map((dep) => (
                  <option key={dep.ID} value={dep.ID}>
                    {dep.NOME}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Data de Início
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
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
                          value={expediente[key]?.inicio || ""}
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
              cadastrar
            </button>
          </form>
        </div>
      )}
      {showFormulario && (
        <div className="fixed top-0 right-0 z-50 h-full p-32 w-[85%] bg-white shadow-xl overflow-y-auto transition-all duration-300 border-l border-gray-200">
          <h1 className="text-4xl font-bold text-blue-900 mb-10">
            Cadastrar colaborador
          </h1>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowFormulario(null)}
              aria-label="Fechar"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-300"
            >
              Voltar
            </button>
          </div>

          <form onSubmit={cadastrarColaborador}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nome
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
                CPF
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              >
                <option value="">Selecione um cargo</option>
                {cargoCadastro.map((c) => (
                  <option key={c.ID} value={c.ID}>
                    {c.NOME}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Departamento
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Selecione um departamento</option>
                {departamentoCadastro.map((dep) => (
                  <option key={dep.ID} value={dep.ID}>
                    {dep.NOME}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Data de Início
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
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
              cadastrar
            </button>
          </form>
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
