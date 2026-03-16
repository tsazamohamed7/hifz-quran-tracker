// src/api/http.js

const BASE_URL = import.meta.env.VITE_API_URL;

async function handleResponse(res) {
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();

  if (data.success === false) {
    throw new Error(data.error || "API Error");
  }

  return data;
}

export async function apiGet({ action, ...params } = {}) {
  const url = new URL(BASE_URL);

  url.searchParams.append("action", action);

  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null) {
      url.searchParams.append(k, params[k]);
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET"
  });

  return handleResponse(res);
}

export async function apiPost({ action, body } = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.append("action", action);

  const formData = new URLSearchParams();

Object.keys(body || {}).forEach(key => {
  const value = body[key];

  if (Array.isArray(value) || typeof value === "object") {
    formData.append(key, JSON.stringify(value));
  } else {
    formData.append(key, value);
  }
});

  const res = await fetch(url.toString(), {
    method: "POST",
    body: formData
  });

  return handleResponse(res);
}