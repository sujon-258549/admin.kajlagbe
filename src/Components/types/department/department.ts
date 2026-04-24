export interface TDepartment {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TDepartmentCreateUpdatePayload {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface TDepartmentMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TDepartmentResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TDepartmentMeta;
}
