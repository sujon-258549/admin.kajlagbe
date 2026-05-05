import { Modal, Form, Select, Spin, Divider, TimePicker, DatePicker } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useMemo, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import MediaLibraryImageUploader from "../../ui/MediaLibraryImageUploader";
import { useGetAllDepartmentsQuery } from "../../../redux/features/departmentApi/departmentApi";
import { useGetAllRolesQuery } from "../../../redux/features/roleApi/roleApi";
import { useGetAllSubCategoryQuery } from "../../../redux/features/subCategoryApi/subCategoryApi";
import { useGetAllWorkTypesQuery } from "../../../redux/features/workTypeApi/workTypeApi";
import {
  BLOOD_GROUP_LABELS,
  GENDER_LABELS,
  PRISMA_BLOOD_GROUPS,
  PRISMA_GENDERS,
  ROLE_LABELS,
  deriveRoleString,
  isPrismaRole,
  type EmployApiUser,
  type EmployeeModalSubmit,
  type EmployeeRow,
  type PrismaBloodGroup,
  type PrismaGender,
  type TRole,
} from "../../types";
import { resolveProfileAge } from "../../utils/ageFromDob";

const { Option } = Select;

function roleSelectLabel(roleKey: string): string {
  const raw = roleKey?.trim() ?? "";
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (isPrismaRole(upper)) return ROLE_LABELS[upper];
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type Employee = EmployeeRow;

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeModalSubmit) => void | Promise<void>;
  editData?: EmployeeRow | null;
  /** Full user from GET /employ/:id — fills Profile, Address, WorkInfo. */
  editDetail?: EmployApiUser | null;
  detailLoading?: boolean;
  submitting?: boolean;
}

type FormValues = {
  name: string;
  email: string;
  mobile: string;
  roleId: string;
  isActive: boolean;
  isVerified: boolean;
  departmentId?: string;
  designation: string;
  department: string[]; // Used for workTypeIds
  workStartTime?: string;
  workEndTime?: string; // Maps to workTimeLimit
  password?: string;
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  profilePhotoUrl?: string;
  photoId?: string;
  nid?: string;
  nidPhotoUrls?: string[];
  nidPhotoIds?: string[];
  division?: string;
  district?: string;
  upazila?: string;
  addressLine?: string;
  subCategoryIds?: string[];
  workTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  availableTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
};

type FormShape = FormValues & { confirmPassword?: string };

const normalizeMobile = (phone: string) => phone.replace(/\s+/g, "").trim();

