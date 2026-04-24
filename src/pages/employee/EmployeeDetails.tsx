import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag, Card, Divider, Empty, Button, Image } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
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
} from "@fortawesome/free-solid-svg-icons";
import { useGetEmployeeByIdQuery } from "../../redux/features/employApi/employApi";
import PageHeader from "../../Components/common/PageHeader";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError } = useGetEmployeeByIdQuery(id || "");

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" tip="Loading employee details..." />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-10">
        <Empty description="Employee not found" />
        <div className="mt-4 flex justify-center">
          <Button icon={<FontAwesomeIcon icon={faArrowLeft} />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const roleName = typeof employee.role === "object" ? employee.role.role : employee.role;
  const deptName = typeof (employee as any).department === "object" ? (employee as any).department?.name : "—";

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Employees", path: "/employee/all" },
          { label: "Details" },
        ]}
        title="Employee Profile"
        subTitle={`Viewing details for ${employee.profile?.name || employee.email}`}
        extra={
          <Button 
            onClick={() => navigate(-1)} 
            icon={<FontAwesomeIcon icon={faArrowLeft} className="mr-2" />}
            className="flex items-center"
          >
            Back to List
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Basic Info & Photo */}
        <div className="w-full lg:w-1/3">
          <Card className="border border-gray-300 rounded-md overflow-hidden h-full">
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative mb-4">
                <Image
                  src={(employee.profile?.photo as string) || `https://i.pravatar.cc/150?u=${employee.email}`}
                  alt={employee.profile?.name || "Employee"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  width={150}
                  height={150}
                />
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${employee.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee.profile?.name || "—"}
              </h2>
              <Tag color={employee.isActive ? "success" : "default"} className="px-4 py-1 rounded-full font-semibold uppercase mb-4">
                {employee.isActive ? "Active" : "Inactive"}
              </Tag>

              <div className="w-full space-y-4 mt-2">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-gray-800 break-all">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mobile Number</p>
                    <p className="text-sm font-semibold text-gray-800">{employee.mobile || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <FontAwesomeIcon icon={faBriefcase} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Designation</p>
                    <p className="text-sm font-semibold text-gray-800">{employee.workInfo?.experience || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info Sections */}
        <div className="w-full lg:w-2/3">
          {/* Organization Info */}
          <Card title={<span className="text-lg font-bold">Organizational Details</span>} className="border border-gray-300 rounded-md mb-4!">
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
                  <Tag className="font-bold">{roleName?.replace("_", " ")}</Tag>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Joined Date</p>
                  <p className="font-semibold text-gray-800">
                    {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Verification Status</p>
                  <Tag color={employee.isVerified ? "blue" : "warning"}>
                    {employee.isVerified ? "Verified" : "Pending Verification"}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Details */}
          <Card title={<span className="text-lg font-bold">Personal Information</span>} className="border border-gray-300 rounded-md mb-4!">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faVenusMars} size="xs" /> GENDER
                </span>
                <span className="font-semibold">{employee.profile?.gender || "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} size="xs" /> DOB
                </span>
                <span className="font-semibold">{employee.profile?.dob ? employee.profile.dob.slice(0, 10) : "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} size="xs" /> AGE
                </span>
                <span className="font-semibold">{employee.profile?.age || "—"} Years</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faVials} size="xs" /> BLOOD GROUP
                </span>
                <span className="font-semibold text-red-600">{employee.profile?.bloodGroup?.replace("_", " ") || "—"}</span>
              </div>
            </div>
            
            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Address</p>
                  <p className="text-sm text-gray-800">
                    {employee.address?.address}, {employee.address?.upazila}, {employee.address?.district}, {employee.address?.division}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">NID Number</p>
                  <p className="font-semibold text-gray-800">{employee.profile?.nid || "—"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Work Information */}
          <Card title={<span className="text-lg font-bold">Work & Schedule</span>} className="border border-gray-300 rounded-md mb-4!">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Working Hours</p>
                  <p className="font-semibold text-gray-800">{employee.workInfo?.availableTime || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Contract Period</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {employee.workInfo?.workStartTime?.split(" ")[0]} To {employee.workInfo?.workTimeLimit?.split(" ")[0]}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 font-medium uppercase mb-2">Work Types</p>
                <div className="flex flex-wrap gap-2">
                  {employee.workInfo?.workTypes?.map((wt: any) => (
                    <Tag key={wt.id} color="cyan" className="m-0">{wt.name}</Tag>
                  )) || <span className="text-gray-400 italic">No work types specified</span>}
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 font-medium uppercase mb-2">Service Categories</p>
                <div className="flex flex-wrap gap-2">
                  {employee.workInfo?.subCategories?.map((sc: any) => (
                    <Tag key={sc.id} color="geekblue" className="m-0">{sc.name}</Tag>
                  )) || <span className="text-gray-400 italic">No categories specified</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Documents Section */}
          <Card title={<span className="text-lg font-bold">Documents & ID Photos</span>} className="border border-gray-300 rounded-md mb-4!">
            <p className="text-xs text-gray-500 font-medium uppercase mb-4 tracking-wider">National ID (NID) Images</p>
            <div className="flex flex-wrap gap-4!">
              {employee.profile?.nidPhotos && employee.profile.nidPhotos.length > 0 ? (
                employee.profile.nidPhotos.map((photo: any, index: number) => (
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
    </div>
  );
};

export default EmployeeDetails;
