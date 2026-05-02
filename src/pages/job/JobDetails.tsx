import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Divider, Spin, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBuilding,
  faLocationDot,
  faMoneyBillWave,
  faBriefcase,
  faCheckCircle,
  faClock,
  faUserGroup,
  faGraduationCap,
  faStar,
  faGlobe,
  faEnvelope,
  faPhone,
  faUsers,
  faCalendarCheck,
  faVenusMars,
  faBolt,
  faMapMarkerAlt,
  faSitemap,
  faPenToSquare,
  faUtensils,
  faGift,
  faShieldAlt,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import { useJob } from "../../apihooks/useJob";
import formatDate from "../../Components/utils/dateFormate";
import TakaIcon from "../../Components/ui/TakaIcon";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetJobById } = useJob();
  const { data: response, isLoading } = useGetJobById(id || "");
  const job = response?.data;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-gray-400 animate-pulse">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 inline-flex p-6 rounded-full mb-6">
          <FontAwesomeIcon icon={faBriefcase} className="text-gray-300 text-6xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Job not found</h2>
        <p className="text-gray-500 mb-6">The job you are looking for might have been removed or is unavailable.</p>
        <CustomButton
          variant="primary"
          onClick={() => navigate("/job/list")}
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
        >
          Back to List
        </CustomButton>
      </div>
    );
  }

  const InfoItem = ({ icon, label, value, color = "text-primary" }: any) => (
    <div className="flex items-start gap-4">
      <div className={`mt-1 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 ${color}`}>
        <FontAwesomeIcon icon={icon} className="text-sm" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider m-0 leading-tight">{label}</p>
        <p className="text-sm font-semibold text-gray-700 m-0">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="pb-20 animate-in fade-in duration-700">
      <div className="mb-4">
        <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Job Management", path: "/job/list" },
          { label: "Job Details" },
        ]}
        title={job.title}
        extra={
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/job/list")}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={() => navigate(`/job/edit/${job.id}`)}
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
            >
              Edit Job
            </CustomButton>
          </div>
        }
      />
      </div>

      {/* Hero Section Card */}
      <div className="mb-4">
      <Card className="border-gray-200 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/30">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="flex gap-5">
              <Avatar 
                size={80} 
                shape="square" 
                className="bg-primary/5 rounded-lg border border-primary/10 flex-shrink-0"
                icon={<FontAwesomeIcon icon={faBuilding} className="text-primary text-3xl" />}
                src={job.logo}
              />
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 m-0 leading-tight">
                    {job.title}
                  </h1>
                  {job.isUrgent && (
                    <Tag color="error" className="m-0 rounded-full border-none px-3 font-bold uppercase text-[10px] flex items-center gap-1">
                      <FontAwesomeIcon icon={faBolt} /> Urgent
                    </Tag>
                  )}
                  {job.isPublished ? (
                     <Tag color="success" className="m-0 rounded-full border-none px-3 font-bold uppercase text-[10px]">Published</Tag>
                  ) : (
                    <Tag color="warning" className="m-0 rounded-full border-none px-3 font-bold uppercase text-[10px]">Draft</Tag>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faBuilding} className="text-primary/40" />
                    <span className="font-bold text-gray-700">{job.company || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faLocationDot} className="text-primary/40" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faClock} className="text-primary/40" />
                    <Tag color="blue" className="m-0 border-none bg-blue-50 text-blue-600 font-bold px-3 rounded-full text-[10px]">
                      {job.type}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto bg-white p-5 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-w-[220px]">
              <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-2">Offered Salary</p>
              <div className="flex items-center justify-center gap-4 text-primary">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl opacity-60" />
                <span className="text-2xl font-bold tracking-tight">
                  <TakaIcon />{job.salaryMin?.toLocaleString()} - <TakaIcon />{job.salaryMax?.toLocaleString()}
                </span>
              </div>
              {job.negotiable && (
                <div className="mt-2 py-1 px-3 bg-emerald-50 rounded-full">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider italic">Negotiable</span>
                </div>
              )}
            </div>
          </div>

          <Divider className="my-4 border-gray-100" />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <InfoItem icon={faCalendarCheck} label="Application Deadline" value={job.deadline} color="text-rose-500" />
             <InfoItem icon={faUserGroup} label="Total Vacancy" value={job.vacancy} color="text-blue-500" />
             <InfoItem icon={faVenusMars} label="Gender" value={job.gender} color="text-purple-500" />
             <InfoItem icon={faBolt} label="Job Nature" value={job.jobNature} color="text-orange-500" />
          </div>
        </div>
      </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Job Content Sections */}
          <div className="mb-4">
          <Card className="border-gray-200 rounded-2xl">
            <div>
              {/* Description */}
                <section className="mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/5">
                      <FontAwesomeIcon icon={faBriefcase} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 m-0">Job Description</h3>
                  </div>
                  <div 
                    className="prose prose-slate max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </section>

              {/* Requirements & Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.responsibilities?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-50">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 m-0">Responsibilities</h3>
                    </div>
                    <ul className="list-none p-0">
                      {job.responsibilities.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600 mb-2 last:mb-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {job.requirements?.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-50">
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 m-0">Requirements</h3>
                    </div>
                    <ul className="list-none p-0">
                      {job.requirements.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600 mb-2 last:mb-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary flex-shrink-0">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Education</h4>
                      <p className="text-sm font-bold text-gray-700 leading-tight">{job.education || "Not specified"}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <FontAwesomeIcon icon={faClock} className="text-xl" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Experience</h4>
                      <p className="text-sm font-bold text-gray-700 leading-tight">{job.experience || "Not specified"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </Card>
          </div>

          {/* Company & Location Info */}
          <Card className="border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 m-0">About Company</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4">
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faUsers} className="text-primary/40 w-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase w-24">Size:</span>
                    <span className="text-sm font-semibold text-gray-700">{job.companySize || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faSitemap} className="text-primary/40 w-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase w-24">Industry:</span>
                    <span className="text-sm font-semibold text-gray-700">{job.industry || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faGlobe} className="text-primary/40 w-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase w-24">Website:</span>
                    <a href={job.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">
                      Visit Site
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary/40 w-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase w-24">Founded:</span>
                    <span className="text-sm font-semibold text-gray-700">{job.founded || "N/A"}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-start gap-4">
                  <FontAwesomeIcon icon={faLocationDot} className="mt-1 text-primary/40" />
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Office Address</h4>
                    <p className="text-sm text-gray-600 m-0 whitespace-pre-line">{job.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Job Summary Sidebar */}
          <div className="mb-4">
          <Card className="border-gray-200 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
              <div className="bg-primary/5 p-4 border-b border-gray-100">
                <h4 className="m-0 font-bold text-primary uppercase text-xs tracking-widest">Job Overview</h4>
              </div>
             <div className="p-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50 mb-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posted Date</span>
                   <span className="text-sm font-bold text-gray-700">{formatDate(job.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50 mb-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Applications</span>
                   <Tag color="blue" className="m-0 rounded-full border-none font-bold">{job.applicantsCount || 0}</Tag>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50 mb-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age Range</span>
                   <span className="text-sm font-bold text-gray-700">{job.ageRange || "Any"}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50 mb-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</span>
                   <span className="text-sm font-bold text-gray-700">{job.department || "General"}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reporting To</span>
                   <span className="text-sm font-bold text-gray-700">{job.reportingTo || "Manager"}</span>
                </div>
             </div>
          </Card>
          </div>

          {/* Benefits & Facilities */}
          <div className="mb-4">
          <Card className="border-gray-200 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
              <div className="bg-emerald-50/50 p-4 border-b border-emerald-50">
                <h4 className="m-0 font-bold text-emerald-600 uppercase text-xs tracking-widest">Extra Benefits</h4>
              </div>
              <div className="p-6">
                {/* Visual Facility Tags */}
                <div className="flex flex-wrap gap-4 mb-4">
                   {job.benefits?.map((benefit: string) => (
                      <Tag key={benefit} className="m-0 bg-emerald-50 border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase px-2 py-1 rounded-lg">
                        {benefit}
                      </Tag>
                   ))}
                </div>

                {/* Specific Facilities */}
                <div className="pt-2">
                   <div className="flex items-center gap-4 mb-4">
                      <FontAwesomeIcon icon={faUtensils} className="text-emerald-500 w-4" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Lunch</p>
                        <p className="text-xs font-bold text-gray-700 m-0">{job.lunchFacility || "No"}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 mb-4">
                      <FontAwesomeIcon icon={faGift} className="text-rose-500 w-4" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Bonus</p>
                        <p className="text-xs font-bold text-gray-700 m-0">{job.festivalBonus || "Yes"}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 mb-4">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500 w-4" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Health Insurance</p>
                        <p className="text-xs font-bold text-gray-700 m-0">{job.healthInsurance ? "Included" : "N/A"}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 mb-4">
                      <FontAwesomeIcon icon={faHandHoldingHeart} className="text-purple-500 w-4" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Performance Bonus</p>
                        <p className="text-xs font-bold text-gray-700 m-0">{job.performanceBonus ? "Yes" : "No"}</p>
                      </div>
                   </div>
                </div>
             </div>
          </Card>
          </div>

          {/* Tools & Languages */}
          <div className="mb-4">
          {(job.tools?.length > 0 || job.languages?.length > 0) && (
            <Card title="Skills & Languages" className="border-gray-200 rounded-2xl overflow-hidden">
               <div>
                  {job.tools?.length > 0 && (
                    <section>
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Required Tools</p>
                       <div className="flex flex-wrap gap-4">
                          {job.tools.map((tool: string) => (
                            <Tag key={tool} className="m-0 bg-blue-50 border-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg">
                               {tool}
                            </Tag>
                          ))}
                       </div>
                     </section>
                  )}
                  {job.languages?.length > 0 && (
                    <section className="mt-4">
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Languages</p>
                       <div className="flex flex-wrap gap-4">
                          {job.languages.map((lang: string) => (
                            <Tag key={lang} className="m-0 bg-gray-50 border-gray-200 text-gray-600 font-bold px-3 py-1 rounded-lg">
                               {lang}
                            </Tag>
                          ))}
                       </div>
                    </section>
                  )}
               </div>
            </Card>
          )}
          </div>

          {/* Contact Details */}
          <Card className="border-none rounded-2xl bg-slate-900 text-white overflow-hidden relative">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
             
             <div className="relative z-10">
                <h4 className="m-0 font-bold text-white uppercase text-xs tracking-widest opacity-60 mb-4">Direct Contact</h4>
                
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary">
                        <FontAwesomeIcon icon={faUserGroup} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Contact Person</p>
                        <p className="text-sm font-bold text-white m-0">{job.contactPerson || "HR Department"}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-emerald-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Email</p>
                        <p className="text-xs font-bold text-white m-0 truncate">{job.email || "hr@company.com"}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sky-400">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 m-0">Phone</p>
                        <p className="text-sm font-bold text-white m-0">{job.phone || "+880..."}</p>
                      </div>
                   </div>
                </div>

                <Divider className="my-6 border-white/5" />

                <CustomButton 
                  variant="primary" 
                  className="w-full h-12 rounded-lg text-xs font-bold uppercase tracking-widest"
                  onClick={() => window.open(job.applicationLink || '#', '_blank')}
                >
                  View Application Link
                </CustomButton>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
