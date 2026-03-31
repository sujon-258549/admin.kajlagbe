import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const CandidateExperienceChart = () => {
  const options: ApexOptions = {
    chart: { type: "radar", toolbar: { show: false } },
    colors: ["#6366f1"],
    xaxis: {
      categories: [
        "UI/UX",
        "Frontend",
        "Backend",
        "Logic",
        "Design",
        "Testing",
      ],
    },
    markers: { size: 0 },
    fill: { opacity: 0.2 },
    stroke: { width: 2 },
    yaxis: { show: false },
  };

  const series = [{ name: "Skill Level", data: [80, 50, 30, 40, 100, 20] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Candidate Skills</h3>
      <Chart options={options} series={series} type="radar" height={300} />
    </div>
  );
};

export default CandidateExperienceChart;


