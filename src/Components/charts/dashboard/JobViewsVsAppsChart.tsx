import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const JobViewsVsAppsChart = () => {
  const options: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { width: [0, 4] },
    colors: ["#94a3b8", "#6366f1"],
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    yaxis: [
      { title: { text: "Views" } },
      { opposite: true, title: { text: "Apps" } },
    ],
    labels: ["Views", "Apps"],
  };

  const series = [
    {
      name: "Views",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201],
    },
    { name: "Apps", type: "line", data: [23, 42, 35, 27, 43, 22, 17] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Views vs Applications
      </h3>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default JobViewsVsAppsChart;


