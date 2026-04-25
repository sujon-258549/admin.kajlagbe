import { baseApi } from "../../api/baseApi";

const automationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    triggerFollowUpEmails: builder.mutation({
      query: () => ({
        url: "/automation/trigger-follow-up",
        method: "POST",
      }),
    }),
    sendIndividualFollowUp: builder.mutation({
      query: (data: { userId: string; subject: string; content: string }) => ({
        url: "/automation/send-individual",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useTriggerFollowUpEmailsMutation,
  useSendIndividualFollowUpMutation,
} = automationApi;
