import { defineStore } from "pinia";
import { murajaahService } from "../services/murajaah.service";
import { shouldFetch } from '../utils/cacheTTL';

const TTL = 5 * 60 * 1000; // 5 minutes

export const useMurajaahStore = defineStore("murajaah", {
  state: () => ({
    blocks: [],
    loading: false,
    error: null,
    lastFetched: null
  }),

  getters: {
    activeBlocks: (state) =>
      state.blocks.filter(b => b.status === "ACTIVE")
  },

  actions: {

    async fetchAll(force = false) {

    if (!shouldFetch({
      lastFetched: this.lastFetched,
      ttl: TTL,
      dataLength: this.blocks.length,
      force
    })) return;

    this.loading = true;

    try {
      const res = await murajaahService.all();
      this.blocks = res.data || [];
      this.lastFetched = Date.now();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },

    async submitReview(payload) {
      await murajaahService.review(payload);
      await this.fetchAll();
    },

    async mergeBlocks(payload) {
      await murajaahService.merge(payload);
      await this.fetchAll();
    }

  }
});