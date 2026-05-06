export interface TApplication {
  id: string;
  jobId: string;
  userId: string;
  resume?: string;
  coverLetter?: string;
  applyNote?: string;
  applyComment?: string;
  applyStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  isRead: boolean;
  isDeleted: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    profile?: {
      name?: string;
      photo?: string;
    };
  };
  job?: {
    title: string;
  };
}
