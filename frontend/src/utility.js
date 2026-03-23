import { twMerge } from "tailwind-merge";

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(diff / 1000 / 60);
  const hours   = Math.round(diff / 1000 / 60 / 60);
  const days    = Math.round(diff / 1000 / 60 / 60 / 24);

  if (days !== 0)   return rtf.format(-days, "day");
  if (hours !== 0)  return rtf.format(-hours, "hour");
  if (minutes !== 0)return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}

export function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

export function tw(...args) {
  return twMerge(args);
}

const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

async function parseBody(res) {
  // Some endpoints might return empty bodies
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  return await res.text(); // fallback
}

async function request(path, { method = "GET", body, headers, ...init } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  const data = await parseBody(res);

  if (!res.ok) {
    // Your backend seems to send { error: "..." }
    const message =
      (data && typeof data === "object" && "error" in data && data.error) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;

    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path, init) => request(path, { ...init, method: "GET" }),
  post: (path, body, init) => request(path, { ...init, method: "POST", body }),
  put: (path, body, init) => request(path, { ...init, method: "PUT", body }),
  patch: (path, body, init) => request(path, { ...init, method: "PATCH", body }),
  del: (path, body, init) => request(path, { ...init, method: "DELETE", body }),
};