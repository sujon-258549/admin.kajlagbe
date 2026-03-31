import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const GrowthChart = () => {
  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { width: 4, curve: "smooth" },
    colors: ["#052e16"],
    xaxis: {
      categories: ["W1", "W2", "W3", "W4"],
      axisBorder: { show: false },
    },
    markers: { size: 6, colors: ["#8b5cf6"], strokeWidth: 0 },
    grid: { show: true, borderColor: "#f1f5f9" },
  };

  const series = [{ name: "Growth", data: [4, 12, 18, 35] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 ">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Growth</h3>
      <Chart options={options} series={series} type="line" height={250} />
    </div>
  );
};

export default GrowthChart;
