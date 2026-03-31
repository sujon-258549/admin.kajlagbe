import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const JobApplicationsChart = ({
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
    chart: {
      type: "area",
      toolbar: { show: false },
    },
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: { colors: "#94a3b8" },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
    },
    tooltip: { x: { show: false } },
  };

  const series = [{ name: "Applications", data: [45, 52, 38, 65, 48, 82, 70] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Job Applications</h3>
          <p className="text-xs text-gray-400">
            Activity based on selected range
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
            +12.4%
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="area" height={250} />
    </div>
  );
};

export default JobApplicationsChart;
