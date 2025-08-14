import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";

function Administracao() {
  const [numero, setNumero] = useState();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const controller = new AbortController();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/Empresa", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({ ID: 1 }),
        });

        const data = await res.json();
        setNumero(data.NUMERO[0].NUMERO);

        console.log(numero);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ml-[30vh] px-12 py-20">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 mb-10">
          Administração
        </h1>
        <p className="text-lg text-gray-900">Número: {numero}</p>
      </div>
    </section>
  );
}

export default Administracao;
