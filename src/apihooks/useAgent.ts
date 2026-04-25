import { useGenerateAgentResponseMutation } from "../redux/features/agentApi/agentApi";

export const useAgent = () => {
  const [generateResponse, { isLoading, error, data }] = useGenerateAgentResponseMutation();

  const generate = async (content: string) => {
    try {
      const result = await generateResponse({ content }).unwrap();
      return result;
    } catch (err) {
      console.error("Agent Generation Error:", err);
      throw err;
    }
  };

  return {
    generate,
    isLoading,
    error,
    data: data?.data,
  };
};
