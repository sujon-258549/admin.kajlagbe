import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetHiringRateQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

const InterviewSuccessChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetHiringRateQuery({ range });

  const rate = data?.rate ?? 0;

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
    labels: ["Hiring Rate"],
    noData: { text: isLoading ? "Loading…" : "No data" },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-lg font-bold text-gray-800">Hiring Rate</h3>
      </div>
      <p className="text-xs text-gray-400 mb-2 self-start">
        {data ? `${data.accepted} hired of ${data.total} applications` : ""}
      </p>
      <div className="flex-1 w-full flex items-center justify-center">
        <Chart
          options={options}
          series={[rate]}
          type="radialBar"
          height={300}
        />
      </div>
    </div>
  );
};

export default InterviewSuccessChart;
