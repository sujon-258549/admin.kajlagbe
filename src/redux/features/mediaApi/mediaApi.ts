import { baseApi } from "../../api/baseApi";
import type {
  TMediaImage,
  TMediaImageCreatePayload,
  TMediaImageUpdatePayload,
  TMediaResponse,
} from "../../../Components/types";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<
      TMediaResponse<TMediaImage[]>,
      { folderId?: string | null }
    >({
      query: ({ folderId } = {}) => ({
        url: "/media/images",
        method: "GET",
        params: {
          folderId:
            folderId === null || folderId === undefined || folderId === ""
              ? "root"
              : folderId,
        },
      }),
      providesTags: (result) => {
        const rows = result?.data;
        if (!Array.isArray(rows)) {
          return [{ type: "Media" as const, id: "LIST" }];
        }
        return [
          ...rows.map((img) => ({ type: "Media" as const, id: img.id })),
          { type: "Media" as const, id: "LIST" },
        ];
      },
    }),

    createImage: builder.mutation<
      TMediaResponse<TMediaImage>,
      TMediaImageCreatePayload
    >({
      query: (body) => ({
        url: "/media/upload-image",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Media", id: "LIST" }, "Folder"],
    }),

    updateImage: builder.mutation<
      TMediaResponse<TMediaImage>,
      { id: string; data: TMediaImageUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/media/image/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Media", id },
        { type: "Media", id: "LIST" },
        "Folder",
      ],
    }),

    deleteImage: builder.mutation<TMediaResponse<TMediaImage>, string>({
      query: (id) => ({
        url: `/media/image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Media", id },
        { type: "Media", id: "LIST" },
        "Folder",
      ],
    }),
  }),
});

export const {
  useGetImagesQuery,
  useLazyGetImagesQuery,
  useCreateImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = mediaApi;
