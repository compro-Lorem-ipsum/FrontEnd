import { useState, useEffect } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { sharedDocumentService } from "../services/sharedDocumentService";
import { satpamService } from "../services/satpamService";

const ALL_KEY = "semua";

export const useSharedDocumentForm = (refreshData: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [targetOptions, setTargetOptions] = useState<{key: string, label: string}[]>([{key: ALL_KEY, label: "Semua Client"}]);
  const [loadingTargets, setLoadingTargets] = useState(false);

  useEffect(() => {
    fetchTargetOptions();
  }, []);

  const fetchTargetOptions = async () => {
    setLoadingTargets(true);
    try {
      const res = await satpamService.getMitraOptions();
      if (res && res.data) {
        const options = res.data.map((m: any) => ({
          key: m.uuid,
          label: m.nama,
        }));
        setTargetOptions([{key: ALL_KEY, label: "Semua Client"}, ...options]);
      }
    } catch (error) {
      console.error("Failed to load targets", error);
    } finally {
      setLoadingTargets(false);
    }
  };

  const clearAll = () => setSelectedKeys(new Set());

  const handleSelectionChange = (keys: any) => {
    const keysArray = Array.from(keys as Set<string>);

    if (keysArray.includes(ALL_KEY) && !selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set(targetOptions.map((t) => t.key)));
      return;
    }

    if (!keysArray.includes(ALL_KEY) && selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set());
      return;
    }

    const withoutAll = keysArray.filter((k) => k !== ALL_KEY);
    const allNonAllKeys = targetOptions
      .filter((t) => t.key !== ALL_KEY)
      .map((t) => t.key);
    const allSelected = allNonAllKeys.length > 0 && allNonAllKeys.every((k) => withoutAll.includes(k));

    if (allSelected) {
      setSelectedKeys(new Set(targetOptions.map((t) => t.key)));
    } else {
      setSelectedKeys(new Set(withoutAll));
    }
  };

  const openCreateModal = () => {
    setJudul("");
    setDeskripsi("");
    setFile(null);
    setSelectedKeys(new Set());
    onOpen();
  };

  const handleSubmit = async () => {
    if (!judul.trim()) {
      addToast({ title: "Gagal", description: "Judul tidak boleh kosong", color: "danger", variant: "flat" });
      return;
    }
    if (!file) {
      addToast({ title: "Gagal", description: "Dokumen belum diunggah", color: "danger", variant: "flat" });
      return;
    }
    if (selectedKeys.size === 0) {
      addToast({ title: "Gagal", description: "Pilih target penerima", color: "danger", variant: "flat" });
      return;
    }

    let recipient: any = {};
    if (selectedKeys.has(ALL_KEY)) {
      recipient = { type: "all_client" };
    } else {
      const selectedUuids = Array.from(selectedKeys).filter((key) => key !== ALL_KEY);
      recipient = { type: "client", client_ids: selectedUuids };
    }

    setSubmitting(true);
    try {
      // 1. Get Upload URL
      const uploadData = await sharedDocumentService.getUploadUrl();
      const { object_uuid, upload_url, fields } = uploadData;

      // 2. Upload to GCS
      await sharedDocumentService.uploadToGcs(upload_url, fields, file);

      // 3. Create document record
      const payload = {
        nama: judul,
        deskripsi: deskripsi,
        object_uuid: object_uuid,
        recipient: recipient
      };
      await sharedDocumentService.create(payload);

      addToast({
        title: "Berhasil",
        description: "Dokumen berhasil diunggah.",
        color: "success",
        variant: "flat",
      });

      refreshData();
      onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal mengunggah dokumen",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isOpen,
    onClose,
    judul,
    setJudul,
    deskripsi,
    setDeskripsi,
    file,
    setFile,
    selectedKeys,
    submitting,
    targetOptions,
    loadingTargets,
    handleSelectionChange,
    clearAll,
    openCreateModal,
    handleSubmit,
    ALL_KEY
  };
};
