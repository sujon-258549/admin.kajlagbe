import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetGrowthTimeseriesQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterLabel, filterToRange } from "../../../utils/dateRange";

const OrdersChart = ({ externalFilter }: { externalFilter?: FilterType }) => {
  const activeFilter = externalFilter || "this-week";
  const range = filterToRange(activeFilter);
  const { data, isLoading } = useGetGrowthTimeseriesQuery({ range });

  const categories = data?.map((d) => d.label) ?? [];
  const usersSeries = data?.map((d) => d.users) ?? [];
  const jobsSeries = data?.map((d) => d.jobs) ?? [];
  const appsSeries = data?.map((d) => d.applications) ?? [];

  const isHourly = activeFilter === "today" || activeFilter === "yesterday";

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, stacked: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: isHourly ? "80%" : "60%",
      },
    },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "right" },
    colors: ["#052e16", "#10b981", "#0ea5e9"],
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
        formatter: (val: string | number, index?: number) => {
          if (isHourly && index !== undefined) {
            return index % 3 === 0 ? String(val) : "";
          }
          return String(val);
        },
      },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    noData: { text: isLoading ? "Loading…" : "No data yet" },
  };

  const series = [
    { name: "Applications", data: appsSeries },
    { name: "Jobs", data: jobsSeries },
    { name: "Signups", data: usersSeries },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Platform Activity
          </h3>
          <p className="text-xs text-gray-400">
            Signups, jobs, applications · {filterLabel(activeFilter)}
          </p>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
};

export default OrdersChart;
