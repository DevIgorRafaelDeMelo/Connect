import React from "react";
import Sidebar from "../Componets/Sidebar";

function Administracao() {
  return (
    <section className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 ms-[30vh] py-20 p-48">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3 pb-20">
          Administração
        </h1>
      </div>
    </section>
  );
}

export default Administracao;
