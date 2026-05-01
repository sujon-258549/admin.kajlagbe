import { baseApi } from "../../api/baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts with dynamic query params
    getAllContacts: builder.query({
      query: (args: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([name, value]) => {
            if (value !== undefined) {
              params.append(name, String(value));
            }
          });
        }
        return {
          url: "/contact",
          method: "GET",
          params,
        };
      },
      providesTags: ["Contact"],
    }),

    // Get single contact
    getContactById: builder.query({
      query: (id) => `/contact/${id}`,
      providesTags: ["Contact"],
    }),

    // Delete contact (assuming there might be a delete endpoint)
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
} = contactApi;
