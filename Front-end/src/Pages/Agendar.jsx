import React, { useState, useEffect } from "react";
import Sidebar from "../Componets/Sidebar";
import CalendarCard from "../Componets/CalendarCard";
import { getMonthDays } from "../../utils/getMonthDays";
import LoadingSpinner from "../Componets/LoadingSpinner";

function Agendar() {
  const [agenda, setAgenda] = useState([]);

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

  useEffect(() => {
    const fetchAgenda = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/agenda", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID: 1 }),
        });

        if (!response.ok) throw new Error("Erro ao conectar");

        const data = await response.json();

        setAgenda(data.AGENDA);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchAgenda();
  }, [agenda]);

  if (!agenda) return <LoadingSpinner texto="Buscando dados..." />;


  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 p-8 w-[70vh] ms-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
          Agendar
        </h1>

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
            <CalendarCard
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
    </section>
  );
}

export default Agendar;
