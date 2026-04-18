import api from "./api";

export const userService = {
  async updateSettings(userId: string, settings: { deviceId?: string; isMonitoringActive?: boolean }) {
    const response = await api.patch("/users/settings", {
      userId,
      ...settings
    });
    return response.data;
  }
};
