import { baseApi } from "../../api/baseApi";
import type {
  TFolder,
  TFolderCreateUpdatePayload,
  TFolderImageListItem,
  TFolderMeta,
  TFolderResponse,
} from "../../../Components/types";

const defaultMeta: TFolderMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPage: 1,
};

function normalizeFolderImages(raw: unknown): TFolderImageListItem[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: TFolderImageListItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const im = item as Record<string, unknown>;
    const url = typeof im.url === "string" ? im.url : "";
    if (!url) continue;
    out.push({
      id: im.id != null ? String(im.id) : undefined,
      name: String(im.name ?? "Image"),
      url,
      folderId:
        im.folderId === null || im.folderId === undefined
          ? null
          : String(im.folderId),
    });
  }
  return out.length ? out : undefined;
}

function normalizeFolderNode(raw: unknown): TFolder | null {
  if (!raw || typeof raw !== "object") return null;
  const n = raw as Record<string, unknown>;
  const parent = n.parent as TFolder["parent"] | undefined;
  return {
    id: String(n.id ?? ""),
    name: String(n.name ?? ""),
    slug: typeof n.slug === "string" ? n.slug : undefined,
    parentId:
      (n.parentId as string | null | undefined) ??
      parent?.id ??
      null,
    status: Boolean(n.status ?? true),
    createdAt: String(n.createdAt ?? ""),
    updatedAt: n.updatedAt == null ? undefined : String(n.updatedAt),
    parent: parent ?? null,
    children: Array.isArray(n.children) ? (n.children as TFolder[]) : undefined,
    images: normalizeFolderImages(n.images),
  };
}

/** Flatten tree from API (`children` arrays) into rows with parentId. */
function flattenFolderTree(nodes: unknown[]): TFolder[] {
  const out: TFolder[] = [];
  const visit = (list: unknown[], parentId: string | null) => {
    if (!Array.isArray(list)) return;
    for (const raw of list) {
      const base = normalizeFolderNode(raw);
      if (!base?.id) continue;
      const folder: TFolder = {
        ...base,
        parentId: base.parentId ?? parentId,
      };
      out.push({ ...folder, children: undefined, images: folder.images });
      const children = (raw as Record<string, unknown>).children;
      if (Array.isArray(children) && children.length) {
        visit(children, folder.id);
      }
    }
  };
  visit(nodes, null);
  return out;
}

function pickFoldersPayload(
  input: Record<string, unknown>,
): {
  folders: unknown[];
  rootImages?: unknown[];
  meta?: TFolderMeta;
  success?: boolean;
  message?: string;
} {
  // fetchBaseQuery often passes { data: <json body>, meta } — unwrap once
  let root: Record<string, unknown> = input;
  if (
    "data" in root &&
    root.data !== null &&
    typeof root.data === "object" &&
    !Array.isArray(root.data) &&
    !("folders" in (root.data as object))
  ) {
    root = root.data as Record<string, unknown>;
  }

  // Body: { success, message, data: { folders, meta } }
  let payload: Record<string, unknown> = root;
  if (
    "data" in payload &&
    payload.data !== null &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    const inner = payload.data as Record<string, unknown>;
    if (Array.isArray(inner.folders) || inner.meta != null) {
      payload = inner;
    }
  }

  const folders = Array.isArray(payload.folders) ? payload.folders : [];
  const rootImages = Array.isArray(payload.images) ? payload.images : undefined;
  const meta = payload.meta as TFolderMeta | undefined;
  return {
    folders,
    rootImages,
    meta,
    success: typeof root.success === "boolean" ? root.success : undefined,
    message: typeof root.message === "string" ? root.message : undefined,
  };
}

function normalizeFolderListResponse(res: unknown): TFolderResponse<TFolder[]> {
  const r = (res ?? {}) as Record<string, unknown>;
  const picked = pickFoldersPayload(r);

  let rows: TFolder[] = flattenFolderTree(picked.folders);
  const rootImages = normalizeFolderImages(picked.rootImages);
  let meta: TFolderMeta = { ...defaultMeta };

  if (picked.meta && typeof picked.meta === "object") {
    const m = picked.meta;
    meta = {
      page: Number(m.page) || 1,
      limit: Number(m.limit) || 10,
      total: Number(m.total) || rows.length,
      totalPage: Number(m.totalPage) || 1,
    };
  }

  // Plain array at top-level body
  if (!rows.length && Array.isArray(r.data)) {
    rows = flattenFolderTree(r.data as unknown[]);
  }

  if (!meta.total && rows.length) {
    meta = { ...meta, total: rows.length };
  }

  const success =
    picked.success !== undefined ? picked.success : Boolean(r.success);
  const message =
    picked.message !== undefined ? picked.message : String(r.message ?? "");

  return {
    success,
    message,
    data: rows,
    meta,
    rootImages,
  };
}

export const folderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFolders: builder.query<
      TFolderResponse<TFolder[]>,
      Record<string, string | number | boolean | undefined>
    >({
      query: (args = {}) => {
        const params = new URLSearchParams();
        Object.entries(args).forEach(([name, value]) => {
          if (value !== undefined && value !== "") {
            params.append(name, String(value));
          }
        });
        return {
          url: "/folder",
          method: "GET",
          params,
        };
      },
      transformResponse: (res: unknown) => normalizeFolderListResponse(res),
      providesTags: ["Folder"],
    }),

    getFolderById: builder.query<TFolderResponse<TFolder>, string>({
      query: (id) => `/folder/${id}`,
      providesTags: ["Folder"],
    }),

    createFolder: builder.mutation<
      TFolderResponse<TFolder>,
      TFolderCreateUpdatePayload
    >({
      query: (data) => ({
        url: "/folder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    updateFolder: builder.mutation<
      TFolderResponse<TFolder>,
      { id: string; data: TFolderCreateUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/folder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    deleteFolder: builder.mutation<TFolderResponse<TFolder>, string>({
      query: (id) => ({
        url: `/folder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
    }),
  }),
});

export const {
  useGetAllFoldersQuery,
  useGetFolderByIdQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = folderApi;
