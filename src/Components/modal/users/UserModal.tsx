import { Modal, Form, Select, Spin, Divider, DatePicker } from "antd";
import { useEffect, useMemo } from "react";
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
  deriveRoleString,
  type EmployApiUser,
  type EmployeeModalSubmit,
  type EmployeeRow,
  type TRole,
} from "../../types";
import { resolveProfileAge } from "../../utils/ageFromDob";
import dayjs from "dayjs";

const { Option } = Select;

export type Employee = EmployeeRow;

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeModalSubmit) => void | Promise<void>;
  editData?: EmployeeRow | null;
  editDetail?: EmployApiUser | null;
  detailLoading?: boolean;
  submitting?: boolean;
}

const normalizeMobile = (phone: string) => phone.replace(/\s+/g, "").trim();

const UserModal = ({
  open,
  onClose,
  onSubmit,
  editData,
  editDetail,
  detailLoading = false,
  submitting = false,
}: UserModalProps) => {
  const [form] = Form.useForm();
  const isEdit = !!editData;
  const profilePhotoUrl = Form.useWatch("profilePhotoUrl", form);
  const nidPhotoUrls = Form.useWatch("nidPhotoUrls", form);

  useGetAllDepartmentsQuery({}, { skip: !open });

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
    () => (workTypesResponse || []).filter((w) => w.isActive),
    [workTypesResponse],
  );

  const roleSelectOptions = useMemo((): TRole[] => {
    const fromApi = (rolesResponse?.data ?? [])
      .filter((r) => r.isActive)
      .slice();
    fromApi.sort((a, b) => a.role.localeCompare(b.role));

    const keys = new Set(fromApi.map((r) => r.id));

    let currentRoleId: string | undefined;
    if (isEdit) {
      if (editDetail) {
        currentRoleId = editDetail.roleId || (typeof editDetail.role === "object" ? (editDetail.role as any).id : undefined);
      }
    }

    if (currentRoleId && !keys.has(currentRoleId)) {
      const roleName = editDetail ? deriveRoleString(editDetail) : editData?.role || "";
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
        roleId: (rolesResponse?.data ?? []).find((r: any) => r.role === "USER")?.id,
      });
      return;
    }

    const src = editDetail;
    if (src) {
      form.setFieldsValue({
        name: src.profile?.name?.trim() ?? "",
        email: src.email ?? "",
        mobile: normalizeMobile(src.mobile),
        roleId: src.roleId || (typeof src.role === "object" ? (src.role as any).id : undefined),
        isActive: src.isActive,
        isVerified: Boolean(src.isVerified),
        departmentId: src.departmentId,
        designation: src.workInfo?.experience?.trim() ?? "",
        department: (src.workInfo?.workTypes ?? []).map((w: any) => w.id),
        workTimeRange: src.workInfo?.workStartTime && src.workInfo?.workTimeLimit ? [dayjs(src.workInfo.workStartTime), dayjs(src.workInfo.workTimeLimit)] : undefined,
        availableTimeRange: src.workInfo?.availableTime?.includes(" - ") ? [dayjs(src.workInfo.availableTime.split(" - ")[0], "hh:mm A"), dayjs(src.workInfo.availableTime.split(" - ")[1], "hh:mm A")] : undefined,
        gender: src.profile?.gender,
        age: src.profile?.age,
        dob: src.profile?.dob ? String(src.profile.dob).slice(0, 10) : undefined,
        bloodGroup: src.profile?.bloodGroup,
        profilePhotoUrl: src.profile?.photo ?? "",
        photoId: src.profile?.photoId ?? "",
        nid: src.profile?.nid ?? "",
        nidPhotoUrls: (src.profile?.nidPhotos ?? []).map((p: any) => p.url),
        nidPhotoIds: (src.profile?.nidPhotos ?? []).map((p: any) => p.id),
        division: src.address?.division ?? "",
        district: src.address?.district ?? "",
        upazila: src.address?.upazila ?? "",
        addressLine: src.address?.address ?? "",
        subCategoryIds: (src.workInfo?.subCategories ?? []).map((s: any) => s.id),
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
          password: values.password || (isEdit ? undefined : "12345678"),
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
          workStartTime: values.workTimeRange?.[0]?.format("YYYY-MM-DD hh:mm A") || undefined,
          workTimeLimit: values.workTimeRange?.[1]?.format("YYYY-MM-DD hh:mm A") || undefined,
          subCategoryIds: values.subCategoryIds || [],
          availableTime: values.availableTimeRange?.[0] && values.availableTimeRange?.[1] ? `${values.availableTimeRange[0].format("hh:mm A")} - ${values.availableTimeRange[1].format("hh:mm A")}` : undefined,
        },
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const showDetailSpinner = isEdit && detailLoading && !editDetail;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={submitting}
      title={
        <ModalHeader
          title={isEdit ? "Update User" : "Add New User"}
          subTitle="User + Profile + Address + WorkInfo management."
          center={false}
        />
      }
      okText={isEdit ? "Update" : "Create"}
      width={1000}
      centered
      destroyOnClose
      styles={{
        header: { padding: "16px 24px 12px", margin: 0 },
        body: { maxHeight: "min(78vh, calc(100vh - 220px))", overflowY: "auto", padding: "12px 24px 24px" },
        footer: { padding: "14px 24px 18px", borderTop: "1px solid #f0f0f0" },
      }}
    >
      <Spin spinning={showDetailSpinner}>
        <Form form={form} layout="vertical" className="pt-2">
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 mb-3">Profile Photo</p>
            <Form.Item name="profilePhotoUrl" noStyle>
              <MediaLibraryImageUploader
                value={profilePhotoUrl}
                onChange={(url, id) => {
                  form.setFieldsValue({ profilePhotoUrl: url, photoId: id });
                }}
              />
            </Form.Item>
            <Form.Item name="photoId" className="hidden"><CustomInput /></Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">Account (User)</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
              <CustomInput placeholder="Full name" size="md" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <CustomInput placeholder="Email" size="md" />
            </Form.Item>
            <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
              <CustomInput placeholder="Mobile" size="md" />
            </Form.Item>
            <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
               <CustomSelect placeholder="Select role" loading={rolesLoading}>
                 {roleSelectOptions.map((r) => <Option key={r.id} value={r.id}>{r.role}</Option>)}
               </CustomSelect>
            </Form.Item>
            {!isEdit && (
              <Form.Item name="password" label="Password (Default: 12345678)">
                <CustomInput.Password placeholder="Default: 12345678" size="md" />
              </Form.Item>
            )}
          </div>

          <div className="flex gap-8 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
            <Form.Item name="isActive" valuePropName="checked" label="Status" className="mb-0">
              <CustomSwitch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
            <Form.Item name="isVerified" valuePropName="checked" label="Verified" className="mb-0">
              <CustomSwitch checkedChildren="Verified" unCheckedChildren="Not Verified" />
            </Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">Profile Details</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="gender" label="Gender">
              <CustomSelect placeholder="Select gender">
                {PRISMA_GENDERS.map(g => <Option key={g} value={g}>{GENDER_LABELS[g]}</Option>)}
              </CustomSelect>
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth">
              <CustomInput type="date" size="md" />
            </Form.Item>
            <Form.Item name="bloodGroup" label="Blood Group">
              <CustomSelect placeholder="Select">
                {PRISMA_BLOOD_GROUPS.map(b => <Option key={b} value={b}>{BLOOD_GROUP_LABELS[b]}</Option>)}
              </CustomSelect>
            </Form.Item>
            <Form.Item name="nid" label="NID">
              <CustomInput placeholder="NID number" size="md" />
            </Form.Item>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 mb-3">NID Photos</p>
            <Form.Item name="nidPhotoUrls" noStyle>
              <MediaLibraryImageUploader
                isMulti={true}
                value={nidPhotoUrls}
                onChange={(urls, ids) => {
                  form.setFieldsValue({ nidPhotoUrls: urls, nidPhotoIds: ids });
                }}
              />
            </Form.Item>
            <Form.Item name="nidPhotoIds" className="hidden"><CustomInput /></Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">Address Information</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="division" label="Division"><CustomInput placeholder="Division" /></Form.Item>
            <Form.Item name="district" label="District"><CustomInput placeholder="District" /></Form.Item>
            <Form.Item name="upazila" label="Upazila"><CustomInput placeholder="Upazila" /></Form.Item>
            <Form.Item name="addressLine" label="Full Address"><CustomInput placeholder="Street, Holding etc." /></Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">Work Information</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="department" label="Work Type">
              <CustomSelect mode="multiple" placeholder="Select work types">
                {workTypes.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}
              </CustomSelect>
            </Form.Item>
            <Form.Item name="workTimeRange" label="Work Time Range">
               <DatePicker.RangePicker className="w-full" />
            </Form.Item>
            <Form.Item name="subCategoryIds" label="Categories">
              <CustomSelect mode="multiple" placeholder="Select categories" loading={subCategoryLoading}>
                {subCategories.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
              </CustomSelect>
            </Form.Item>
            <Form.Item name="availableTimeRange" label="Available Time Range">
               <DatePicker.RangePicker showTime={{ format: "hh:mm A", use12Hours: true }} format="hh:mm A" className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserModal;
