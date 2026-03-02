// src/services/hifz.service.js
import { apiGet, apiPost } from "../api/http";

export const hifzService = {

  async list() {
    return apiGet({ action: "hifz.list" });
  },

  async add(payload) {
    return apiPost({
      action: "hifz.add",
      body: payload
    });
  },

  async update(payload) {
    return apiPost({
      action: "hifz.update",
      body: payload
    });
  },

  async merge(payload) {
    return apiPost({
      action: "hifz.merge",
      body: payload
    });
  }

};