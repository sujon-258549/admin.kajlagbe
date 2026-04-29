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
  faMagic,
  faNewspaper,
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
      { name: "All User", path: "/users/all", module: "Users" },
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
    name: "AI Agent",
    icon: faMagic,
    path: "/agent/generate",
    module: "AI Agent",
  },
  {
    name: "Setup Menu",
    icon: faCogs,
    path: "/setup",
    submenu: [
      { name: "General Settings", path: "/setup/general", module: "General Settings" },
      { name: "Business Setup", path: "/setup/business", module: "Business Setup" },
      { name: "Media", path: "/setup/media", module: "Media Library" },
    ],
  },
  {
    name: "Blog Management",
    icon: faNewspaper,
    path: "/blog",
    submenu: [
      { name: "Blog List", path: "/blog/list", module: "Blog" },
      { name: "Create Blog", path: "/blog/create", module: "Blog" },
    ],
  },
  {
    name: "CRM",
    icon: faUsers,
    path: "/crm",
    submenu: [
      { name: "User List", path: "/crm/user-list", module: "CRM" },
    ],
  },
];

export const usePermission = () => {
  const { user: currentUser, isLoading } = useMyData();
  const userPermissions = useMemo(() => currentUser?.role?.permissions || [], [currentUser]);
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
          return null; // Don't show parent if no submenu is visible and parent has no module
        }
        
        // For items without submenu, check their own module permission
        if (item.module) {
           return hasPermission(item.module, "view") || hasPermission(item.module, "list") ? item : null;
        }
        
        return null;
      })
      .filter(Boolean);
  }, [hasPermission]);

  return { filteredMenuItems, currentUser, isSuperAdmin, isLoading, hasPermission };
};

export const canActions = (
  permissions: any[],
  moduleName: string,
  action: string,
  userEmail?: string,
) => {
  if (userEmail === config.superAdminEmail) return true;
  if (!moduleName || !permissions) return false;

  const modulePerm = permissions.find(
    (p: any) => p.module.toLowerCase() === moduleName.toLowerCase(),
  );

  if (!modulePerm) return false;

  return modulePerm.permissions.some(
    (p: string) => p.toLowerCase() === action.toLowerCase(),
  );
};
