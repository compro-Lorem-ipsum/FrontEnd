import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addToast } from "@heroui/react";
import { satpamService } from "../services/satpamService";

export const enumgender = [
  { key: "1", label: "Laki-Laki" },
  { key: "2", label: "Perempuan" },
];

export const jabatan = [
  { key: "chief", label: "Chief" },
  { key: "danru", label: "Danru" },
  { key: "anggota", label: "Anggota" },
];

export const statuspegawai = [
  { key: "active", label: "Aktif" },
  { key: "inactive", label: "Non Aktif" },
  { key: "resign", label: "Resign" },
];

export const hubunganOptions = [
  { key: "wali", label: "Wali" },
  { key: "pasangan", label: "Pasangan" },
  { key: "anak", label: "Anak" },
  { key: "saudara", label: "Saudara" },
];

export interface EmergencyContact {
  id?: string;
  nama: string;
  hubungan: string;
  kontak: string;
}

export const useAdminEditDetailSatpam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.state?.uuid;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [satpamData, setSatpamData] = useState({
    nama: "",
    asal_daerah: "",
    gender: "",
    jabatan: "",
    nip: "",
    email: "",
    status: "",
  });

  const [kontakUtama, setKontakUtama] = useState("");
  const [nrg, setNrg] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [uploadedObjectUuid, setUploadedObjectUuid] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (!uuid) {
      navigate(-1);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await satpamService.getById(uuid);
        const sat = res.data;
        setSatpamData({
          nama: sat.nama || "",
          asal_daerah: sat.asal_daerah || "",
          gender: sat.gender || "",
          jabatan: sat.jabatan || "",
          nip: sat.nip || "",
          email: sat.email || "",
          status: sat.status || "active",
        });
        setKontakUtama(sat.nomor_hp || sat.no_telp || "");
        setNrg(sat.nrg || "");
        if (sat.avatar?.view_url) {
          setExistingAvatarUrl(sat.avatar.view_url);
        }

        const contactsRes = await satpamService.getResource(uuid, "emergency-contacts");
        setEmergencyContacts(contactsRes.data || []);
      } catch (err: any) {
        addToast({ title: "Gagal", description: "Gagal memuat data satpam", color: "danger", variant: "flat" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [uuid, navigate]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "nip" && value && !/^\d*$/.test(value)) return;
    setSatpamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKontakUtamaChange = (value: string) => {
    if (value && !/^\d*$/.test(value)) return;
    setKontakUtama(value);
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    if (field === "kontak" && value && !/^\d*$/.test(value)) return;
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleAddContact = () => {
    if (emergencyContacts.length < 2) {
      setEmergencyContacts([...emergencyContacts, { nama: "", hubungan: "", kontak: "" }]);
    }
  };

  const handleRemoveContact = (index: number) => {
    const updated = [...emergencyContacts];
    if (!updated[index].id) {
      updated.splice(index, 1);
    } else {
      updated[index].nama = "";
      updated[index].hubungan = "";
      updated[index].kontak = "";
    }
    setEmergencyContacts(updated);
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarFile(file);
    setIsUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || "jpg";
      const uploadData = await satpamService.getAvatarUploadUrl(ext);
      await satpamService.uploadToGcs(uploadData.upload_url, uploadData.fields, file);
      setUploadedObjectUuid(uploadData.object_uuid);
      addToast({ title: "Berhasil", description: "Foto berhasil diunggah", color: "success", variant: "flat" });
    } catch (err: any) {
      addToast({ title: "Gagal", description: "Gagal mengunggah foto", color: "danger", variant: "flat" });
      setAvatarFile(null);
      setUploadedObjectUuid(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!uuid) return;
    setIsSaving(true);
    try {
      const payload: any = {
        nama: satpamData.nama,
        nip: satpamData.nip,
        gender: satpamData.gender,
        asal_daerah: satpamData.asal_daerah,
        jabatan: satpamData.jabatan,
        email: satpamData.email,
        status: satpamData.status,
        kontak_utama: kontakUtama
      };
      if (uploadedObjectUuid) {
        payload.object_uuid = uploadedObjectUuid;
        let success = false;
        for (let i = 0; i < 15; i++) {
          try {
            await satpamService.update(uuid, payload);
            success = true;
            break;
          } catch (err: any) {
            if (err.message && err.message.includes("not validated yet")) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw err;
          }
        }
        if (!success) {
          throw new Error("Gagal menyimpan: Avatar masih diproses oleh server, silakan coba simpan lagi.");
        }
      } else {
        await satpamService.update(uuid, payload);
      }

      for (const ec of emergencyContacts) {
        const ecPayload = { nama: ec.nama, hubungan: ec.hubungan, kontak: ec.kontak };
        if (ec.id) {
          if (!ec.nama || !ec.hubungan || !ec.kontak) {
            await satpamService.deleteResource(uuid, "emergency-contacts", ec.id);
          } else {
            await satpamService.updateResource(uuid, "emergency-contacts", ec.id, ecPayload);
          }
        } else {
          if (ec.nama && ec.hubungan && ec.kontak) {
            await satpamService.createResource(uuid, "emergency-contacts", ecPayload);
          }
        }
      }

      addToast({ title: "Berhasil", description: "Data satpam berhasil diperbarui", color: "success", variant: "flat" });
      navigate(-1);
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message || "Gagal menyimpan perubahan", color: "danger", variant: "flat" });
    } finally {
      setIsSaving(false);
    }
  };

  const visibleContacts = emergencyContacts.filter((c) => c.nama !== "" || c.hubungan !== "" || c.kontak !== "" || !c.id);

  const isNipInvalid = satpamData.nip.length > 0 && !/^\d{1,18}$/.test(satpamData.nip);
  const isKontakUtamaInvalid = kontakUtama.length > 0 && !/^\d{8,15}$/.test(kontakUtama);
  
  const isSaveDisabled = isSaving || isUploadingAvatar || 
    isNipInvalid || isKontakUtamaInvalid || 
    !satpamData.nama || !satpamData.asal_daerah || !satpamData.gender || !satpamData.jabatan || !satpamData.nip || !satpamData.email || !satpamData.status || !kontakUtama;

  return {
    navigate,
    isLoading,
    isSaving,
    isUploadingAvatar,
    satpamData,
    kontakUtama,
    nrg,
    avatarFile,
    existingAvatarUrl,
    emergencyContacts,
    visibleContacts,
    isNipInvalid,
    isKontakUtamaInvalid,
    isSaveDisabled,
    handleInputChange,
    handleKontakUtamaChange,
    handleContactChange,
    handleAddContact,
    handleRemoveContact,
    handleAvatarUpload,
    handleSave,
  };
};
