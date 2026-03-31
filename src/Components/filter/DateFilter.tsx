import React, { useState } from "react";
import { Dropdown, Button, DatePicker } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export type FilterType =
  | "today"
  | "yesterday"
  | "this-week"
  | "previous-week"
  | "this-month"
  | "previous-month"
  | "this-year"
  | "previous-year"
  | "custom";

interface DateFilterProps {
  onFilterChange: (type: FilterType, range: [string, string]) => void;
  activeFilter?: FilterType;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onFilterChange,
  activeFilter = "this-week",
}) => {
  const [showRangePicker, setShowRangePicker] = useState(false);

  const getFilterRange = (type: FilterType): [string, string] => {
    const now = dayjs();
    switch (type) {
      case "today":
        return [now.format("YYYY-MM-DD"), now.format("YYYY-MM-DD")];
      case "yesterday":
        const yesterday = now.subtract(1, "day").format("YYYY-MM-DD");
        return [yesterday, yesterday];
      case "this-week":
        return [
          now.startOf("week").format("YYYY-MM-DD"),
          now.endOf("week").format("YYYY-MM-DD"),
        ];
      case "previous-week":
        const lastWeek = now.subtract(1, "week");
        return [
          lastWeek.startOf("week").format("YYYY-MM-DD"),
          lastWeek.endOf("week").format("YYYY-MM-DD"),
        ];
      case "this-month":
        return [
          now.startOf("month").format("YYYY-MM-DD"),
          now.endOf("month").format("YYYY-MM-DD"),
        ];
      case "previous-month":
        const lastMonth = now.subtract(1, "month");
        return [
          lastMonth.startOf("month").format("YYYY-MM-DD"),
          lastMonth.endOf("month").format("YYYY-MM-DD"),
        ];
      case "this-year":
        return [
          now.startOf("year").format("YYYY-MM-DD"),
          now.endOf("year").format("YYYY-MM-DD"),
        ];
      case "previous-year":
        const lastYear = now.subtract(1, "year");
        return [
          lastYear.startOf("year").format("YYYY-MM-DD"),
          lastYear.endOf("year").format("YYYY-MM-DD"),
        ];
      default:
        return [now.format("YYYY-MM-DD"), now.format("YYYY-MM-DD")];
    }
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "custom") {
      setShowRangePicker(true);
      return;
    }
    const type = key as FilterType;
    const range = getFilterRange(type);
    onFilterChange(type, range);
  };

  const items: MenuProps["items"] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "this-week", label: "This Week" },
    { key: "previous-week", label: "Previous Week" },
    { key: "this-month", label: "This Month" },
    { key: "previous-month", label: "Previous Month" },
    { key: "this-year", label: "This Year" },
    { key: "previous-year", label: "Previous Year" },
    { type: "divider" },
    { key: "custom", label: "Custom Range" },
  ];

  const filterLabels: Record<string, string> = {
    today: "Today",
    yesterday: "Yesterday",
    "this-week": "This Week",
    "previous-week": "Previous Week",
    "this-month": "This Month",
    "previous-month": "Previous Month",
    "this-year": "This Year",
    "previous-year": "Previous Year",
    custom: "Custom Range",
  };

  const currentLabel = filterLabels[activeFilter] || "Filter";

  return (
    <div className="flex items-center gap-2">
      {showRangePicker ? (
        <RangePicker
          size="small"
          className="border-gray-200 rounded-lg h-9"
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              onFilterChange("custom", [
                dates[0].format("YYYY-MM-DD"),
                dates[1].format("YYYY-MM-DD"),
              ]);
              setShowRangePicker(false);
            }
          }}
          onBlur={() => setShowRangePicker(false)}
          autoFocus
        />
      ) : (
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="border-gray-200 text-gray-600 rounded-lg hover:border-primary! hover:text-primary! transition-all flex items-center gap-2 h-9 px-3">
            <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
            <span className="text-sm font-medium">{currentLabel}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-[10px] opacity-50"
            />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default DateFilter;
