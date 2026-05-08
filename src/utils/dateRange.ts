import type { FilterType } from "../Components/types";
import type { DateRangeKey } from "../redux/features/dashboardApi/dashboardApi";

export const filterToRange = (filter: FilterType): DateRangeKey => {
  switch (filter) {
    case "today":
      return "today";
    case "yesterday":
      return "yesterday";
    case "this-week":
      return "this-week";
    case "previous-week":
      return "last-week";
    case "this-month":
      return "this-month";
    case "previous-month":
      return "last-month";
    case "this-year":
      return "this-year";
    case "previous-year":
      return "all";
    case "custom":
    default:
      return "all";
  }
};

export const filterLabel = (filter: FilterType): string => {
  switch (filter) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "this-week":
      return "This Week";
    case "previous-week":
      return "Last Week";
    case "this-month":
      return "This Month";
    case "previous-month":
      return "Last Month";
    case "this-year":
      return "This Year";
    case "previous-year":
      return "Last Year";
    case "custom":
      return "Custom";
    default:
      return "This Period";
  }
};
