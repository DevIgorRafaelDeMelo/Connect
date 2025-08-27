import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import PopupConfirmacao from "../Componets/Popup";

const CalendarCard = ({ month, year, days }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [agenda, setAgenda] = useState();
  const [servico, setServico] = useState();

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    tipoServico: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch("http://localhost:5000/agenda", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID: 1 }),
        });

        const data = await response.json();

        setAgenda(data.AGENDA);
        setServico(data.SERVICO);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        setMsg("Erro ao atualizar serviço");
      }
    };

    fetchAgenda();
  }, [agenda]);

  const submitAgendamento = async ({
    formData,
    selectedTime,
    selectedDay,
    onSuccess,
    onError,
  }) => {
    try {
      const res = await fetch("http://localhost:5000/comfirmagendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: 1,
          nome: formData.nome,
          telefone: formData.telefone,
          cpf: formData.cpf,
          tipoServico: formData.tipoServico,
          horario: selectedTime,
          data: `${selectedDay.year}-${selectedDay.month + 1}-${
            selectedDay.day
          }`,
        }),
      });
      const data = await res.json();
      setMostrarPopup(true);
      setMsg(data.message);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      if (onError) onError(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full mt-10 ">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8 tracking-wide">
        {new Date(year, month).toLocaleString("pt-BR", { month: "long" })}{" "}
        {year}
      </h2>
      <div className="grid grid-cols-7 gap-3 text-center text-base">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="font-bold text-gray-700">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const today = new Date();
          const currentDate = new Date(year, month, day);
          const isPastDay =
            day && currentDate < new Date(today.setHours(0, 0, 0, 0));

          const bgClass = day
            ? isPastDay
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-400 text-white hover:bg-blue-500 cursor-pointer"
            : "";

          return (
            <div
              key={index}
              className={`py-3 rounded ${bgClass}`}
              onClick={() => {
                if (!isPastDay && day) {
                  setSelectedDay({ day, month, year });
                }
              }}
              title={isPastDay ? "Dia indisponível" : "Clique para agendar"}
            >
              {day || ""}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex h-screen">
          <Sidebar />{" "}
          <div className="flex-1 p-8 ms-[30vh] py-20 px-48 overflow-y-auto bg-white">
            <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3  ">
              Horários disponíveis
            </h1>
            <span className="block text-2xl font-semibold text-blue-700 mt-2">
              Dia {selectedDay.day}/{selectedDay.month + 1}/{selectedDay.year}
            </span>

            <div className="flex justify-end mb-10">
              <button
                onClick={() => setSelectedDay(null)}
                title="Voltar"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              >
                ← Voltar
              </button>
            </div>

            <div className="relative mb-10 bg-white p-6 rounded-xl shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                {Array.from({ length: 17 }, (_, i) => {
                  const hour = 8 + Math.floor(i / 2);
                  const minute = i % 2 === 0 ? "00" : "30";
                  const time = `${hour
                    .toString()
                    .padStart(2, "0")}:${minute}:00`;
                  const isOccupied = agenda.some((item) => {
                    const date = new Date(item.DATA_ATENDIMENTO);
                    return (
                      date.getFullYear() === selectedDay.year &&
                      date.getMonth() === selectedDay.month &&
                      date.getDate() === selectedDay.day &&
                      item.HORA_INICIO === time
                    );
                  });

                  return (
                    <div
                      key={time}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl shadow-md transition-all duration-200 border ${
                        isOccupied
                          ? "bg-blue-500 text-gray-300 cursor-not-allowed border-blue-500"
                          : "bg-white hover:bg-blue-50 cursor-pointer border-blue-200"
                      }`}
                      title={
                        isOccupied ? "Horário ocupado" : "Clique para agendar"
                      }
                    >
                      <span className="text-lg font-semibold text-blue-900">
                        {time.slice(0, 5)}
                      </span>

                      {!isOccupied && (
                        <div
                          onClick={() => {
                            setSelectedTime(time);
                            setShowFormModal(true);
                          }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          title="Agendar horário"
                        >
                          <span>Agendar</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h6m-3-3v6m13-5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-blue-200 relative m-4  ">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-3 right-3 text-black-500 hover:text-black-700 text-xl font-bold"
              title="Fechar"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold mb-6 text-center text-blue-900">
              Agendar horário {selectedTime?.slice(0, 5)}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmModal(true);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-blue-800">
                  Nome:
                </label>
                <input
                  className="w-full border border-blue-200 rounded px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-blue-800">
                  CPF:
                </label>
                <input
                  className="w-full border border-blue-200 rounded px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-blue-800">
                  Telefone:
                </label>
                <input
                  className="w-full border border-blue-200 rounded px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-blue-800">
                  Tipo de Serviço:
                </label>
                <select
                  name="tipoServico"
                  value={formData.tipoServico}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoServico: e.target.value })
                  }
                  className="w-full border border-blue-200 rounded px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                >
                  <option value="">Selecione...</option>
                  {servico
                    .filter((s) => s.ATIVO === 1)
                    .map((s) => (
                      <option key={s.ID} value={s.NOME}>
                        {s.NOME}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative m-4 border border-blue-200 transition-transform  ">
            <h3 className="text-2xl font-semibold text-center text-blue-900 mb-6">
              Confirmar Agendamento
            </h3>

            <ul className="text-blue-900 space-y-3 text-sm">
              <li>
                <span className="font-medium text-blue-800"> Nome:</span>{" "}
                {formData.nome}
              </li>
              <li>
                <span className="font-medium text-blue-800"> Telefone:</span>{" "}
                {formData.telefone}
              </li>
              <li>
                <span className="font-medium text-blue-800"> CPF:</span>{" "}
                {formData.cpf}
              </li>
              <li>
                <span className="font-medium text-blue-800"> Serviço:</span>{" "}
                {formData.tipoServico}
              </li>
              <li>
                <span className="font-medium text-blue-800"> Horário:</span>{" "}
                {selectedTime?.slice(0, 5)}
              </li>
            </ul>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  submitAgendamento({
                    formData,
                    selectedTime,
                    selectedDay,
                    onSuccess: () => {
                      setMostrarPopup(true);
                      setMsg("Agendamento confirmado!");
                      setShowConfirmModal(false);
                      setShowFormModal(false);
                      setSelectedDay(null);
                    },
                    onError: () => {
                      setMsg("Erro ao confirmar agendamento.");
                    },
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
      {mostrarPopup && (
        <PopupConfirmacao
          mensagem={msg}
          onClose={() => setMostrarPopup(false)}
        />
      )}
    </div>
  );
};

export default CalendarCard;
