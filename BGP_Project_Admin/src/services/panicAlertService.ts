import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { PanicAlertActiveResponse, PanicAlertsResponse } from "../types/panicAlert";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const panicAlertService = {
  getActive: async (): Promise<PanicAlertActiveResponse> => {
    const response = await fetchWithAuth(`${BASE_URL_API}/alerts/active`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Gagal mengambil data panic alert aktif");
    }
    return response.json();
  },

  getAll: async (
    limit: number,
    cursor?: string | null,
    satpam?: string,
    status?: string
  ): Promise<PanicAlertsResponse> => {
    let url = `${BASE_URL_API}/alerts?limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    if (satpam) url += `&satpam=${encodeURIComponent(satpam)}`;
    if (status) url += `&status=${status}`;

    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data riwayat panic alert");
    }
    return response.json();
  },

  resolve: async (uuid: string): Promise<any> => {
    const response = await fetchWithAuth(`${BASE_URL_API}/alerts/${uuid}/resolve`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Gagal menyelesaikan panic alert");
    }
    return response.json();
  },

  handle: async (uuid: string): Promise<any> => {
    const response = await fetchWithAuth(`${BASE_URL_API}/alerts/${uuid}/handle`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Gagal menangani panic alert");
    }
    return response.json();
  },
};
