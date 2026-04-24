import React, { useEffect } from "react";
import { useGetMyDataQuery } from "../../redux/features/auth/authApi";
import { useUpdateEmployeeMutation } from "../../redux/features/employApi/employApi";
import { Form, Card, Row, Col, Divider, message, Spin, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import MediaLibraryImageUploader from "../../Components/ui/MediaLibraryImageUploader";
import CustomInput from "../../Components/ui/Input";
import CustomSelect from "../../Components/ui/Select";
import Button from "../../Components/ui/Button";
import { PRISMA_BLOOD_GROUPS, PRISMA_GENDERS, BLOOD_GROUP_LABELS, GENDER_LABELS } from "../../Components/types";

const { Option } = Select;

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: myData, isLoading: isFetching } = useGetMyDataQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  const profilePhotoUrl = Form.useWatch("photo", form);
  const nidPhotoUrls = Form.useWatch("nidPhotoUrls", form);

  useEffect(() => {
    if (myData?.data) {
      const user = myData.data;
      form.setFieldsValue({
        name: user.profile?.name?.trim() ?? "",
        mobile: user.mobile,
        gender: user.profile?.gender,
        dob: user.profile?.dob ? String(user.profile.dob).slice(0, 10) : undefined,
        bloodGroup: user.profile?.bloodGroup,
        photo: user.profile?.photo || "",
        photoId: user.profile?.photoId || "",
        nid: user.profile?.nid || "",
        nidPhotoUrls: (user.profile?.nidPhotos ?? []).map((p: any) => p.url),
        nidPhotoIds: (user.profile?.nidPhotos ?? []).map((p: any) => p.id),
        division: user.address?.division || "",
        district: user.address?.district || "",
        upazila: user.address?.upazila || "",
        addressLine: user.address?.address || "",
      });
    }
  }, [myData, form]);

  const onFinish = async (values: any) => {
    if (!myData?.data?.id) {
      message.error("User ID not found!");
      return;
    }

    const payload = {
      profile: {
        name: values.name.trim(),
        gender: values.gender,
        dob: values.dob || undefined,
        bloodGroup: values.bloodGroup,
        photo: values.photo || undefined,
        photoId: values.photoId || undefined,
        nid: values.nid || undefined,
        nidPhotoUrls: values.nidPhotoUrls || [],
        nidPhotoIds: values.nidPhotoIds || [],
      },
      address: {
        division: values.division || undefined,
        district: values.district || undefined,
        upazila: values.upazila || undefined,
        address: values.addressLine || undefined,
      },
      user: {
        mobile: values.mobile,
      }
    };

    try {
      const res: any = await updateProfile({
        id: myData.data.id,
        data: payload,
      }).unwrap();

      if (res.success || res.isLogin) {
        message.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Profile", path: "/profile" },
          { label: "Edit Profile" },
        ]}
        title="Edit Account Information"
        subTitle="Update your personal details, address, and profile photo"
        extra={
          <Button
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faArrowLeft} className="mr-2" />}
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </Button>
        }
      />

      <Card className="border border-gray-300 rounded-md shadow-none max-w-5xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="pt-2"
        >
          {/* Photo Section */}
          <div className="mb-8">
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-800">Profile Photo</p>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP</p>
            </div>
            <Form.Item name="photo" noStyle>
               <MediaLibraryImageUploader 
                  value={profilePhotoUrl}
                  onChange={(url, id) => {
                    form.setFieldsValue({ photo: url, photoId: id });
                  }}
                  pickerTitle="Choose profile photo"
               />
            </Form.Item>
            <Form.Item name="photoId" noStyle>
              <div className="hidden" />
            </Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">
            Personal Information
          </Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <CustomInput placeholder="e.g. Sujon Ahmed" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[{ required: true, message: "Please enter mobile number" }]}
              >
                <CustomInput placeholder="e.g. +8801711000001" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Select gender" }]}
              >
                <CustomSelect placeholder="Select Gender" size="md">
                  {PRISMA_GENDERS.map((g) => (
                    <Option key={g} value={g}>
                      {GENDER_LABELS[g]}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
              >
                <CustomInput type="date" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="bloodGroup" label="Blood Group">
                <CustomSelect placeholder="Select Blood Group" size="md">
                  {PRISMA_BLOOD_GROUPS.map((b) => (
                    <Option key={b} value={b}>
                      {BLOOD_GROUP_LABELS[b]}
                    </Option>
                  ))}
                </CustomSelect>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="nid" label="NID Number">
                <CustomInput placeholder="Enter National ID number" size="md" />
              </Form.Item>
            </Col>
          </Row>

          <div className="mb-8 overflow-hidden">
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-800">NID Photos</p>
              <p className="text-xs text-gray-500">Upload or select National ID card images (multiple)</p>
            </div>
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
              />
            </Form.Item>
            <Form.Item name="nidPhotoIds" noStyle>
              <div className="hidden" />
            </Form.Item>
          </div>

          <Divider plain className="my-6! text-sm! font-semibold! text-gray-700!">
            Address Information
          </Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="division" label="Division">
                <CustomInput placeholder="Division" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="district" label="District">
                <CustomInput placeholder="District" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="upazila" label="Upazila">
                <CustomInput placeholder="Upazila" size="md" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="addressLine" label="Address Line">
                <CustomInput placeholder="Street, holding, etc." size="md" />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-10 flex justify-end">
            <Button
              variant="primary"
              htmlType="submit"
              size="lg"
              loading={isUpdating}
              className="px-12 font-bold"
              icon={<FontAwesomeIcon icon={faSave} className="mr-2" />}
            >
              Update Profile
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileEdit;
