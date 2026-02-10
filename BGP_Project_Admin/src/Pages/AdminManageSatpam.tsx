import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  addToast,
  Pagination,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalHeader,
} from "@heroui/react";

import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Asal Daerah", uid: "asal_daerah" },
  { name: "No Telp", uid: "no_telp" },
  { name: "Mitra", uid: "mitra" },
  { name: "Pembuatan", uid: "created_at" },
  { name: "Aksi", uid: "aksi" },
];

interface Satpam {
  uuid: string;
  nama: string;
  asal_daerah: string;
  nip: string;
  no_telp: string;
  image_url?: string;
  created_at?: string;
  nama_client?: string;
}

interface MitraOption {
  uuid: string;
  nama: string;
}

interface FormErrors {
  nama?: string;
  asal_daerah?: string;
  nip?: string;
  no_telp?: string;
  image?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AdminManageSatpam: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dataSatpam, setDataSatpam] = useState<Satpam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formNama, setFormNama] = useState<string>("");
  const [formAsal, setFormAsal] = useState<string>("");
  const [formNip, setFormNip] = useState<string>("");
  const [formNoTelp, setFormNoTelp] = useState<string>("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [userRole, setUserRole] = useState<string>("");

  const {
    isOpen: isMitraModalOpen,
    onOpen: onMitraOpen,
    onClose: onMitraClose,
  } = useDisclosure();

  const [selectedSatpam, setSelectedSatpam] = useState<Satpam | null>(null);
  const [mitraOptions, setMitraOptions] = useState<MitraOption[]>([]);
  const [formMitraId, setFormMitraId] = useState<string>("");
  const [loadingMitra, setLoadingMitra] = useState<boolean>(false);

  const getToken = (): string | undefined => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const getRole = (): string | undefined => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    return role || localStorage.getItem("role") || "";
  };

  const formatTanggal = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const fetchSatpam = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/satpam/?pid=${page}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const responseData = await res.json();

      if (
        responseData &&
        responseData.data &&
        Array.isArray(responseData.data.data)
      ) {
        setDataSatpam(responseData.data.data);
        if (responseData.data.pagination) {
          setTotalPages(responseData.data.pagination.total_pages);
          setRowsPerPage(responseData.data.pagination.items_per_page);
        }
      } else {
        setDataSatpam([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Fetch satpam error:", error);
      setDataSatpam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = getRole();
    if (role) {
      setUserRole(role);
    }
    fetchSatpam();
  }, [page]);

  const fetchMitraOptions = async () => {
    setLoadingMitra(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/users/options`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setMitraOptions(data.data);
      } else {
        setMitraOptions([]);
      }
    } catch (error) {
      console.error("Fetch mitra options error:", error);
      setMitraOptions([]);
    } finally {
      setLoadingMitra(false);
    }
  };

  useEffect(() => {
    if (isMitraModalOpen && selectedSatpam && mitraOptions.length > 0) {
      if (selectedSatpam.nama_client) {
        const matchedMitra = mitraOptions.find(
          (m) => m.nama === selectedSatpam.nama_client,
        );
        if (matchedMitra) {
          setFormMitraId(matchedMitra.uuid);
        } else {
          setFormMitraId("unassign");
        }
      } else {
        setFormMitraId("unassign");
      }
    }
  }, [isMitraModalOpen, selectedSatpam, mitraOptions]);

  const openMitraModal = (item: Satpam) => {
    setSelectedSatpam(item);
    setFormMitraId("");
    fetchMitraOptions();
    onMitraOpen();
  };

  const handleAssignMitra = async () => {
    if (!selectedSatpam || !formMitraId) {
      addToast({
        title: "Peringatan",
        description: "Silakan pilih opsi terlebih dahulu.",
        color: "warning",
        variant: "flat",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      let url = "";
      const method = "PUT";
      let body = null;

      if (formMitraId === "unassign") {
        url = `${API_BASE}/v1/satpam/${selectedSatpam.uuid}/unassign`;
      } else {
        url = `${API_BASE}/v1/satpam/${selectedSatpam.uuid}`;
        body = JSON.stringify({
          user_uuid: formMitraId,
        });
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: body,
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          responseData.message || "Gagal menyimpan perubahan penugasan",
        );
      }

      addToast({
        title: "Berhasil",
        description:
          formMitraId === "unassign"
            ? `Penugasan ${selectedSatpam.nama} berhasil dilepas.`
            : `Satpam ${selectedSatpam.nama} berhasil ditugaskan.`,
        color: "success",
        variant: "flat",
        timeout: 3000,
      });

      onMitraClose();
      fetchSatpam();
    } catch (error: any) {
      console.error("Assign/Unassign mitra error:", error);
      addToast({
        title: "Gagal",
        description:
          error.message || "Terjadi kesalahan saat menyimpan penugasan.",
        color: "danger",
        variant: "flat",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const headerColumns = useMemo(() => {
    if (userRole === "Client") {
      return INITIAL_COLUMNS.filter(
        (col) => col.uid !== "aksi" && col.uid !== "mitra",
      );
    }
    return INITIAL_COLUMNS;
  }, [userRole]);

  const renderCell = useCallback(
    (satpam: Satpam, columnKey: React.Key) => {
      const cellValue = satpam[columnKey as keyof Satpam];

      switch (columnKey) {
        case "no":
          return (
            <span>
              {(page - 1) * rowsPerPage +
                dataSatpam.findIndex((x) => x.uuid === satpam.uuid) +
                1}
            </span>
          );
        case "nama":
          return satpam.nama;
        case "nip":
          return satpam.nip;
        case "asal_daerah":
          return satpam.asal_daerah;
        case "no_telp":
          return satpam.no_telp;
        case "mitra":
          if (userRole === "Client") {
            return null;
          } else {
            return satpam.nama_client || "-";
          }

        case "created_at":
          return formatTanggal(satpam.created_at);
        case "aksi":
          if (userRole === "Client") return null;

          return (
            <div className="flex justify-center gap-3">
              <Button
                size="sm"
                className="bg-[#02A758] text-white font-semibold"
                startContent={<FaEdit />}
                onPress={() => openEditModal(satpam)}
              >
                Ubah
              </Button>
              <Button
                size="sm"
                className="bg-[#A70202] text-white font-semibold"
                startContent={<FaTrash />}
                onPress={() => confirmDelete(satpam.uuid)}
              >
                Hapus
              </Button>
              <Button
                size="sm"
                className="bg-[#122C93] text-white font-semibold"
                startContent={<MdAssignmentInd />}
                onPress={() => openMitraModal(satpam)}
              >
                Mitra
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [dataSatpam, page, rowsPerPage, userRole],
  );

  const resetForm = () => {
    setFormNama("");
    setFormAsal("");
    setFormNip("");
    setFormNoTelp("");
    setFormFile(null);
    setErrors({});
    setIsEditMode(false);
    setEditingId(null);
    setPreviewImage(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    onOpen();
  };

  const openEditModal = async (item: Satpam) => {
    setIsEditMode(true);
    setEditingId(item.uuid);
    setErrors({});

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/satpam/${item.uuid}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const resJson = await res.json();
      const s = resJson.data;

      if (s) {
        setFormNama(s.nama ?? "");
        setFormAsal(s.asal_daerah ?? "");
        setFormNip(s.nip ?? "");
        setFormNoTelp(s.no_telp ?? "");
        setFormFile(null);

        if (s.image_url) {
          setPreviewImage(s.image_url);
        } else {
          setPreviewImage(null);
        }
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    }

    onOpen();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formNama || formNama.trim().length < 4) {
      newErrors.nama = "Nama minimal 4 karakter.";
      isValid = false;
    } else if (formNama.length > 150) {
      newErrors.nama = "Nama maksimal 150 karakter.";
      isValid = false;
    }

    if (!formAsal || formAsal.trim().length < 4) {
      newErrors.asal_daerah = "Asal Daerah minimal 4 karakter.";
      isValid = false;
    } else if (formAsal.length > 32) {
      newErrors.asal_daerah = "Asal Daerah maksimal 32 karakter.";
      isValid = false;
    }

    if (!formNip || formNip.trim().length < 1) {
      newErrors.nip = "NIP wajib diisi.";
      isValid = false;
    } else if (formNip.length > 50) {
      newErrors.nip = "NIP maksimal 50 karakter.";
      isValid = false;
    }

    if (!formNoTelp || formNoTelp.trim().length < 8) {
      newErrors.no_telp = "No Telp minimal 8 karakter.";
      isValid = false;
    } else if (formNoTelp.length > 20) {
      newErrors.no_telp = "No Telp maksimal 20 karakter.";
      isValid = false;
    }

    if (formFile) {
      const MAX_SIZE = 5 * 1024 * 1024;
      const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

      if (formFile.size > MAX_SIZE) {
        newErrors.image = "Ukuran file maksimal 5MB.";
        isValid = false;
      } else if (!ACCEPTED_TYPES.includes(formFile.type)) {
        newErrors.image = "Format file harus .jpg, .jpeg, atau .png.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa inputan anda kembali.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("nama", formNama);
      fd.append("asal_daerah", formAsal);
      fd.append("nip", formNip);
      fd.append("no_telp", formNoTelp);
      if (formFile) {
        fd.append("image", formFile);
      }

      const res = await fetch(`${API_BASE}/v1/satpam/`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Menggunakan pesan error dari backend
        throw new Error(responseData.message || "Gagal menambah data satpam");
      }

      setPage(1);
      await fetchSatpam();
      resetForm();
      onClose();
      addToast({
        title: "Berhasil",
        description: "Data satpam berhasil ditambahkan.",
        variant: "flat",
        timeout: 3000,
        color: "success",
      });
    } catch (error: any) {
      console.error("Add error:", error);
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menambah data satpam.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (editingId === null) return;

    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa inputan anda kembali.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("nama", formNama);
      fd.append("asal_daerah", formAsal);
      fd.append("nip", formNip);
      fd.append("no_telp", formNoTelp);
      if (formFile) {
        fd.append("image", formFile);
      }

      const res = await fetch(`${API_BASE}/v1/satpam/${editingId}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Menggunakan pesan error dari backend
        throw new Error(responseData.message || "Gagal mengupdate data satpam");
      }

      await fetchSatpam();
      resetForm();
      onClose();
      addToast({
        title: "Berhasil",
        description: "Data satpam berhasil diupdate.",
        variant: "flat",
        timeout: 3000,
        color: "success",
      });
    } catch (error: any) {
      console.error("Edit error:", error);
      addToast({
        title: "Gagal",
        description: error.message || "Gagal mengupdate data satpam.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (deleteId === null) return;

    setDeleteModalOpen(false);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/satpam/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.message || "Gagal menghapus data");
      }

      await fetchSatpam();
      addToast({
        title: "Berhasil",
        description: "Data satpam berhasil dihapus.",
        variant: "flat",
        timeout: 3000,
        color: "danger",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      // Set pesan error dari backend untuk ditampilkan di Modal Error
      setErrorMessage(
        error.message ||
          "Gagal menghapus satpam. Terjadi kesalahan jaringan atau server.",
      );
      setErrorModalOpen(true);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isEditMode) {
      await handleEdit();
    } else {
      await handleAdd();
    }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Satpam
          </h2>

          {userRole !== "Client" && (
            <Button
              variant="solid"
              className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
              onPress={openAddModal}
            >
              Tambah +
            </Button>
          )}
        </div>

        <div className="table-section-container mt-6">
          <Table
            aria-label="Tabel Data Satpam"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              totalPages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "aksi" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={dataSatpam}
              emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
            >
              {(item) => (
                <TableRow key={item.uuid}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                  <FaExclamationTriangle size={40} className="text-[#A70202]" />
                  <span className="mt-2 text-[#A70202]">Konfirmasi Hapus</span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah anda yakin ingin menghapus data satpam ini?</p>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button variant="light" onPress={onClose}>
                    Batal
                  </Button>
                  <Button
                    color="danger"
                    className="bg-[#A70202]"
                    onPress={executeDelete}
                  >
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isErrorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          size="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-[#122C93]">
                  Peringatan
                </ModalHeader>
                <ModalBody className="text-center">
                  <p className="text-gray-700">{errorMessage}</p>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button className="bg-[#122C93] text-white" onPress={onClose}>
                    Mengerti
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          backdrop={"opaque"}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetForm();
          }}
          size="4xl"
        >
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                  <form
                    onSubmit={handleSubmit}
                    className="form-input flex flex-col gap-6 p-3"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-4">
                        <Input
                          type="text"
                          variant="underlined"
                          size="lg"
                          label="Nama"
                          placeholder="Masukan nama"
                          labelPlacement="outside-top"
                          value={formNama}
                          maxLength={150}
                          isInvalid={!!errors.nama}
                          errorMessage={errors.nama}
                          onValueChange={(val) => {
                            setFormNama(val);
                            if (errors.nama)
                              setErrors({ ...errors, nama: undefined });
                          }}
                          required
                        />
                        <Input
                          type="text"
                          variant="underlined"
                          size="lg"
                          label="Asal Daerah"
                          placeholder="Masukan asal"
                          labelPlacement="outside-top"
                          value={formAsal}
                          maxLength={32}
                          isInvalid={!!errors.asal_daerah}
                          errorMessage={errors.asal_daerah}
                          onValueChange={(val) => {
                            setFormAsal(val);
                            if (errors.asal_daerah)
                              setErrors({ ...errors, asal_daerah: undefined });
                          }}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <Input
                          type="text"
                          variant="underlined"
                          size="lg"
                          label="NIP"
                          placeholder="Masukan NIP"
                          labelPlacement="outside-top"
                          value={formNip}
                          maxLength={50}
                          isInvalid={!!errors.nip}
                          errorMessage={errors.nip}
                          onValueChange={(val) => {
                            setFormNip(val);
                            if (errors.nip)
                              setErrors({ ...errors, nip: undefined });
                          }}
                          required
                        />
                        <Input
                          type="text"
                          variant="underlined"
                          size="lg"
                          label="No Hp"
                          placeholder="Masukan No Hp"
                          labelPlacement="outside-top"
                          value={formNoTelp}
                          maxLength={20}
                          isInvalid={!!errors.no_telp}
                          errorMessage={errors.no_telp}
                          onValueChange={(val) => {
                            setFormNoTelp(val);
                            if (errors.no_telp)
                              setErrors({ ...errors, no_telp: undefined });
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {previewImage && (
                        <div className="mt-3 flex flex-col gap-1">
                          <span className="text-tiny text-gray-500">
                            Preview Foto:
                          </span>
                          <img
                            src={previewImage}
                            alt="Preview Satpam"
                            className="w-28 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col w-full">
                        <Input
                          variant="underlined"
                          size="lg"
                          type="file"
                          label="Foto Anggota"
                          placeholder="Pilih File"
                          labelPlacement="outside-top"
                          className="w-[300px]"
                          isInvalid={!!errors.image}
                          errorMessage={errors.image}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const file = e.target.files?.[0] ?? null;
                            if (file) {
                              const MAX_SIZE = 5 * 1024 * 1024;
                              const ACCEPTED_TYPES = [
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                              ];

                              if (file.size > MAX_SIZE) {
                                setErrors({
                                  ...errors,
                                  image: "Ukuran file maksimal 5MB.",
                                });
                                setFormFile(null);
                                return;
                              }
                              if (!ACCEPTED_TYPES.includes(file.type)) {
                                setErrors({
                                  ...errors,
                                  image:
                                    "Format file harus .jpg, .jpeg, atau .png.",
                                });
                                setFormFile(null);
                                return;
                              }

                              setErrors({ ...errors, image: undefined });
                              setFormFile(file);
                              const url = URL.createObjectURL(file);
                              setPreviewImage(url);
                            } else {
                              setFormFile(null);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </form>
                </ModalBody>

                <ModalFooter className="-mt-[60px]">
                  <Button
                    color="danger"
                    className="font-semibold"
                    variant="light"
                    onPress={() => {
                      onClose();
                      resetForm();
                    }}
                  >
                    Batal -
                  </Button>

                  <Button
                    variant="solid"
                    className="bg-[#122C93] text-white font-semibold"
                    onPress={() => void handleSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      <span>{isEditMode ? "Update" : "Simpan +"}</span>
                    )}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isMitraModalOpen} onClose={onMitraClose} size="md">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93]">
                  Penugasan Mitra
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    {loadingMitra ? (
                      <div className="flex justify-center py-4">
                        <Spinner label="Memuat opsi mitra..." />
                      </div>
                    ) : (
                      <Select
                        label="Pilih Mitra"
                        placeholder="Pilih mitra atau lepas tugas"
                        variant="underlined"
                        labelPlacement="outside-top"
                        size="lg"
                        selectedKeys={formMitraId ? [formMitraId] : []}
                        onChange={(e) => setFormMitraId(e.target.value)}
                      >
                        {[
                          { uuid: "unassign", nama: "- Lepas Penugasan -" },
                          ...mitraOptions,
                        ].map((item) => (
                          <SelectItem key={item.uuid} textValue={item.nama}>
                            {item.nama}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="light"
                    color="danger"
                    className="font-semibold"
                    onPress={onClose}
                  >
                    Batal
                  </Button>
                  <Button
                    className="bg-[#122C93] text-white"
                    onPress={handleAssignMitra}
                    disabled={submitting || loadingMitra}
                  >
                    {submitting ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default AdminManageSatpam;
