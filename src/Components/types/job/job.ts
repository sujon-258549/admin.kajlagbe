import type { TMediaImage } from "../media/media";

export interface TJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: any;
  subCategory: any;
  salaryMin: string;
  salaryMax: string;
  experience: string;
  deadline: string;
  description: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  status: boolean;
  thumbnailId?: string;
  thumbnail?: TMediaImage;
  createdAt: string;
}
