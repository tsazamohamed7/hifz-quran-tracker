import { apiGet, apiPost } from "../api/http";

export const murajaahService = {

  async all() {
    return apiGet({ action: "murajaah.all" });
  },

  async review(payload) {
    return apiPost({
      action: "murajaah.review",
      body: payload
    });
  },

  async merge(payload) {
    return apiPost({
      action: "murajaah.merge",
      body: payload
    });
  }

};