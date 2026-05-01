import { baseApi } from "../../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
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
          url: "/notification",
          method: "GET",
          params,
        };
      },
      providesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notification/mark-as-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    updateNotification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notification/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useMarkAllAsReadMutation,
  useUpdateNotificationMutation,
} = notificationApi;

