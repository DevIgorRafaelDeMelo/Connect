import { useState } from "react";

const CalendarCard = ({ month, year, days, agenda }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    tipoServico: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const submitAgendamento = async ({
    formData,
    selectedTime,
    selectedDay,
    onSuccess,
    onError,
  }) => {
    try {
      const response = await fetch("http://localhost:5000/comfirmagendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID:1,
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

      if (!response.ok) {
        throw new Error("Erro ao enviar agendamento.");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      if (onError) onError(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full mt-10 ">
      <h2 className="text-2xl font-bold text-black text-center mb-6">
        {month} {year}
      </h2>
      <div className="grid grid-cols-7 gap-3 text-center text-base">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="font-bold text-gray-700">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const today = new Date();
          const isPastDay =
            day &&
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day < today.getDate();

          const bgClass = day
            ? isPastDay
              ? "bg-blue-200"
              : "bg-blue-400"
            : "";

          return (
            <div
              key={index}
              className={`py-3 rounded cursor-pointer ${bgClass}`}
              onClick={() => day && setSelectedDay({ day, month, year })}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
      {selectedDay && (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50 flex flex-col items-center p-8">
          <div className="w-full max-w-3xl relative">
            <h2 className="text-2xl font-bold text-black text-center mb-4">
              Horários disponíveis em {selectedDay.day}/{selectedDay.month + 1}/
              {selectedDay.year}
            </h2>

            <button
              onClick={() => setSelectedDay(null)}
              title="Fechar"
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
            >
              ✕
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {Array.from({ length: 17 }, (_, i) => {
                const hour = 8 + Math.floor(i / 2);
                const minute = i % 2 === 0 ? "00" : "30";
                const time = `${hour.toString().padStart(2, "0")}:${minute}:00`;
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
                    className={`flex items-center justify-between px-4 py-3 rounded shadow-sm ${
                      isOccupied
                        ? "bg-red-300 opacity-60 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    }`}
                    title={
                      isOccupied ? "Horário ocupado" : "Clique para agendar"
                    }
                  >
                    <span className="text-lg font-medium">
                      {time.slice(0, 5)}
                    </span>

                    {!isOccupied && (
                      <button
                        onClick={() => {
                          setSelectedTime(time);
                          setShowFormModal(true);
                        }}
                        className="ml-2 text-green-600 hover:text-green-800 text-xl"
                      >
                        ➕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative m-4">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
              title="Fechar"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center text-black">
              Agendar horário {selectedTime?.slice(0, 5)}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmModal(true);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Nome:
                </label>
                <input
                  className="block text-sm font-medium mb-1 text-black"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Telefone:
                </label>
                <input
                  className="block text-sm font-medium mb-1 text-black"
                  name="CPF"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  CPF:
                </label>
                <input
                  className="block text-sm font-medium mb-1 text-black"
                  name="TELEFONE"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-black">
                  Tipo de Serviço:
                </label>
                <select
                  name="tipoServico"
                  value={formData.tipoServico}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoServico: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded text-black"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Exame">Exame</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative m-4">
            <h3 className="text-xl font-semibold mb-4 text-center text-black">
              Confirmar Dados do Agendamento
            </h3>

            <ul className="text-black space-y-2">
              <li>
                <strong>Nome:</strong> {formData.nome}
              </li>
              <li>
                <strong>Telefone:</strong> {formData.telefone}
              </li>
              <li>
                <strong>CPF:</strong> {formData.cpf}
              </li>
              <li>
                <strong>Serviço:</strong> {formData.tipoServico}
              </li>
              <li>
                <strong>Horário:</strong> {selectedTime?.slice(0, 5)}
              </li>
            </ul>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  submitAgendamento({
                    formData,
                    selectedTime,
                    selectedDay,
                    onSuccess: () => {
                      alert("Agendamento confirmado!");
                      setShowConfirmModal(false);
                      setShowFormModal(false);
                    },
                    onError: () => {
                      alert("Erro ao confirmar agendamento.");
                    },
                  });
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarCard;
