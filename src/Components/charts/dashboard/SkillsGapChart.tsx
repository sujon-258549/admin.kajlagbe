import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const SkillsGapChart = () => {
  const options: ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors: ["#6366f1"],
    xaxis: {
      categories: ["React", "Vue", "Angular", "Node", "Python", "Go"],
    },
    grid: { padding: { right: 20 } },
  };

  const series = [
    { name: "Team A", data: [10, 20, 30, 40, 50, 60] },
    { name: "Team B", data: [20, 30, 40, 50, 60, 70] },
    { name: "Team C", data: [30, 40, 50, 60, 70, 80] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Skills Density</h3>
      <Chart options={options} series={series} type="heatmap" height={300} />
    </div>
  );
};

export default SkillsGapChart;


