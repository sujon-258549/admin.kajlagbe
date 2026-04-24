/** Library image row (Prisma `Image` / `GET /media/images`). */
export interface TMediaImage {
  id: string;
  name: string;
  url: string;
  folderId: string | null;
  slug: string;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TMediaImageCreatePayload {
  name: string;
  url: string;
  folderId?: string | null;
}

/** `PATCH /media/image/:id` — backend currently accepts `name` (slug derived server-side). */
export interface TMediaImageUpdatePayload {
  name: string;
}

export interface TMediaResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Image rows nested on folder tree nodes (`include.images` from API). */
export interface TFolderImageListItem {
  id?: string;
  name: string;
  url: string;
  folderId?: string | null;
}

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
  /** Images stored in this folder (from folder list/tree API). */
  images?: TFolderImageListItem[];
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
  /** Root library images (`folderId: null`) when API returns `data.images`. */
  rootImages?: TFolderImageListItem[];
}
