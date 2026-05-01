/** Sub-category list / mutations (category module API shapes). */

export interface TSubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  icon?: string;
  slug: string;
  status: boolean;
  image?: string;
  imageId?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: TMeta;
}
