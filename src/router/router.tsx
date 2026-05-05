import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../mainLayout/MainLayout";
import Dashboard from "../Components/dashboard/Dashboard";
import EmployeeList from "../pages/employee/EmployeeList";
import NotFound from "../pages/error/NotFound";
import ErrorPage from "../pages/error/ErrorPage";
import RoleList from "../pages/users/RoleList";
import RolesPermissions from "../pages/users/RolesPermissions";
import DepartmentList from "../pages/users/DepartmentList";
import UserList from "../pages/users/UserList";
import UserDetails from "../pages/users/UserDetails";

import CategoryList from "../pages/category/CategoryList";
import SubCategoryList from "../pages/category/SubCategoryList";
import SubscriptionList from "../pages/subscription/SubscriptionList";
import JobList from "../pages/job/JobList";
import CreateJob from "../pages/job/CreateJob";
import JobDetails from "../pages/job/JobDetails";
import FolderList from "../pages/media/FolderList";
import WorkTypeList from "../pages/work-type/WorkTypeList";
import EmployeeDetails from "../pages/employee/EmployeeDetails";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "../mainLayout/ProtectedRoute";
import ProfileView from "../pages/profile/ProfileView";
import ProfileEdit from "../pages/profile/ProfileEdit";
import AgentGenerate from "../pages/agent/AgentGenerate";
import CrmUserList from "../pages/crm/CrmUserList";
import BlogList from "../pages/blog/BlogList";
import CreateBlog from "../pages/blog/CreateBlog";
import BlogDetails from "../pages/blog/BlogDetails";
import BlogCommentList from "../pages/blog/BlogCommentList";
import ContactList from "../pages/contact/ContactList";
import TenantList from "../pages/tenant/TenantList";
import ActivityLogList from "../pages/logs/ActivityLogList";
import ErrorLogList from "../pages/logs/ErrorLogList";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
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
        path: "agent/generate",
        element: <AgentGenerate />,
      },
      {
        path: "users/all",
        element: <UserList />,
      },
      {
        path: "users/:id",
        element: <UserDetails />,
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
        path: "job/create",
        element: <CreateJob />,
      },
      {
        path: "job/edit/:id",
        element: <CreateJob />,
      },
      {
        path: "job/details/:id",
        element: <JobDetails />,
      },
      {
        path: "setup/media",
        element: <FolderList />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
      {
        path: "profile/edit",
        element: <ProfileEdit />,
      },
      {
        path: "crm/user-list",
        element: <CrmUserList />,
      },
      {
        path: "blog/list",
        element: <BlogList />,
      },
      {
        path: "blog/comments/:blogId",
        element: <BlogCommentList />,
      },
      {
        path: "blog/create",
        element: <CreateBlog />,
      },
      {
        path: "blog/edit/:id",
        element: <CreateBlog />,
      },
      {
        path: "blog/details/:id",
        element: <BlogDetails />,
      },
      {
        path: "contact/list",
        element: <ContactList />,
      },
      {
        path: "tenant/list",
        element: <TenantList />,
      },
      {
        path: "logs/activity",
        element: <ActivityLogList />,
      },
      {
        path: "logs/errors",
        element: <ErrorLogList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
