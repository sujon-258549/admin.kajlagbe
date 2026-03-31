import { useState, useEffect } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { type FilterType } from "../../filter/DateFilter";

const OrdersChart = ({ externalFilter }: { externalFilter?: FilterType }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("this-week");

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
    }
  }, [externalFilter]);

  // Mock data generator based on filter type
  const getChartData = (type: FilterType) => {
    switch (type) {
      case "today":
      case "yesterday":
        return {
          categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          data: Array.from(
            { length: 24 },
            () => Math.floor(Math.random() * 20) + 5,
          ),
          title: type === "today" ? "Today's Orders" : "Yesterday's Orders",
          unit: "Hour",
        };
      case "this-week":
      case "previous-week":
        return {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [44, 55, 41, 67, 22, 43, 38],
          title:
            type === "this-week" ? "Weekly Orders" : "Previous Week Orders",
          unit: "Day",
        };
      case "this-month":
      case "previous-month":
        return {
          categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
          data: [210, 315, 240, 410],
          title:
            type === "this-month" ? "Monthly Orders" : "Previous Month Orders",
          unit: "Week",
        };
      case "this-year":
      case "previous-year":
        return {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          data: [450, 520, 601, 652, 637, 712, 791, 804, 765, 821, 910, 954],
          title:
            type === "this-year" ? "Yearly Orders" : "Previous Year Orders",
          unit: "Month",
        };
      default:
        return {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [44, 55, 41, 67, 22, 43, 38],
          title: "Orders",
          unit: "Day",
        };
    }
  };

  const currentData = getChartData(activeFilter);

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth:
          activeFilter.includes("today") || activeFilter.includes("yesterday")
            ? "80%"
            : "50%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    colors: ["#052e16"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.9,
        opacityTo: 1,
      },
    },
    xaxis: {
      categories: currentData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
        // Show only every 3rd label for 24h to avoid overcrowding
        formatter: (val: string | number, index?: number) => {
          if (
            (activeFilter.includes("today") ||
              activeFilter.includes("yesterday")) &&
            index !== undefined
          ) {
            return index % 3 === 0 ? val.toString() : "";
          }
          return val.toString();
        },
      },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
  };

  const series = [{ name: "Orders", data: currentData.data }];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {currentData.title}
          </h3>
          <p className="text-xs text-gray-400">
            Total orders by {currentData.unit}
          </p>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
};

export default OrdersChart;
