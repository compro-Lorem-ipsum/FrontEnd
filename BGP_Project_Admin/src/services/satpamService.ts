import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type {
  SatpamResponse,
  Satpam,
} from "../types/satpam";
import type { UserResponse } from "../types/user";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = (isMultipart: boolean = false) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const satpamService = {
  getAll: async (limit: number = 7, cursor: string | null = null): Promise<SatpamResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/satpam/?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: Satpam }> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  update: async (uuid: string, formData: FormData): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: formData,
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.message || "Gagal mengupdate data satpam");
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal menghapus data");
  },

  getMitraOptions: async (cursor: string | null = null): Promise<UserResponse> => {
    const params = new URLSearchParams({ limit: "50" });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/client?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return res.json();
  },

  getAssignment: async (satpamUuid: string): Promise<{ data: { assigned: boolean; client?: { uuid: string; nama: string } } }> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${satpamUuid}/assignment`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data penugasan");
    return res.json();
  },

  assignMitra: async (satpamUuid: string, clientUuid: string): Promise<void> => {
    const url = `${API_BASE}/satpam/${satpamUuid}/assignment`;
    const payload = clientUuid === "unassign" ? { client_uuid: null } : { client_uuid: clientUuid };
    const body = JSON.stringify(payload);

    const res = await fetchWithAuth(url, {
      method: "PUT",
      headers: getHeaders(),
      body,
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.message || "Gagal menyimpan perubahan penugasan");
  },

  approve: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal menyetujui akun");
  },

  reject: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/reject`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal menolak akun");
  },
};
