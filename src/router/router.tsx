import { createBrowserRouter } from "react-router-dom";
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
import FolderList from "../pages/media/FolderList";
import WorkTypeList from "../pages/work-type/WorkTypeList";
import EmployeeDetails from "../pages/employee/EmployeeDetails";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../mainLayout/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
        path: "employee/:id",
        element: <EmployeeDetails />,
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
        path: "users/work-types",
        element: <WorkTypeList />,
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
        path: "setup/media",
        element: <FolderList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
