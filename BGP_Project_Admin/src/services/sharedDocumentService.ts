import { fetchWithAuth } from "../Utils/fetchWithAuth";
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

export const sharedDocumentService = {
  getAll: async (limit: number = 20, cursor: string | null = null) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/shared-documents?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getUploadUrl: async () => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/upload-url`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil URL unggah dokumen");
    const json = await res.json();
    return json.data || json;
  },

  uploadToGcs: async (uploadUrl: string, fields: Record<string, string>, file: File) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    if (!res.ok && res.status !== 204) {
      throw new Error("Gagal mengunggah file ke bucket");
    }
  },

  create: async (payload: { nama: string; deskripsi?: string; object_uuid: string; recipient: any }) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal membuat dokumen");
    return result;
  }
};
