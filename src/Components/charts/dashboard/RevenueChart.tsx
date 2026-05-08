import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetGrowthTimeseriesQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

const JobApplicationsChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetGrowthTimeseriesQuery({ range });

  const categories = data?.map((d) => d.label) ?? [];
  const seriesData = data?.map((d) => d.applications) ?? [];

  const total = seriesData.reduce((a, b) => a + b, 0);
  const half = Math.floor(seriesData.length / 2);
  const first = seriesData.slice(0, half).reduce((a, b) => a + b, 0);
  const second = seriesData.slice(half).reduce((a, b) => a + b, 0);
  const trend =
    first === 0
      ? second > 0
        ? 100
        : 0
      : Number((((second - first) / first) * 100).toFixed(1));

  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#052e16"],
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      tickAmount: 4,
      labels: { style: { colors: "#94a3b8" } },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
    },
    tooltip: { x: { show: false } },
    noData: { text: isLoading ? "Loading…" : "No applications yet" },
  };

  const series = [{ name: "Applications", data: seriesData }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Job Applications</h3>
          <p className="text-xs text-gray-400">
            {total} total · activity in selected range
          </p>
        </div>
        <span
          className={`px-3 py-1 text-[10px] font-bold rounded-full ${
            trend >= 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </span>
      </div>
      <Chart options={options} series={series} type="area" height={250} />
    </div>
  );
};

export default JobApplicationsChart;
