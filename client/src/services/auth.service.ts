import api from "./api";

export const authService = {
  async login(credentials: any) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(userData: any) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem("agrosense_user");
    localStorage.removeItem("agrosense_token");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("agrosense_user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
