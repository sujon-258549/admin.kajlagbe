import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const InterviewSuccessChart = ({
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
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        hollow: { size: "55%" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "30px",
            fontWeight: "bold",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ["#052e16"],
    labels: ["Success Rate"],
  };

  const series = [67];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="text-lg font-bold text-gray-800">Interview Success</h3>
      </div>
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

export default InterviewSuccessChart;
