import { useState } from "react";
import { Tag, Tooltip, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "../../Components/Tables/DataTable";
import EmployeeModal, {
  type Employee,
} from "../../Components/modal/employ/EmployeeModal";
import CustomButton from "../../Components/ui/Button";
import CustomSwitch from "../../Components/ui/Switch";
import PageHeader from "../../Components/common/PageHeader";

// Mock initial data
const mockEmployees: Employee[] = [
  {
    _id: "1",
    name: "Sujon Ahmed",
    email: "sujon@kajlagbe.com",
    phone: "+880 1711 000001",
    designation: "UI Designer",
    department: "Design",
    role: "Admin",
    status: "Active",
  },
  {
    _id: "2",
    name: "Jane Doe",
    email: "jane@kajlagbe.com",
    phone: "+880 1711 000002",
    designation: "Full Stack Developer",
    department: "Engineering",
    role: "Employee",
    status: "Active",
  },
  {
    _id: "3",
    name: "Alex Hunter",
    email: "alex@kajlagbe.com",
    phone: "+880 1711 000003",
    designation: "QA Engineer",
    department: "Engineering",
    role: "Employee",
    status: "Inactive",
  },
  {
    _id: "4",
    name: "Sarah Connor",
    email: "sarah@kajlagbe.com",
    phone: "+880 1711 000004",
    designation: "HR Manager",
    department: "HR",
    role: "Manager",
    status: "Active",
  },
  {
    _id: "5",
    name: "Michael Ross",
    email: "michael@kajlagbe.com",
    phone: "+880 1711 000005",
    designation: "Product Manager",
    department: "Operations",
    role: "Support",
    status: "Active",
  },
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);
  const [viewData, setViewData] = useState<Employee | null>(null);

  // Open modal for Create
  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Open modal for Update
  const handleEdit = (record: Employee) => {
    setEditData(record);
    setModalOpen(true);
  };

  // Delete employee
  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e._id !== id));
  };

  // Change status toggle handler
  const handleStatusChange = (id: string, checked: boolean) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, status: checked ? "Active" : "Inactive" } : e,
      ),
    );
  };

  // Submit (create or update)
  const handleSubmit = (values: Omit<Employee, "_id">) => {
    if (editData) {
      // Update
      setEmployees((prev) =>
        prev.map((e) => (e._id === editData._id ? { ...e, ...values } : e)),
      );
    } else {
      // Create
      const newEmp: Employee = {
        _id: Date.now().toString(),
        ...values,
      };
      setEmployees((prev) => [newEmp, ...prev]);
    }
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: unknown, record: Employee) => (
        <div className="flex items-center gap-2">
          {/* View */}
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => setViewData(record)}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit Employee">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleEdit(record)}
              icon={
                <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
              }
            />
          </Tooltip>

          {/* Delete */}
          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <CustomButton
                variant="danger-outline"
                size="icon-sm"
                icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Employee) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://i.pravatar.cc/150?u=${record.email}`}
            alt={name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
            {name}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{email}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{phone}</span>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (d: string) => (
        <span
          className="text-xs font-semibold text-white whitespace-nowrap px-3 py-1 rounded-sm"
          style={{ backgroundColor: "#052e16" }}
        >
          {d}
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => (
        <Tag
          style={{
            backgroundColor: "#f0fdf4",
            color: "#052e16",
            border: "1px solid #dcfce7",
            borderRadius: "4px",
          }}
          className=" px-3 font-medium"
        >
          {dept}
        </Tag>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="text-sm text-gray-800 font-medium whitespace-nowrap">
          {role}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Employee) => (
        <CustomSwitch
          checked={status === "Active"}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          size="default"
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Employees" }]}
        title="All Employees"
        subTitle="Manage employee records, roles, and statuses"
        extra={
          <CustomButton
            onClick={handleCreate}
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add Employee
          </CustomButton>
        }
      />

      {/* Table Card */}
      <div className="">
        <DataTable
          data={employees}
          columns={columns}
          isPaginate={true}
          showHeader={true}
        />
      </div>

      {/* Create / Update Modal */}
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
      />

      {/* View Details Modal */}
      {viewData && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setViewData(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <img
                src={`https://i.pravatar.cc/150?u=${viewData.email}`}
                alt={viewData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {viewData.name}
                </h3>
                <p className="text-sm text-gray-500">{viewData.designation}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Email", value: viewData.email },
                { label: "Phone", value: viewData.phone },
                { label: "Department", value: viewData.department },
                { label: "Role", value: viewData.role },
                { label: "Status", value: viewData.status },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2 border-b border-gray-50"
                >
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setViewData(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
