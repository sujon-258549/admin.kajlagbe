import { createBrowserRouter } from "react-router";
import MainLayout from "../mainLayout/MainLayout";
import Dashboard from "../Components/dashboard/Dashboard";
import EmployeeList from "../pages/employee/EmployeeList";
import NotFound from "../pages/error/NotFound";
import ErrorPage from "../pages/error/ErrorPage";
import RoleList from "../pages/users/RoleList";
import RolesPermissions from "../pages/users/RolesPermissions";
import DepartmentList from "../pages/users/DepartmentList";

import CategoryList from "../pages/category/CategoryList";
import SubCategoryList from "../pages/category/SubCategoryList";
import SubscriptionList from "../pages/subscription/SubscriptionList";
import JobList from "../pages/job/JobList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "employee/all",
        element: <EmployeeList />,
      },
      {
        path: "category/list",
        element: <CategoryList />,
      },
      {
        path: "sub/category",
        element: <SubCategoryList />,
      },
      {
        path: "users/roles",
        element: <RoleList />,
      },
      {
        path: "users/designations",
        element: <RolesPermissions />,
      },
      {
        path: "users/departments",
        element: <DepartmentList />,
      },
      {
        path: "subscription",
        element: <SubscriptionList />,
      },
      {
        path: "job/list",
        element: <JobList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
