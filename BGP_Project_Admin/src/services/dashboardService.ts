import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const dashboardService = {
  getDashboard: async () => {
    return fetchWithAuth(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      headers: getHeaders(),
    });
  },

  getOffenders: async (limit?: number, days?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (days) params.append("days", days.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchWithAuth(`${API_BASE_URL}/dashboard/offenders${queryString}`, {
      method: "GET",
      headers: getHeaders(),
    });
  },
};
