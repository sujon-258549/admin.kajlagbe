import { baseApi } from "../../api/baseApi";

const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAgentResponse: builder.mutation<any, { content: string }>({
      query: (data) => ({
        url: "/agent/generate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateAgentResponseMutation } = agentApi;
