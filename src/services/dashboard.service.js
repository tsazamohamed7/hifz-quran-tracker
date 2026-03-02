// src/services/dashboard.service.js
import { apiGet } from "../api/http";

export const dashboardService = {
  async getSummary() {
    return apiGet({ action: "dashboard.summary" });
  },

  async getWeeklyActivity() {
    return apiGet({ action: "getWeeklyActivity" });
  }
};