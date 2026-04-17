export interface TFolder {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
  parent?: {
    id: string;
    name: string;
  } | null;
  /** API may return nested folder tree */
  children?: TFolder[];
}

export interface TFolderCreateUpdatePayload {
  name: string;
  slug?: string;
  parentId?: string;
  status: boolean;
}

export interface TFolderMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TFolderListPayload {
  folders: TFolder[];
  meta: TFolderMeta;
}

export interface TFolderResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TFolderMeta;
}
