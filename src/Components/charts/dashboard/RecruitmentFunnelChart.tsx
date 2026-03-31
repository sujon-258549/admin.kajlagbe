import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const RecruitmentFunnelChart = ({
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
        borderRadius: 0,
        horizontal: true,
        barHeight: "80%",
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opt) =>
        opt.w.globals.labels[opt.dataPointIndex] + ":  " + val,
    },
    colors: ["#052e16"],
    xaxis: {
      categories: ["Sourced", "Screened", "Interviewed", "Technical", "Offer"],
    },
    legend: { show: false },
  };

  const series = [{ name: "Candidates", data: [500, 300, 150, 80, 20] }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200  h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Recruitment Funnel</h3>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default RecruitmentFunnelChart;
