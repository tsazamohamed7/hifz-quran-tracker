// src/services/reference.service.js
import { apiGet } from "../api/http";

export default {
  surahList() {
    return apiGet({ action: 'reference.surahList' })
  }
}