const EmployeeModal = ({
  open,
  onClose,
  onSubmit,
  editData,
  editDetail,
  detailLoading = false,
  submitting = false,
}: EmployeeModalProps) => {
  const [form] = Form.useForm<FormShape>();
  const isEdit = !!editData;
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const profilePhotoUrl = Form.useWatch("profilePhotoUrl", form);
  const nidPhotoUrls = Form.useWatch("nidPhotoUrls", form);

  const { data: deptResponse, isFetching: deptLoading } =
    useGetAllDepartmentsQuery({}, { skip: !open });

  const departments = useMemo(
    () => (deptResponse?.data ?? []).filter((d) => d.isActive !== false),
    [deptResponse?.data],
  );

  const { data: rolesResponse, isFetching: rolesLoading } = useGetAllRolesQuery(
    {},
    { skip: !open },
  );

  const { data: subCategoryResponse, isFetching: subCategoryLoading } =
    useGetAllSubCategoryQuery({}, { skip: !open });

  const subCategories = useMemo(
    () => (subCategoryResponse?.data ?? []).filter((s) => s.status !== false),
    [subCategoryResponse?.data],
  );

  const { data: workTypesResponse } = useGetAllWorkTypesQuery(undefined, {
    skip: !open,
  });

  const workTypes = useMemo(
    () => (workTypesResponse || []).filter((w: any) => w.isActive),
    [workTypesResponse],
  );

  const roleSelectOptions = useMemo((): TRole[] => {
    const fromApi = (rolesResponse?.data ?? [])
      .filter((r) => r.isActive)
      .slice();
    fromApi.sort((a, b) => a.role.localeCompare(b.role));

    // We use IDs for comparison now
    const keys = new Set(fromApi.map((r) => r.id));

    // Get current role ID if editing
    let currentRoleId: string | undefined;
    if (isEdit) {
      if (editDetail) {
        currentRoleId =
          editDetail.roleId ||
          (typeof editDetail.role === "object"
            ? editDetail.role.id
            : undefined);
      }
    }

    if (currentRoleId && !keys.has(currentRoleId)) {
      const roleName = editDetail
        ? deriveRoleString(editDetail)
        : editData?.role || "";
      fromApi.unshift({
        id: currentRoleId,
        role: roleName,
        isActive: true,
        createdAt: "",
      });
    }
    return fromApi;
  }, [rolesResponse?.data, isEdit, editDetail, editData?.role]);

  useEffect(() => {
    if (!open) return;
    if (!editData) {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        isVerified: false,
        roleId:
          (rolesResponse?.data ?? []).find((r) => r.role === "EMPLOYEE")?.id ||
          "EMPLOYEE",
      });
      return;
    }

    const src = editDetail;
    if (src) {
      form.setFieldsValue({
        name: src.profile?.name?.trim() ?? "",
        email: src.email ?? "",
        mobile: normalizeMobile(src.mobile),
        roleId:
          src.roleId ||
          (typeof src.role === "object" ? (src.role as any).id : undefined) ||
          src.roleId,
        isActive: src.isActive,
        isVerified: Boolean(src.isVerified),
        departmentId: 
          src.departmentId || 
          (typeof (src as any).department === "object" ? (src as any).department?.id : undefined),
        designation: src.workInfo?.experience?.trim() ?? "",
        department: (src.workInfo?.workTypes ?? []).map((w: any) => w.id),
        workTimeRange:
          src.workInfo?.workStartTime && src.workInfo?.workTimeLimit
            ? [
                dayjs(src.workInfo.workStartTime, "YYYY-MM-DD hh:mm A"),
                dayjs(src.workInfo.workTimeLimit, "YYYY-MM-DD hh:mm A"),
              ]
            : undefined,
        availableTimeRange:
          src.workInfo?.availableTime && src.workInfo?.availableTime.includes(" - ")
            ? [
                dayjs(src.workInfo.availableTime.split(" - ")[0], "hh:mm A"),
                dayjs(src.workInfo.availableTime.split(" - ")[1], "hh:mm A"),
              ]
            : undefined,
        gender: (src.profile?.gender as PrismaGender | undefined) ?? undefined,
        age: src.profile?.age ?? undefined,
        dob: src.profile?.dob
          ? String(src.profile.dob).slice(0, 10)
          : undefined,
        bloodGroup:
          (src.profile?.bloodGroup as PrismaBloodGroup | undefined) ??
          undefined,
        profilePhotoUrl: src.profile?.photo ?? "",
        photoId: src.profile?.photoId ?? "",
        nid: src.profile?.nid ?? "",
        nidPhotoUrls: (src.profile?.nidPhotos ?? []).map((p) => p.url),
        nidPhotoIds: (src.profile?.nidPhotos ?? []).map((p) => p.id),
        division: src.address?.division ?? "",
        district: src.address?.district ?? "",
        upazila: src.address?.upazila ?? "",
        addressLine: src.address?.address ?? "",
        subCategoryIds: (src.workInfo?.subCategories ?? []).map((s: any) => s.id),
        password: undefined,
        confirmPassword: undefined,
      });
    } else {
      // Find roleId from rolesResponse if possible
      const initialRoleId = (rolesResponse?.data ?? []).find(
        (r) => r.role === editData.role
      )?.id;

      form.setFieldsValue({
        name: editData.name === "—" ? "" : editData.name,
        email: editData.email,
        mobile: normalizeMobile(editData.mobile),
        roleId: initialRoleId,
        isActive: editData.isActive,
        isVerified: false,
        departmentId: undefined,
        designation: editData.designation === "—" ? "" : editData.designation,
        department: [],
        workTimeRange: undefined,
        availableTimeRange: undefined,
        gender: undefined,
        age: undefined,
        dob: undefined,
        bloodGroup: undefined,
        profilePhotoUrl: "",
        photoId: "",
        nid: "",
        nidPhotoUrls: [],
        nidPhotoIds: [],
        division: "",
        district: "",
        upazila: "",
        addressLine: "",
        subCategoryIds: [],
        password: undefined,
        confirmPassword: undefined,
      });
    }
  }, [editData, editDetail, form, open, rolesResponse?.data]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const mobile = normalizeMobile(values.mobile);

      const payload: EmployeeModalSubmit = {
        user: {
          email: values.email.trim().toLowerCase(),
          mobile,
          roleId: values.roleId,
          departmentId: values.departmentId || undefined,
          isActive: values.isActive,
          isVerified: values.isVerified,
          password: values.password || (editData ? undefined : "password1234"),
        },
        profile: {
          name: values.name.trim(),
          gender: values.gender,
          age: resolveProfileAge(values.dob, values.age) ?? undefined,
          dob: values.dob?.trim() || undefined,
          bloodGroup: values.bloodGroup,
          photo: values.profilePhotoUrl?.trim() || undefined,
          photoId: values.photoId || undefined,
          nid: values.nid?.trim() || undefined,
          nidPhotoUrls: values.nidPhotoUrls || [],
          nidPhotoIds: values.nidPhotoIds || [],
        },
        address: {
          division: values.division?.trim() || undefined,
          district: values.district?.trim() || undefined,
          upazila: values.upazila?.trim() || undefined,
          address: values.addressLine?.trim() || undefined,
        },
        workInfo: {
          experience: values.designation?.trim() || undefined,
          workTypeIds: values.department || [],
          workType:
            workTypes
              .filter((w: any) => (values.department || []).includes(w.id))
              .map((w: any) => w.name)
              .join(", ") || undefined,
          workStartTime: values.workTimeRange?.[0]?.format("YYYY-MM-DD hh:mm A") || undefined,
          workTimeLimit: values.workTimeRange?.[1]?.format("YYYY-MM-DD hh:mm A") || undefined,
          subCategoryIds: values.subCategoryIds || [],
          availableTime:
            values.availableTimeRange?.[0] && values.availableTimeRange?.[1]
              ? `${values.availableTimeRange[0].format("hh:mm A")} - ${values.availableTimeRange[1].format("hh:mm A")}`
              : undefined,
        },
      };
      await onSubmit(payload);
      form.resetFields();
      setShowPasswordChange(false);
    } catch {
      /* validation or API error — parent keeps modal open on failure */
    }
  };

  const handleCancel = () => {
    setShowPasswordChange(false);
    form.resetFields();
    onClose();
  };

  const showDetailSpinner = isEdit && detailLoading && !editDetail;

  return (
    <Fragment>
      <Modal
        key={isEdit ? (editData?.id ?? "edit") : "create-employee"}
        open={open}
        afterOpenChange={(visible) => {
          if (!visible) setShowPasswordChange(false);
        }}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={submitting}
        title={
          <ModalHeader
            title={isEdit ? "Update Employee" : "Add New Employee"}
            subTitle={
              isEdit
                ? "Prisma User + Profile + Address + WorkInfo (PATCH nested updates)."
                : "Creates User, Profile, Address, and WorkInfo from one form."
            }
            center={false}
          />
        }
        okText={isEdit ? "Update" : "Create"}
        cancelText="Cancel"
        okButtonProps={{
          disabled: showDetailSpinner || deptLoading,
          style: {
            backgroundColor: "#052e16",
            borderColor: "#052e16",
            fontWeight: 600,
          },
        }}
        width={1000}
        centered
        destroyOnClose
        wrapClassName="px-3 py-5 sm:px-5 sm:py-8"
        styles={{
          header: {
            padding: "16px 24px 12px",
            margin: 0,
          },
          body: {
            maxHeight: "min(78vh, calc(100vh - 220px))",
            overflowY: "auto",
            padding: "12px 24px 24px",
            margin: 0,
          },
          footer: {
            margin: 0,
            padding: "14px 24px 18px",
            borderTop: "1px solid #f0f0f0",
          },
        }}
      >
        <Spin spinning={showDetailSpinner}>
          <Form
            form={form}
            layout="vertical"
            className="pt-2 pb-10"
            initialValues={{
              isActive: true,
              isBlocked: false,
              isVerified: false,
              roleId:
                (rolesResponse?.data ?? []).find((r) => r.role === "EMPLOYEE")
                  ?.id || undefined,
            }}
          >
            <div className="mb-6 overflow-hidden">
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-800">Profile Photo</p>
                <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP</p>
              </div>
              <div className="flex">
                <Form.Item name="profilePhotoUrl" noStyle>
                  <MediaLibraryImageUploader
                    value={profilePhotoUrl}
                    onChange={(url, id) => {
                      form.setFieldsValue({ profilePhotoUrl: url, photoId: id });
                    }}
                    pickerTitle="Choose profile photo"
                    pickerOkText="Use this image"
                  />
                </Form.Item>
                <Form.Item name="photoId" noStyle>
                  <div className="hidden" />
                </Form.Item>
              </div>
            </div>

            <Divider
              plain
              className="my-5! text-sm! font-semibold! text-gray-700!"
            >
              Account (User)
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="name"
                label="Full name"
                rules={[
                  { required: true, message: "Please enter employee name" },
                ]}
              >
                <CustomInput placeholder="e.g. Sujon Ahmed" size="md" />
              </Form.Item>

              <Form.Item
                name="departmentId"
                label="Department"
              >
                <CustomSelect
                  placeholder={deptLoading ? "Loading…" : "Select department"}
                  size="md"
                  allowClear
                  disabled={deptLoading}
                >
                  {departments.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <CustomInput placeholder="e.g. sujon@example.com" size="md" />
              </Form.Item>

              <Form.Item
                name="mobile"
                label="Mobile"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                ]}
              >
                <CustomInput placeholder="e.g. +8801711000001" size="md" />
              </Form.Item>
            </div>

            {!isEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Password is required" },
                    { min: 8, message: "At least 8 characters" },
                  ]}
                >
                  <CustomInput.Password
                    placeholder="Min. 8 characters"
                    size="md"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm password"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Confirm password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match"),
                        );
                      },
                    }),
                  ]}
                >
                  <CustomInput.Password
                    placeholder="Repeat password"
                    size="md"
                  />
                </Form.Item>
              </div>
            )}

            {isEdit && (
              <div className="mt-2 mb-1 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                <CustomSwitch
                  checked={showPasswordChange}
                  checkedChildren="Set new"
                  unCheckedChildren="Keep current"
                  onChange={(checked) => {
                    setShowPasswordChange(checked);
                    if (!checked) {
                      form.setFieldsValue({
                        password: undefined,
                        confirmPassword: undefined,
                      });
                    }
                  }}
                />
              </div>
            )}

            {isEdit && showPasswordChange && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <Form.Item
                  name="password"
                  label="New password"
                  rules={[
                    { required: true, message: "Enter a new password" },
                    { min: 8, message: "At least 8 characters" },
                  ]}
                >
                  <CustomInput.Password
                    placeholder="Min. 8 characters"
                    size="md"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm new password"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Confirm the new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match"),
                        );
                      },
                    }),
                  ]}
                >
                  <CustomInput.Password
                    placeholder="Repeat new password"
                    size="md"
                  />
                </Form.Item>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2 mt-2">
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Select role" }]}
              >
                <CustomSelect
                  placeholder={
                    rolesLoading
                      ? "Loading roles…"
                      : roleSelectOptions.length === 0
                        ? "No active roles"
                        : "Select role"
                  }
                  size="md"
                  disabled={rolesLoading}
                  loading={rolesLoading}
                >
                  {roleSelectOptions.map((r) => (
                    <Option
                      key={r.id}
                      value={r.id}
                      title={r.description ?? undefined}
                    >
                      {roleSelectLabel(r.role)}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <Form.Item
                  name="isActive"
                  valuePropName="checked"
                  label="Active Status"
                >
                  <CustomSwitch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>

                <Form.Item
                  name="isVerified"
                  valuePropName="checked"
                  label="Verified by Admin"
                >
                  <CustomSwitch
                    checkedChildren="Verified"
                    unCheckedChildren="Not verified"
                  />
                </Form.Item>
              </div>
            </div>

            <Divider
              plain
              className="my-6! text-sm! font-semibold! text-gray-700!"
            >
              Profile
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="gender"
                label="Gender "
                rules={[{ required: true, message: "Select gender" }]}
              >
                <CustomSelect placeholder="Select" size="md" allowClear>
                  {PRISMA_GENDERS.map((g) => (
                    <Option key={g} value={g}>
                      {GENDER_LABELS[g]}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>
              <Form.Item
                name="dob"
                label="Date of birth"
                rules={[{ required: true, message: "Select Date of barth" }]}
              >
                <CustomInput type="date" size="md" />
              </Form.Item>

              <Form.Item name="bloodGroup" label="Blood group">
                <CustomSelect placeholder="Select" size="md" allowClear>
                  {PRISMA_BLOOD_GROUPS.map((b) => (
                    <Option key={b} value={b}>
                      {BLOOD_GROUP_LABELS[b]}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>

              <Form.Item name="nid" label="NID">
                <CustomInput placeholder="National ID" size="md" />
              </Form.Item>
            </div>

            <div className="mb-6 overflow-hidden">
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-800">NID Photos</p>
                <p className="text-xs text-gray-500">Upload or select National ID card images (multiple)</p>
              </div>
              <div className="flex">
                <Form.Item name="nidPhotoUrls" noStyle>
                  <MediaLibraryImageUploader
                    isMulti={true}
                    value={nidPhotoUrls}
                    onChange={(urls, ids) => {
                      form.setFieldsValue({
                        nidPhotoUrls: urls,
                        nidPhotoIds: ids,
                      });
                    }}
                    pickerTitle="Choose NID photos"
                    pickerOkText="Use these images"
                  />
                </Form.Item>
                <Form.Item name="nidPhotoIds" noStyle>
                  <div className="hidden" />
                </Form.Item>
              </div>
            </div>

            <Divider
              plain
              className="my-6! text-sm! font-semibold! text-gray-700!"
            >
              Address
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item name="division" label="Division">
                <CustomInput placeholder="Division" size="md" />
              </Form.Item>
              <Form.Item name="district" label="District">
                <CustomInput placeholder="District" size="md" />
              </Form.Item>
              <Form.Item name="upazila" label="Upazila">
                <CustomInput placeholder="Upazila" size="md" />
              </Form.Item>
              <Form.Item
                name="addressLine"
                label="Address line"
              >
                <CustomInput placeholder="Street, holding, etc." size="md" />
              </Form.Item>
            </div>

            <Divider
              plain
              className="my-6! text-sm! font-semibold! text-gray-700!"
            >
              Work (WorkInfo)
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="designation"
                label="Experience / title"
                rules={[
                  { required: true, message: "Enter experience or job title" },
                ]}
              >
                <CustomInput placeholder="e.g. Software Engineer" size="md" />
              </Form.Item>

              <Form.Item
                name="department"
                label="Work Type"
                rules={[{ required: true, message: "Select work type(s)" }]}
              >
                <CustomSelect
                  mode="multiple"
                  placeholder="Select work type(s)"
                  options={workTypes.map((w: any) => ({
                    label: w.name,
                    value: w.id,
                  }))}
                  size="md"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
              <Form.Item name="workTimeRange" label="Work Time Range">
                <DatePicker.RangePicker 
                  showTime={{ format: "hh:mm A", use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A" 
                  className="w-full" 
                  size="middle" 
                />
              </Form.Item>

              <Form.Item
                name="subCategoryIds"
                label="Categories"
              >
                <CustomSelect
                  mode="multiple"
                  placeholder="Select categories"
                  allowClear
                  disabled={subCategoryLoading}
                  loading={subCategoryLoading}
                >
                  {subCategories.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.name}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>

              <Form.Item name="availableTimeRange" label="Available Time Range">
                <TimePicker.RangePicker format="hh:mm A" use12Hours className="w-full" size="middle" />
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </Modal>
    </Fragment>
  );
};

export default EmployeeModal;
