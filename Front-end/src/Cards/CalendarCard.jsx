import { useState } from "react";

const CalendarCard = ({ month, year, days, agenda }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

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
            {/* Título do dia selecionado */}
            <h2 className="text-2xl font-bold text-black text-center mb-4">
              Horários disponíveis em {selectedDay.day}/{selectedDay.month + 1}/
              {selectedDay.year}
            </h2>

            {/* Botão de fechar posicionado no topo direito */}
            <button
              onClick={() => setSelectedDay(null)}
              title="Fechar"
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
            >
              ✕
            </button>

            {/* Grade de horários */}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
              title="Fechar"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center text-black">
              Agendar horário {selectedTime?.slice(0, 5)} {selectedDay.day}
            </h3>

            {/* Seu formulário aqui */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Agendado!");
                setShowFormModal(false);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nome:</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Telefone:
                </label>
                <input
                  type="tel"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
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
    </div>
  );
};

export default CalendarCard;
