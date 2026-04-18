import api from "./api";

export const readingService = {
  async getLatestReadings(deviceId: string) {
    const response = await api.get(`/readings/latest/${deviceId}`);
    return response.data;
  },

  async getHistory(deviceId: string) {
    const response = await api.get(`/readings/history/${deviceId}`);
    return response.data;
  }
};
