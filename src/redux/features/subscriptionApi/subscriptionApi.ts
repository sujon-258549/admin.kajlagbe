import { baseApi } from "../../api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    getAllSubscriptions: builder.query({
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
          url: "/subscription",
          method: "GET",
          params,
        };
      },
      providesTags: ["Subscription"],
    }),
    getSubscriptionById: builder.query({
      query: (id) => `/subscription/${id}`,
      providesTags: ["Subscription"],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    changeSubscriptionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/subscription/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useChangeSubscriptionStatusMutation,
} = subscriptionApi;
