import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { getMonthDays } from "../utils/getMonthDays";
import CalendarCard from "./Cards/CalendarCard";
import { FaCalendarAlt, FaArrowCircleRight } from "react-icons/fa";

function App() {
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [agenda, setAgenda] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("current");

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const currentMonthName = now.toLocaleString("pt-BR", { month: "long" });
  const nextMonthName = new Date(nextYear, nextMonth).toLocaleString("pt-BR", {
    month: "long",
  });

  const HandleCallAgenda = async () => {
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:5000/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: 1 }),
      });

      if (!response.ok) throw new Error("Erro ao conectar");

      const data = await response.json();

      setShowAgenda(true);
      setAgenda(data.AGENDA);
      setResposta(data.mensagem || "Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      setResposta("Falha ao enviar mensagem. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <section className="bg-cover bg-center py-28 px-4 text-white">
        <div className="bg-black/50 p-10 max-w-2xl mx-auto rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à Home Page</h1>
          <p className="text-lg mb-6">
            Explore conteúdos, conecte-se com nosso mundo e descubra o que há de
            novo.
          </p>
          <a
            href="#sobre"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
          >
            Saiba Mais
          </a>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={HandleCallAgenda}
            className="inline-block bg-white text-orange-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
            disabled={carregando}
          >
            Fale Conosco
          </button>
          {resposta && <p className="mt-4 text-gray-800">{resposta}</p>}
        </div>
        {showAgenda && (
          <div className="fixed inset-0  z-50 bg-gray-100 p-8 overflow-y-auto flex flex-col items-center pt-20">
            <p className="text-2xl font-bold text-gray-800 mb-6 text-center w-full">
              📆 Agenda
            </p>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSelectedMonth("current")}
                className={`px-4 py-2 flex items-center gap-2 rounded ${
                  selectedMonth === "current"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                <FaCalendarAlt />
                Mês Atual
              </button>

              <button
                onClick={() => setSelectedMonth("next")}
                className={`px-4 py-2 flex items-center gap-2 rounded ${
                  selectedMonth === "next"
                    ? "bg-green-700 text-white"
                    : "bg-green-200 text-green-800"
                }`}
              >
                <FaArrowCircleRight />
                Próximo Mês
              </button>
            </div>

            <div className="flex flex-wrap justify-center">
              {selectedMonth === "current" && (
                <CalendarCard
                  monthName={currentMonthName}
                  month={currentMonth}
                  year={currentYear}
                  days={getMonthDays(currentMonth, currentYear)}
                  agenda={agenda}
                />
              )}
              {selectedMonth === "next" && (
                <CalendarCard
                  month={nextMonthName}
                  year={nextYear}
                  days={getMonthDays(nextMonth, nextYear)}
                  agenda={agenda}
                />
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
