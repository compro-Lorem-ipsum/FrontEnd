import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Spinner,
  addToast,
  Pagination,
} from "@heroui/react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

interface WaktuJadwal {
  uuid: string;
  nama: string;
  mulai: string;
  selesai: string;
  created_at?: string;
  timezone?: string;
}

const AdminManageWaktuJadwal = () => {
  const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

  const getToken = (): string | undefined => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const token = getToken();

  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm,
  } = useDisclosure();

  const [listWaktu, setListWaktu] = useState<WaktuJadwal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const [formData, setFormData] = useState({
    nama: "",
    mulai: "",
    selesai: "",
  });

  const [errors, setErrors] = useState({
    nama: "",
    mulai: "",
    selesai: "",
  });

  const getDeviceTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return "Asia/Jakarta";
    }
  };

  const fetchWaktu = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/v1/shifts/?pid=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.data && Array.isArray(result.data.data)) {
        setListWaktu(result.data.data);

        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
        }
      } else {
        setListWaktu([]);
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Gagal mengambil data waktu",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, BASE_URL_API, page]);

  useEffect(() => {
    fetchWaktu();
  }, [fetchWaktu]);

  const resetForm = () => {
    setFormData({ nama: "", mulai: "", selesai: "" });
    setErrors({ nama: "", mulai: "", selesai: "" });
  };

  const handleOpenAdd = () => {
    setSelectedId(null);
    resetForm();
    onOpenForm();
  };

  const handleOpenEdit = async (uuid: string) => {
    setSelectedId(uuid);
    setErrors({ nama: "", mulai: "", selesai: "" });
    try {
      const res = await fetch(`${BASE_URL_API}/v1/shifts/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      const item = result.data || result;

      setFormData({
        nama: item.nama,
        mulai: item.mulai ? item.mulai.slice(0, 5) : "",
        selesai: item.selesai ? item.selesai.slice(0, 5) : "",
      });
      onOpenForm();
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Gagal mengambil detail data",
        color: "danger",
      });
    }
  };

  const validateForm = () => {
    const newErrors = { nama: "", mulai: "", selesai: "" };
    let isValid = true;

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama Shift wajib diisi.";
      isValid = false;
    } else if (formData.nama.length > 20) {
      newErrors.nama = "Nama Shift maksimal 20 karakter.";
      isValid = false;
    }

    if (!formData.mulai) {
      newErrors.mulai = "Jam Mulai wajib diisi.";
      isValid = false;
    }

    if (!formData.selesai) {
      newErrors.selesai = "Jam Selesai wajib diisi.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Mohon periksa kembali inputan Anda.",
        color: "warning",
      });
      return;
    }

    const formatTime = (time: string) => {
      return time.length === 5 ? `${time}:00` : time;
    };

    let payload: any = {};
    let url = "";
    let method = "";

    if (selectedId) {
      url = `${BASE_URL_API}/v1/shifts/${selectedId}`;
      method = "PUT";
      payload = {
        nama: formData.nama,
        mulai: formatTime(formData.mulai),
        selesai: formatTime(formData.selesai),
      };
    } else {
      url = `${BASE_URL_API}/v1/shifts/`;
      method = "POST";
      payload = {
        nama: formData.nama,
        mulai: formatTime(formData.mulai),
        selesai: formatTime(formData.selesai),
        timezone: getDeviceTimezone(),
      };
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: `Data berhasil ${selectedId ? "diubah" : "ditambahkan"}`,
          color: "success",
        });
        onCloseForm();
        if (!selectedId) setPage(1);
        fetchWaktu();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menyimpan");
      }
    } catch (error: any) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menyimpan data",
        color: "danger",
      });
    }
  };

  const openDeleteModal = (uuid: string) => {
    setDeleteTargetId(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL_API}/v1/shifts/${deleteTargetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Data waktu berhasil dihapus",
          color: "danger",
        });
        fetchWaktu();
        setDeleteModalOpen(false);
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Gagal menghapus data waktu",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Waktu Jadwal
          </h2>
          <div className="container-generate flex flex-row gap-5">
            <Button
              onPress={handleOpenAdd}
              className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
            >
              Tambah +
            </Button>
          </div>
        </div>

        <Modal
          backdrop="opaque"
          isOpen={isOpenForm}
          onClose={onCloseForm}
          size="2xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93]">
                  {selectedId ? "Edit Waktu Jadwal" : "Tambah Waktu Jadwal"}
                </ModalHeader>
                <ModalBody>
                  <div className="container-form flex flex-col gap-6 p-3">
                    <Input
                      label="Nama Waktu"
                      placeholder="Contoh: Shift Pagi"
                      variant="underlined"
                      labelPlacement="outside"
                      value={formData.nama}
                      maxLength={20}
                      isInvalid={!!errors.nama}
                      errorMessage={errors.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />

                    <div className="flex gap-4 w-full">
                      <Input
                        className="w-full"
                        label="Jam Mulai"
                        type="time"
                        variant="underlined"
                        labelPlacement="outside"
                        step="1"
                        value={formData.mulai}
                        isInvalid={!!errors.mulai}
                        errorMessage={errors.mulai}
                        onChange={(e) =>
                          setFormData({ ...formData, mulai: e.target.value })
                        }
                      />
                      <Input
                        className="w-full"
                        label="Jam Selesai"
                        type="time"
                        variant="underlined"
                        labelPlacement="outside"
                        step="1"
                        value={formData.selesai}
                        isInvalid={!!errors.selesai}
                        errorMessage={errors.selesai}
                        onChange={(e) =>
                          setFormData({ ...formData, selesai: e.target.value })
                        }
                      />
                    </div>

                    {!selectedId && (
                      <p className="text-xs text-gray-400 italic mt-[-10px]">
                        * Timezone akan otomatis terdeteksi:{" "}
                        {getDeviceTimezone()}
                      </p>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-center pb-8">
                  <Button variant="light" color="danger" onPress={onClose}>
                    Batal
                  </Button>
                  <Button
                    className="bg-[#122C93] text-white px-10"
                    onPress={handleSubmit}
                  >
                    {selectedId ? "Update" : "Simpan"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal Delete tetap sama */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="sm"
          backdrop="opaque"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                  <FaExclamationTriangle size={40} className="text-[#A70202]" />
                  <span className="mt-2 text-lg text-[#A70202]">
                    Konfirmasi Hapus
                  </span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah Anda yakin ingin menghapus data waktu ini?</p>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button
                    variant="light"
                    onPress={onClose}
                    isDisabled={isDeleting}
                  >
                    Batal
                  </Button>
                  <Button
                    color="danger"
                    className="bg-[#A70202]"
                    onPress={executeDelete}
                    isLoading={isDeleting}
                  >
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="table-section-container mt-6">
          <Table
            isStriped
            shadow="none"
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
                    onChange={(p) => setPage(p)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Mulai</TableColumn>
              <TableColumn>Selesai</TableColumn>
              <TableColumn className="text-center">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="Tidak ada data waktu."
              isLoading={isLoading}
              loadingContent={<Spinner />}
            >
              {listWaktu.map((item, index) => (
                <TableRow key={item.uuid}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.mulai}</TableCell>
                  <TableCell>{item.selesai}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button
                        size="sm"
                        className="bg-[#02A758] text-white font-semibold"
                        startContent={<FaEdit />}
                        onPress={() => handleOpenEdit(item.uuid)}
                      >
                        Ubah
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#A70202] text-white font-semibold"
                        startContent={<FaTrash />}
                        onPress={() => openDeleteModal(item.uuid)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageWaktuJadwal;
