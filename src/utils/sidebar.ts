import { useMemo, useCallback } from "react";
import {
  faTableColumns,
  faUsers,
  faBriefcase,
  faBuilding,
  faCogs,
  faToolbox,
  faIndustry,
  faChartLine,
  faTasksAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useMyData } from "../redux/hooks";
import { config } from "../config";

export const menuItems = [
  { name: "Dashboard", icon: faTableColumns, path: "/", module: "Dashboard" },
  {
    name: "User Management",
    icon: faUsers,
    path: "/users",
    submenu: [
      { name: "All Employee", path: "/employee/all", module: "Employees" },
      { name: "Roles", path: "/users/roles", module: "Roles" },
      {
        name: "Departments",
        path: "/users/departments",
        module: "Departments",
      },
      { name: "Work Types", path: "/users/work-types", module: "Work Types" },
    ],
  },
  {
    name: "Category",
    icon: faBriefcase,
    path: "/category",
    submenu: [
      { name: "Category", path: "/category/list", module: "Categories" },
      { name: "SubCategory", path: "/sub/category", module: "SubCategories" },
    ],
  },
  {
    name: "Job Management",
    icon: faBuilding,
    path: "/job",
    module: "Job Management",
    submenu: [
      { name: "Job List", path: "/job/list", module: "Job Management" },
    ],
  },
  {
    name: "Subscription",
    icon: faTasksAlt,
    path: "/subscription",
    module: "Subscription",
  },
  {
    name: "Apply Job",
    icon: faToolbox,
    path: "/apply-job",
    module: "Apply Job",
    submenu: [
      { name: "Apply Job List", path: "/apply-job/list", module: "Apply Job" },
      {
        name: "Apply Job Categories",
        path: "/apply-job/categories",
        module: "Apply Job",
      },
    ],
  },
  {
    name: "Productions",
    icon: faIndustry,
    path: "/productions",
    module: "Productions",
    submenu: [
      {
        name: "Production Plan",
        path: "/productions/plan",
        module: "Productions",
      },
      {
        name: "Work Orders",
        path: "/productions/work-orders",
        module: "Productions",
      },
    ],
  },
  {
    name: "Sales Management",
    icon: faChartLine,
    path: "/sales",
    module: "Sales Management",
    submenu: [
      {
        name: "Sales Summary",
        path: "/sales/summary",
        module: "Sales Management",
      },
      {
        name: "Customer Ledger",
        path: "/sales/ledger",
        module: "Sales Management",
      },
    ],
  },
  {
    name: "Setup Menu",
    icon: faCogs,
    path: "/setup",
    module: "Settings",
    submenu: [
      { name: "General Settings", path: "/setup/general", module: "Settings" },
      { name: "Business Setup", path: "/setup/business", module: "Settings" },
      { name: "Media", path: "/setup/media", module: "Settings" },
    ],
  },
];

export const usePermission = () => {
  const { user: currentUser, isLoading } = useMyData();
  const userPermissions = currentUser?.role?.permissions || [];
  const isSuperAdmin = currentUser?.email === config.superAdminEmail;

  const hasPermission = useCallback((moduleName: string, action: string) => {
    if (isSuperAdmin) return true;
    if (!moduleName) return false;

    const modulePerm = userPermissions.find(
      (p: any) => p.module.toLowerCase() === moduleName.toLowerCase()
    );

    if (!modulePerm) return false;

    return modulePerm.permissions.some(
      (p: string) => p.toLowerCase() === action.toLowerCase()
    );
  }, [userPermissions, isSuperAdmin]);

  return { hasPermission, isLoading, isSuperAdmin, currentUser, userPermissions };
};

export const useFilteredMenuItems = () => {
  const { hasPermission, isLoading, isSuperAdmin, currentUser } = usePermission();

  const filteredMenuItems = useMemo(() => {
    return menuItems
      .map((item) => {
        if (item.submenu) {
          const visibleSubmenu = item.submenu.filter((sub) =>
            hasPermission(sub.module || "", "view") || hasPermission(sub.module || "", "list"),
          );
          if (visibleSubmenu.length > 0) {
            return { ...item, submenu: visibleSubmenu };
          }
          return hasPermission(item.module || "", "view") || hasPermission(item.module || "", "list") ? item : null;
        }
        return hasPermission(item.module || "", "view") || hasPermission(item.module || "", "list") ? item : null;
      })
      .filter(Boolean);
  }, [hasPermission]);

  return { filteredMenuItems, currentUser, isSuperAdmin, isLoading, hasPermission };
};
