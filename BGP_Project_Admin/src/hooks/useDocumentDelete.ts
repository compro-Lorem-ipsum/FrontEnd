import { useState } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { sharedDocumentService } from "../services/sharedDocumentService";

export const useDocumentDelete = (refreshData: () => void) => {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeletePrompt = (item: any) => {
    setDeleteTarget(item);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await sharedDocumentService.remove(deleteTarget.uuid);
      addToast({
        title: "Berhasil",
        description: "Dokumen berhasil dihapus",
        color: "success",
        variant: "flat",
      });
      refreshData();
      onDeleteClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus dokumen",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null); // Optional: clear target
    }
  };

  return {
    isDeleteOpen,
    onDeleteClose,
    deleteTarget,
    deleting,
    handleDeletePrompt,
    handleConfirmDelete,
  };
};
