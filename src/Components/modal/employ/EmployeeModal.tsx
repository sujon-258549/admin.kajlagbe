import { Modal, Form, Select, Spin, Divider } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import CustomInput from "../../ui/Input";
import CustomSwitch from "../../ui/Switch";
import CustomSelect from "../../ui/Select";
import ModalHeader from "../../common/ModalHeader";
import MediaLibraryImageUploader from "../../ui/MediaLibraryImageUploader";
import { useGetAllDepartmentsQuery } from "../../../redux/features/departmentApi/departmentApi";
import { useGetAllRolesQuery } from "../../../redux/features/roleApi/roleApi";
import { useGetAllSubCategoryQuery } from "../../../redux/features/subCategoryApi/subCategoryApi";
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
  department: string;
  password?: string;
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  profilePhotoUrl?: string;
  photoId?: string;
  nid?: string;
  nidPhotoUrl?: string;
  nidPhotoId?: string;
  division?: string;
  district?: string;
  upazila?: string;
  addressLine?: string;
  categories?: string[];
  availableTime?: string;
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
  const nidPhotoUrl = Form.useWatch("nidPhotoUrl", form);

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
          (typeof src.role === "object" ? src.role.id : undefined),
        isActive: src.isActive,
        isVerified: Boolean(src.isVerified),
        departmentId: src.departmentId ?? undefined,
        designation: src.workInfo?.experience?.trim() ?? "",
        department: src.workInfo?.workType?.trim() ?? "",
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
        nidPhotoUrl: src.profile?.nidPhotos?.[0]?.url ?? "",
        nidPhotoId: src.profile?.nidPhotos?.[0]?.id ?? "",
        division: src.address?.division ?? "",
        district: src.address?.district ?? "",
        upazila: src.address?.upazila ?? "",
        addressLine: src.address?.address ?? "",
        categories: src.workInfo?.categories ?? [],
        availableTime: src.workInfo?.availableTime ?? "",
        password: undefined,
        confirmPassword: undefined,
      });
    } else {
      form.setFieldsValue({
        name: editData.name === "—" ? "" : editData.name,
        email: editData.email,
        mobile: normalizeMobile(editData.phone),
        roleId: undefined, // Wait for editDetail to get the roleId
        isActive: editData.status === "Active",
        isVerified: false,
        departmentId: undefined,
        designation: editData.designation === "—" ? "" : editData.designation,
        department: editData.department === "—" ? "" : editData.department,
        gender: undefined,
        age: undefined,
        dob: undefined,
        bloodGroup: undefined,
        profilePhotoUrl: "",
        photoId: "",
        nid: "",
        nidPhotoUrl: "",
        nidPhotoId: "",
        division: "",
        district: "",
        upazila: "",
        addressLine: "",
        categories: [],
        availableTime: "",
        password: undefined,
        confirmPassword: undefined,
      });
    }
  }, [editData, editDetail, form, open]);

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
          ...(values.password && { password: values.password }),
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
          nidPhotoUrl: values.nidPhotoUrl?.trim() || undefined,
          nidPhotoId: values.nidPhotoId || undefined,
        },
        address: {
          division: values.division?.trim() || undefined,
          district: values.district?.trim() || undefined,
          upazila: values.upazila?.trim() || undefined,
          address: values.addressLine?.trim() || undefined,
        },
        workInfo: {
          experience: values.designation?.trim() || undefined,
          workType: values.department?.trim() || undefined,
          categories: values.categories || [],
          availableTime: values.availableTime?.trim() || undefined,
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
        width={920}
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
            <div className="mb-4 overflow-hidden ">
              <div className=" bg-white">
                <p className="text-sm font-semibold text-gray-800">
                  Profile photo
                </p>
              </div>
              <div className="flex py-4">
                {/* Default single (`isMulti` omitted). Use `isMulti` + `string[]` for multi-image fields. */}
                <MediaLibraryImageUploader
                  value={profilePhotoUrl}
                  onChange={(url, id) => {
                    form.setFieldsValue({ profilePhotoUrl: url, photoId: id });
                  }}
                  pickerTitle="Choose profile photo"
                  pickerOkText="Use this image"
                />
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
                label="Full name (Profile.name)"
                rules={[
                  { required: true, message: "Please enter employee name" },
                ]}
              >
                <CustomInput placeholder="e.g. Sujon Ahmed" size="md" />
              </Form.Item>

              <Form.Item
                name="departmentId"
                label="Department (User.departmentId)"
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
                label="Email (User.email)"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <CustomInput placeholder="e.g. sujon@example.com" size="md" />
              </Form.Item>

              <Form.Item
                name="mobile"
                label="Mobile (User.mobile / Profile.mobile)"
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
                  label="Password (User.password)"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
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

              <Form.Item name="nid" label="NID (Profile.nid)">
                <CustomInput placeholder="National ID" size="md" />
              </Form.Item>
            </div>

            <div className="mb-4 overflow-hidden ">
              <div className=" bg-white">
                <p className="text-sm font-semibold text-gray-800">NID photo</p>
              </div>
              <div className="flex py-4">
                <MediaLibraryImageUploader
                  value={nidPhotoUrl}
                  onChange={(url, id) => {
                    form.setFieldsValue({ nidPhotoUrl: url, nidPhotoId: id });
                  }}
                  pickerTitle="Choose NID photo"
                  pickerOkText="Use this image"
                />
              </div>
            </div>

            <Divider
              plain
              className="my-6! text-sm! font-semibold! text-gray-700!"
            >
              Address
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item name="division" label="Division (Address.division)">
                <CustomInput placeholder="Division" size="md" />
              </Form.Item>
              <Form.Item name="district" label="District (Address.district)">
                <CustomInput placeholder="District" size="md" />
              </Form.Item>
              <Form.Item name="upazila" label="Upazila (Address.upazila)">
                <CustomInput placeholder="Upazila" size="md" />
              </Form.Item>
              <Form.Item
                name="addressLine"
                label="Address line (Address.address)"
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
                label="Experience / title (WorkInfo.experience)"
                rules={[
                  { required: true, message: "Enter experience or job title" },
                ]}
              >
                <CustomInput placeholder="e.g. Software Engineer" size="md" />
              </Form.Item>

              <Form.Item
                name="department"
                label="Work type / unit (WorkInfo.workType)"
                rules={[{ required: true, message: "Enter work type or unit" }]}
              >
                <CustomInput placeholder="e.g. Field operations" size="md" />
              </Form.Item>
            </div>

            <Form.Item
              name="categories"
              label="Categories (WorkInfo.categories)"
            >
              <CustomSelect
                mode="multiple"
                placeholder={
                  subCategoryLoading
                    ? "Loading categories…"
                    : "Select categories"
                }
                size="md"
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

            <Form.Item
              name="availableTime"
              label="Available time (WorkInfo.availableTime)"
              className="mb-0"
            >
              <CustomInput placeholder="e.g. Weekends, 6pm–10pm" size="md" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Fragment>
  );
};

export default EmployeeModal;
