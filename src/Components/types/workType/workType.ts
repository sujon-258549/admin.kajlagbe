export type TWorkType = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateWorkTypeRequest = {
  name: string;
  description?: string;
};

export type UpdateWorkTypeRequest = Partial<CreateWorkTypeRequest>;
