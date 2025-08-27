import React, { useEffect } from "react";

const PopupConfirmacao = ({ mensagem, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        onClose();
      } catch (e) {
        console.error("Erro ao fechar popup:", e);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-blue-100 border border-blue-300 text-blue-900 px-6 py-4 rounded shadow-md flex items-center gap-3 animate-slide-in">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-semibold">{mensagem}</span>
      </div>
    </div>
  );
};

export default PopupConfirmacao;
