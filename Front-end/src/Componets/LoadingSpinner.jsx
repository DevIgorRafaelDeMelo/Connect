import React from "react";

const LoadingSpinner = ({ texto = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-600 border-opacity-50"></div>
      <p className="mt-4 text-blue-400 font-medium text-lg">{texto}</p>
    </div>
  );
};

export default LoadingSpinner;
