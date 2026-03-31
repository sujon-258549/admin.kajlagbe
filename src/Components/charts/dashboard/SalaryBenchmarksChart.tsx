import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const SalaryBenchmarksChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("this-week");

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
    }
  }, [externalFilter]);

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: { enabled: false },
    colors: ["#052e16"],
    xaxis: { categories: ["Junior", "Mid", "Senior", "Lead", "Manager"] },
  };

  const series = [{ name: "Avg Salary (k)", data: [45, 75, 110, 140, 160] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Salary Benchmarks</h3>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default SalaryBenchmarksChart;
