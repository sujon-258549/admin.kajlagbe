import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const TopLocationsChart = () => {
  const options: ApexOptions = {
    chart: { type: "pie" },
    labels: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
    colors: ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"],
    legend: { position: "bottom" },
    stroke: { show: false },
  };

  const series = [400, 200, 150, 100, 50];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Top Hiring Locations
      </h3>
      <Chart options={options} series={series} type="pie" height={300} />
    </div>
  );
};

export default TopLocationsChart;


