import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

export const trackingSessionService = {
  getAll: async (params: { limit?: number; cursor?: string | null; search?: string }) => {
    const url = new URL(`${BASE_URL_API}/tracking-sessions`);
    
    if (params.limit) url.searchParams.append("limit", params.limit.toString());
    if (params.cursor) url.searchParams.append("cursor", params.cursor);
    if (params.search) url.searchParams.append("search", params.search);

    const res = await fetchWithAuth(url.toString(), {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || "Failed to fetch tracking sessions");
    }

    return await res.json();
  },

  getById: async (uuid: string) => {
    const res = await fetchWithAuth(`${BASE_URL_API}/tracking-sessions/${uuid}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || "Failed to fetch tracking session detail");
    }

    return await res.json();
  }
};
