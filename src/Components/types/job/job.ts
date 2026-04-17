export interface TJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  subCategory: string;
  salaryMin: string;
  salaryMax: string;
  experience: string;
  deadline: string;
  description: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  status: boolean;
  createdAt: string;
}
