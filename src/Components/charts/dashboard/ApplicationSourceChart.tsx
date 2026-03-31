import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const ApplicationSourceChart = () => {
  const options: ApexOptions = {
    legend: { show: false },
    chart: { type: "treemap", toolbar: { show: false } },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
  };

  const series = [
    {
      data: [
        { x: "LinkedIn", y: 218 },
        { x: "Indeed", y: 149 },
        { x: "Web", y: 184 },
        { x: "Referral", y: 55 },
        { x: "Facebook", y: 34 },
      ],
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Application Sources
      </h3>
      <Chart options={options} series={series} type="treemap" height={300} />
    </div>
  );
};

export default ApplicationSourceChart;


