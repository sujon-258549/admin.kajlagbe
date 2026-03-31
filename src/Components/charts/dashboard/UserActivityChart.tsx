import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const JobCategoryChart = ({
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
    chart: { type: "donut" },
    labels: ["Tech", "Design", "Marketing", "Sales", "Support"],
    colors: ["#052e16", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"],
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
              formatter: () => "4.2k",
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
  };

  const series = [40, 25, 15, 12, 8];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Jobs by Category</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Chart
          options={options}
          series={series}
          type="donut"
          width="100%"
          height={300}
        />
      </div>
    </div>
  );
};

export default JobCategoryChart;
