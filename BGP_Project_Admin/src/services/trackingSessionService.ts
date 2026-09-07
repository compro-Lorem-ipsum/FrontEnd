import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

export const trackingSessionService = {
  getAll: async (params: { limit?: number; cursor?: string | null; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL_API}/tracking-sessions?${queryString}` : `${BASE_URL_API}/tracking-sessions`;

    const res = await fetchWithAuth(url, {
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
