import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

export const violationService = {
  getViolations: async (satpamUuid: string, limit: number = 7, cursor: string | null = null) => {
    const params = new URLSearchParams({ satpam: satpamUuid, limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/violations?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data pelanggaran");
    return res.json();
  },
  createViolation: async (payload: { satpam_uuid: string; type: string; description: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/violations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (result.error?.code === "VIOLATION_STEP_SKIPPED") {
        const requires = result.error.details?.requires;
        throw new Error(`Pelanggaran harus berurutan. Anda harus menerbitkan ${requires} terlebih dahulu.`);
      }
      if (result.error?.code === "VIOLATION_TYPE_EXISTS") {
        throw new Error("Pelanggaran tipe ini masih aktif untuk satpam tersebut. Hapus yang lama terlebih dahulu jika ingin merevisi.");
      }
      if (result.error?.code === "SATPAM_NOT_ASSIGNED") {
        throw new Error("Satpam belum ditugaskan ke klien manapun.");
      }
      throw new Error(result.error?.message || result.message || "Gagal membuat pelanggaran");
    }
    return result;
  },
  updateViolation: async (uuid: string, description: string) => {
    const res = await fetchWithAuth(`${API_BASE}/violations/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ description }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || "Gagal mengupdate pelanggaran");
    return result;
  },
  deleteViolation: async (uuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/violations/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal menghapus pelanggaran");
    return result;
  },
};
