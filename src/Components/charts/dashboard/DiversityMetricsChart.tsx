import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const DiversityMetricsChart = () => {
  const options: ApexOptions = {
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: "22px" },
          value: { fontSize: "16px" },
          total: {
            show: true,
            label: "Diversity",
            formatter: () => "62%",
          },
        },
      },
    },
    labels: ["Gender", "Ethnicity", "Age"],
    colors: ["#ec4899", "#3b82f6", "#f59e0b"],
  };

  const series = [44, 55, 67];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-gray-800 self-start mb-4">
        Diversity Metrics
      </h3>
      <div className="flex-1 w-full flex items-center justify-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={300}
        />
      </div>
    </div>
  );
};

export default DiversityMetricsChart;


