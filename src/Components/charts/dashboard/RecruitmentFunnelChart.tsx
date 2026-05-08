import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { FilterType } from "../../types";
import { useGetRecruitmentFunnelQuery } from "../../../redux/features/dashboardApi/dashboardApi";
import { filterToRange } from "../../../utils/dateRange";

const RecruitmentFunnelChart = ({
  externalFilter,
}: {
  externalFilter?: FilterType;
}) => {
  const range = filterToRange(externalFilter || "this-week");
  const { data, isLoading } = useGetRecruitmentFunnelQuery({ range });

  const categories = data?.map((d) => d.stage) ?? [];
  const values = data?.map((d) => d.value) ?? [];

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        barHeight: "80%",
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opt) =>
        `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`,
    },
    colors: ["#052e16"],
    xaxis: { categories },
    legend: { show: false },
    noData: { text: isLoading ? "Loading…" : "No applications yet" },
  };

  const series = [{ name: "Candidates", data: values }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Recruitment Funnel</h3>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default RecruitmentFunnelChart;
