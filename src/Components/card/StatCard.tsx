import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  trend: string;
  trendUp?: boolean;
  period?: string;
  color?: string;
}

/**
 * A clean, smart stat card with simple design, smaller typography,
 * and no hover effects. Uses rounded-lg as requested.
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  period = "This Month",
  color = "#00B661",
}) => {
  const trendColor = trendUp ? "#10b981" : "#f43f5e";

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200  flex flex-col justify-between min-h-[130px]">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            {title}
          </h4>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {value}
          </h2>
        </div>

        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-base"
          style={{
            backgroundColor: `${color}10`,
            color: color,
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: trendUp
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(244, 63, 94, 0.1)",
            color: trendColor,
          }}
        >
          {trend}
        </span>
        <span className="text-gray-400 text-xs font-normal">{period}</span>
      </div>
    </div>
  );
};

export default StatCard;
