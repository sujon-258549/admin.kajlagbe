import { useState } from "react";
import { Tag, Tooltip, Popconfirm, message } from "antd";
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
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "../../redux/features/employApi/employApi";
import type { CreateEmployeeRequest, EmployeeModalSubmit, UpdateEmployeeRequest } from "../../Components/types";
import { ROLE_LABELS } from "../../Components/types";
import { resolveProfileAge } from "../../Components/utils/ageFromDob";

const EmployeeList = () => {
  const { data: employees = [], isLoading, isFetching, refetch } =
    useGetAllEmployeesQuery({});
  const [, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);
  const [viewData, setViewData] = useState<Employee | null>(null);

  const { data: editDetail, isFetching: editDetailLoading } = useGetEmployeeByIdQuery(
    editData?.id ?? "",
    { skip: !modalOpen || !editData?.id },
  );

  const tableLoading =
    isLoading || isFetching || isCreating || isUpdating || isDeleting;

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: Employee) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id).unwrap();
      message.success("Employee deleted");
    } catch {
      message.error("Could not delete employee");
    }
  };

  const handleStatusChange = async (record: Employee, checked: boolean) => {
    try {
      await updateEmployee({
        id: record.id,
        data: { isActive: checked },
      }).unwrap();
      message.success(checked ? "Activated" : "Deactivated");
    } catch {
      message.error("Could not update status");
      refetch();
    }
  };

  const handleSubmit = async (values: EmployeeModalSubmit) => {
    try {
      if (editData) {
        const data: UpdateEmployeeRequest = {
          email: values.email.trim().toLowerCase(),
          mobile: values.mobile,
          role: values.role,
          isActive: values.isActive,
          isVerified: values.isVerified,
          departmentId: values.departmentId ?? null,
          profile: {
            name: values.name.trim(),
            gender: values.gender ?? null,
            age: resolveProfileAge(values.dob, values.age),
            dob: values.dob?.trim() ? values.dob.trim() : null,
            bloodGroup: values.bloodGroup ?? null,
            photo: values.profilePhotoUrl?.trim() ? values.profilePhotoUrl.trim() : null,
            nid: values.nid?.trim() ? values.nid.trim() : null,
          },
          address: {
            division: values.division?.trim() ? values.division.trim() : null,
            district: values.district?.trim() ? values.district.trim() : null,
            upazila: values.upazila?.trim() ? values.upazila.trim() : null,
            address: values.addressLine?.trim() ? values.addressLine.trim() : null,
          },
          workInfo: {
            experience: values.designation.trim() || null,
            workType: values.department.trim() || null,
            categories: values.categories
              ? values.categories
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
            availableTime: values.availableTime?.trim()
              ? values.availableTime.trim()
              : null,
          },
        };
        if (values.password) {
          data.password = values.password;
        }
        await updateEmployee({ id: editData.id, data }).unwrap();
        message.success("Employee updated");
      } else {
        if (!values.password) {
          message.error("Password is required for new users");
          return;
        }
        const body: CreateEmployeeRequest = {
          email: values.email.trim().toLowerCase(),
          password: values.password,
          mobile: values.mobile,
          name: values.name.trim(),
          role: values.role,
          isActive: values.isActive,
          isVerified: values.isVerified,
          departmentId: values.departmentId,
          designation: values.designation.trim(),
          department: values.department.trim(),
          gender: values.gender,
          age: resolveProfileAge(values.dob, values.age) ?? undefined,
          dob: values.dob,
          bloodGroup: values.bloodGroup,
          profilePhotoUrl: values.profilePhotoUrl,
          nid: values.nid,
          division: values.division,
          district: values.district,
          upazila: values.upazila,
          address: values.addressLine,
          categories: values.categories,
          availableTime: values.availableTime,
        };

        console.log("body", body);

        // await createEmployee(body).unwrap();
        message.success("Employee created");
      }
      setModalOpen(false);
      setEditData(null);
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data &&
        typeof (err.data as { message: unknown }).message === "string"
          ? (err.data as { message: string }).message
          : "Request failed";
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: unknown, record: Employee) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Details">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => setViewData(record)}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>

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

          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
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
      render: (role: Employee["role"]) => (
        <span className="text-sm text-gray-800 font-medium whitespace-nowrap">
          {ROLE_LABELS[role]}
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
          onChange={(checked) => handleStatusChange(record, checked)}
          size="default"
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Employees" }]}
        title="All Employees"
        subTitle="User + Profile + WorkInfo (Prisma) via /employ API"
        extra={
          <CustomButton
            onClick={handleCreate}
            variant="primary"
            size="sm"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add Employee
          </CustomButton>
        }
      />

      <div className="">
        <DataTable
          data={employees}
          columns={columns}
          rowKey="id"
          isPaginate={true}
          showHeader={true}
          loading={tableLoading}
        />
      </div>

      <EmployeeModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
        editDetail={editDetail ?? null}
        detailLoading={editDetailLoading}
        submitting={isCreating || isUpdating}
      />

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
                { label: "Role", value: ROLE_LABELS[viewData.role] },
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
              type="button"
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
