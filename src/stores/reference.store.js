import { defineStore } from "pinia";
import referenceService from "../services/reference.service";

export const useReferenceStore = defineStore("reference", {
  state: () => ({
    surahList: [],
    loading: false,
    error: null
  }),

  persist: true, // 🔥 THIS enables localStorage persistence

  actions: {

    async fetchSurahList(force = false) {

      // if already loaded and not forced, skip
      if (this.surahList.length && !force) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await referenceService.surahList();
        this.surahList = res.data || [];
      } catch (err) {
        this.error = err.message || "Failed to load reference.";
      } finally {
        this.loading = false;
      }
    }

  }
});