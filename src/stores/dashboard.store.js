import { defineStore } from "pinia";
import { dashboardService } from "../services/dashboard.service";
import { shouldFetch } from "../utils/cacheTTL";

const TTL = 2 * 60 * 1000; // 2 minutes

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    summary: null,
    weeklyActivity: [],
    loading: false,
    error: null,
    lastFetched: null
  }),

  actions: {

    async fetchSummary(force = false) {

      if (!shouldFetch({
        lastFetched: this.lastFetched,
        ttl: TTL,
        dataLength: this.summary ? 1 : 0,
        force
      })) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await dashboardService.getSummary();
        this.summary = res.data;
        this.lastFetched = Date.now();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }

  }
});