import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetJobsByCategoryQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

const PALETTE = [
  "#052e16",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#0ea5e9",
  "#ec4899",
  "#14b8a6",
];

const JobCategoryChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetJobsByCategoryQuery({ range });

  const labels = data?.map((d) => d.label) ?? [];
  const series = data?.map((d) => d.value) ?? [];
  const total = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: { type: "donut" },
    labels,
    colors: PALETTE.slice(0, Math.max(labels.length, 1)),
    legend: { position: "bottom", fontSize: "12px" },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Jobs",
              fontSize: "12px",
              color: "#94a3b8",
              formatter: () => total.toLocaleString(),
            },
            value: {
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1e293b",
              show: true,
            },
          },
        },
      },
    },
    noData: { text: isLoading ? "Loading…" : "No jobs yet" },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Jobs by Category</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Chart
          options={options}
          series={series.length ? series : [0]}
          type="donut"
          width="100%"
          height={300}
        />
      </div>
    </div>
  );
};

export default JobCategoryChart;
