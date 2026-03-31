import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const HiringVelocityChart = () => {
  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "stepline", width: 3 },
    colors: ["#f59e0b"],
    xaxis: { categories: ["W1", "W2", "W3", "W4", "W5", "W6"] },
    markers: { size: 5 },
    grid: { borderColor: "#f1f5f9" },
  };

  const series = [{ name: "Days to Hire", data: [45, 40, 35, 30, 25, 20] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Hiring Velocity</h3>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default HiringVelocityChart;


