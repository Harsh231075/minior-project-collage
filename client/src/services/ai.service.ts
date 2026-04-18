import api from "./api";

export const aiService = {
  async chat(messages: any[], deviceId: string | null) {
    const response = await api.post("/ai/chat", {
      messages,
      deviceId
    });
    return response.data;
  }
};
