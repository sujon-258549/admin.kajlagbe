export interface TRole {
  id: string;
  role: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TRoleCreateUpdatePayload {
  role: string;
  description?: string;
  isActive: boolean;
}

export interface TRoleMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TRoleResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TRoleMeta;
}
