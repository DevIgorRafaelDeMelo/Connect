import React from "react";
import {
  UserIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-500" },
  gray: { bg: "bg-gray-100", text: "text-gray-600" },
};

const iconMap = {
  total: <UserIcon className="h-6 w-6 text-blue-700" />,
  hoje: <ClockIcon className="h-6 w-6 text-gray-600" />,
  pendentes: <XCircleIcon className="h-6 w-6 text-yellow-500" />,
  finalizados: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
};

const InfoCard = ({ title, value, color = "gray", iconKey }) => {
  const colors = colorMap[color] || colorMap.gray;
  const icon = iconMap[iconKey] || null;

  return (
    <div className={`${colors.bg} p-5 rounded-lg shadow-sm`}>
      <div className="text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className={`${colors.text} text-3xl font-bold`}>{value}</p>
    </div>
  );
};

export default InfoCard;
