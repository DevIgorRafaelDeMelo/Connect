import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { getMonthDays } from "../utils/getMonthDays";
import CalendarCardClient from "./Componets/CalendarCardClient";

function Home() {
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false); 
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const getNext12Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = date.toLocaleString("default", { month: "long" });
      months.push({
        label: `${monthName} ${date.getFullYear()}`,
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    return months;
  };

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

      const data = await response.json();

      setShowAgenda(true);
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
            <div className="flex justify-center pb-10">
              <div className="relative w-full max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 10h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <select
                  onChange={(e) => {
                    const [month, year] = e.target.value.split("-");
                    setSelectedMonth({
                      month: parseInt(month),
                      year: parseInt(year),
                    });
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-blue-300 text-blue-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {getNext12Months().map(({ label, month, year }) => (
                    <option key={`${month}-${year}`} value={`${month}-${year}`}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="  flex flex-col items-center  ">
              <div className="w-[100vh] ">
                <CalendarCardClient
                  monthName={new Date(
                    selectedMonth.year,
                    selectedMonth.month
                  ).toLocaleString("default", { month: "long" })}
                  month={selectedMonth.month}
                  year={selectedMonth.year}
                  days={getMonthDays(selectedMonth.month, selectedMonth.year)}
                  admin={true}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
