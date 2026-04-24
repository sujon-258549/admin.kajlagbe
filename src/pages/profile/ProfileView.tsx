import React, { useState } from "react";
import { useGetMyDataQuery } from "../../redux/features/auth/authApi";
import { Spin, Tag, Card, Divider, Empty, Image } from "antd";
import Button from "../../Components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faBriefcase,
  faBuilding,
  faUser,
  faMapMarkerAlt,
  faClock,
  faCalendarAlt,
  faIdCard,
  faVials,
  faVenusMars,
  faUserEdit,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../Components/modal/profile/ChangePasswordModal";

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { data: myData, isLoading, isError } = useGetMyDataQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  if (isError || !myData?.data) {
    return (
      <div className="p-10">
        <Empty description="Profile data not found" />
      </div>
    );
  }

  const user = myData.data;
  const profile = user.profile;
  const roleName = user.role?.role || user.role || "Admin";
  const deptName = user.department?.name || "—";

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        breadcrumb={[{ label: "Home", path: "/" }, { label: "My Profile" }]}
        title="Account Profile"
        subTitle={`Managing profile for ${profile?.name || user.email}`}
        extra={
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={<FontAwesomeIcon icon={faUserEdit} className="mr-2" />}
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faLock} className="mr-2" />}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Basic Info & Photo */}
        <div className="w-full lg:w-1/3">
          <Card className="border border-gray-300 rounded-md overflow-hidden h-full shadow-none">
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative mb-4">
                <Image
                  src={profile?.photo || `https://i.pravatar.cc/150?u=${user.email}`}
                  alt={profile?.name || "User"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  width={150}
                  height={150}
                  preview={false}
                />
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile?.name || "—"}
              </h2>
              <Tag color={user.isActive ? "success" : "default"} className="px-4 py-1 rounded-full font-semibold uppercase mb-4 border-none">
                {user.isActive ? "Active" : "Inactive"}
              </Tag>

              <div className="w-full space-y-4 mt-2">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-gray-800 break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile Number</p>
                    <p className="text-sm font-semibold text-gray-800">{user.mobile || profile?.mobile || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <FontAwesomeIcon icon={faBriefcase} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Designation</p>
                    <p className="text-sm font-semibold text-gray-800">{user.workInfo?.experience || user.designation || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info Sections */}
        <div className="w-full lg:w-2/3">
          {/* Organization Info */}
          <Card title={<span className="text-lg font-bold">Organizational Details</span>} className="border border-gray-300 rounded-md mb-4! shadow-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Department</p>
                  <p className="font-semibold text-gray-800">{deptName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faUser} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">System Role</p>
                  <Tag className="font-bold border-none">{roleName?.replace("_", " ")}</Tag>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Joined Date</p>
                  <p className="font-semibold text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Verification Status</p>
                  <Tag color={user.isVerified ? "blue" : "warning"} className="border-none">
                    {user.isVerified ? "Verified" : "Pending Verification"}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Details */}
          <Card title={<span className="text-lg font-bold">Personal Information</span>} className="border border-gray-300 rounded-md mb-4! shadow-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faVenusMars} size="xs" /> GENDER
                </span>
                <span className="font-semibold">{profile?.gender || "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} size="xs" /> DOB
                </span>
                <span className="font-semibold">{profile?.dob ? profile.dob.slice(0, 10) : "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} size="xs" /> AGE
                </span>
                <span className="font-semibold">{profile?.age || "—"} Years</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faVials} size="xs" /> BLOOD GROUP
                </span>
                <span className="font-semibold text-red-600">{profile?.bloodGroup?.replace("_", " ") || "—"}</span>
              </div>
            </div>
            
            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Address</p>
                  <p className="text-sm text-gray-800">
                    {user.address?.address}, {user.address?.upazila}, {user.address?.district}, {user.address?.division}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">NID Number</p>
                  <p className="font-semibold text-gray-800">{profile?.nid || "—"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Work Information (Optional for Admin) */}
          {user.workInfo && (
            <Card title={<span className="text-lg font-bold">Work & Schedule</span>} className="border border-gray-300 rounded-md mb-4! shadow-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Working Hours</p>
                    <p className="font-semibold text-gray-800">{user.workInfo.availableTime || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Contract Period</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.workInfo.workStartTime?.split(" ")[0]} To {user.workInfo.workTimeLimit?.split(" ")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Documents Section */}
          <Card title={<span className="text-lg font-bold">Documents & ID Photos</span>} className="border border-gray-300 rounded-md mb-4! shadow-none">
            <p className="text-xs text-gray-500 font-medium uppercase mb-4 tracking-wider">National ID (NID) Images</p>
            <div className="flex flex-wrap gap-4!">
              {profile?.nidPhotos && profile.nidPhotos.length > 0 ? (
                profile.nidPhotos.map((photo: any, index: number) => (
                  <div key={photo.id || index} className="relative group">
                    <Image
                      src={photo.url}
                      alt={`NID Photo ${index + 1}`}
                      className="rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      width={200}
                      height={130}
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      Page {index + 1}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <FontAwesomeIcon icon={faIdCard} size="2x" className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No NID images uploaded</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileView;
