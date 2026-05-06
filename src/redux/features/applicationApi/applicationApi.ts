import { baseApi } from "../../api/baseApi";

const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (data) => ({
        url: "/application",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Application"],
    }),
    getAllApplications: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/application",
          method: "GET",
          params,
        };
      },
      providesTags: ["Application"],
    }),
    getApplicationById: builder.query({
      query: (id) => `/application/${id}`,
      providesTags: ["Application"],
    }),
    updateApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `/application/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Application"],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/application/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationApi;
