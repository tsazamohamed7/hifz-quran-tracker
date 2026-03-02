// src/stores/hifz.store.js
import { defineStore } from "pinia";
import { hifzService } from "../services/hifz.service";
import { shouldFetch } from "../utils/cacheTTL";

const TTL = 5 * 60 * 1000; // 5 minutes

export const useHifzStore = defineStore("hifz", {
  state: () => ({
    blocks: [],
    loading: false,
    error: null,
    lastFetched: null
  }),

  getters: {
    activeBlocks: (state) =>
      state.blocks.filter(b => b.status === "ACTIVE"),

    surahProgress: (state) => {
      const map = {};

      state.blocks.forEach(b => {
        if (b.status !== "ACTIVE") return;

        const ayahCount = b.end_ayah - b.start_ayah + 1;

        if (!map[b.surah_no]) {
          map[b.surah_no] = {
            surahNumber: b.surah_no,
            memorizedAyah: 0,
            totalAyah: 0
          };
        }

        map[b.surah_no].memorizedAyah += ayahCount;
      });

      return Object.values(map);
    }
  },

  actions: {

    resetError() {
      this.error = null;
    },

    async fetchBlocks(force = false) {

      if (!shouldFetch({
        lastFetched: this.lastFetched,
        ttl: TTL,
        dataLength: this.blocks.length,
        force
      })) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await hifzService.list();
        this.blocks = res.data || [];
        this.lastFetched = Date.now();
      } catch (err) {
        this.error = err.message || "Failed to load hifz.";
      } finally {
        this.loading = false;
      }
    },

    async addBlock(payload) {
      this.loading = true;
      this.error = null;

      try {
        await hifzService.add(payload);

        // invalidate cache
        this.lastFetched = null;

        await this.fetchBlocks(true);
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateBlock(payload) {
      this.loading = true;
      this.error = null;

      try {
        await hifzService.update(payload);

        this.lastFetched = null;
        await this.fetchBlocks(true);
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async mergeBlocks(payload) {
      this.loading = true;
      this.error = null;

      try {
        await hifzService.merge(payload);

        this.lastFetched = null;
        await this.fetchBlocks(true);
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});