import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetSalaryBenchmarksQuery } from "../../../redux/features/dashboardApi/dashboardApi";

const SalaryBenchmarksChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  void externalFilter;
  const { data, isLoading } = useGetSalaryBenchmarksQuery();

  const categories = data?.map((d) => d.level) ?? [];
  const values = data?.map((d) => d.avgSalary) ?? [];

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true },
    },
    dataLabels: { enabled: false },
    colors: ["#052e16"],
    xaxis: {
      categories,
      labels: {
        formatter: (val) => `${Number(val).toLocaleString()}`,
      },
    },
    tooltip: {
      y: { formatter: (val) => `৳ ${Number(val).toLocaleString()}` },
    },
    noData: { text: isLoading ? "Loading…" : "No salary data yet" },
  };

  const series = [{ name: "Avg Salary", data: values }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Salary Benchmarks</h3>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default SalaryBenchmarksChart;
