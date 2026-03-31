import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const CategorySalesChart = () => {
  const options: ApexOptions = {
    chart: { type: "pie" },
    labels: ["Electronics", "Fashion", "Home", "Beauty"],
    colors: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"],
    legend: { position: "bottom" },
    stroke: { show: false },
  };

  const series = [44, 33, 13, 10];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 ">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Category Sales</h3>
      <Chart options={options} series={series} type="pie" height={280} />
    </div>
  );
};

export default CategorySalesChart;


