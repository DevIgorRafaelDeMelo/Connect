import { useEffect, useState } from "react";
import Sidebar from "../Componets/Sidebar";
import LoadingSpinner from "../Componets/LoadingSpinner";

function Administracao() {
  const [numero, setNumero] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/Empresa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ID: 1 }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || "Erro na requisição");
        }

        const data = await res.json();
        setNumero(data.NUMERO);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);
  if (loading) return <LoadingSpinner texto="Buscando dados..." />;

  return (
    <section className="flex">
      <Sidebar />
      <div className="flex-1 ml-[30vh] p-32">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 mb-10">
          Administração
        </h1>

        <p className="text-lg text-gray-900">Número: {numero}</p>
      </div>
    </section>
  );
}

export default Administracao;
