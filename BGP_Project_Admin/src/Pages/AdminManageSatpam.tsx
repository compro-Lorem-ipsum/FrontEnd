import React, { useEffect, useState, useMemo } from "react";
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
} from "@heroui/react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalHeader,
} from "@heroui/react";

import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";

interface Satpam {
  id: number;
  nama: string;
  asal_daerah: string;
  nip: string;
  no_telp: string;
  gambar_path?: string;
  foto_satpam?: string;
  milvus_id?: string;
  created_at?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AdminManageSatpam: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dataSatpam, setDataSatpam] = useState<Satpam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formNama, setFormNama] = useState<string>("");
  const [formAsal, setFormAsal] = useState<string>("");
  const [formNip, setFormNip] = useState<string>("");
  const [formNoTelp, setFormNoTelp] = useState<string>("");
  const [formFile, setFormFile] = useState<File | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getToken = (): string | undefined => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
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
      const res = await fetch(`${API_BASE}/v1/satpams`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setDataSatpam(Array.isArray(data.satpams) ? data.satpams : []);
    } catch (error) {
      console.error("Fetch satpam error:", error);
      alert("Gagal mengambil data satpam. Cek console untuk detail.");
      setDataSatpam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatpam();
  }, []);

  const pages = Math.ceil(dataSatpam.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return dataSatpam.slice(start, end);
  }, [page, dataSatpam]);

  const resetForm = () => {
    setFormNama("");
    setFormAsal("");
    setFormNip("");
    setFormNoTelp("");
    setFormFile(null);
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
    setEditingId(item.id);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/satpams/${item.id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();

      if (data && data.satpam) {
        const s = data.satpam;
        setFormNama(s.nama ?? "");
        setFormAsal(s.asal_daerah ?? "");
        setFormNip(s.nip ?? "");
        setFormNoTelp(s.no_telp ?? "");
        setFormFile(null);

        if (s.gambar_path) {
          const cleanPath = s.gambar_path.startsWith("/")
            ? s.gambar_path
            : `/${s.gambar_path}`;
          setPreviewImage(`${API_BASE}/uploads${cleanPath}`);
        } else {
          setPreviewImage(null);
        }
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    }

    onOpen();
  };

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("nama", formNama);
      fd.append("asal_daerah", formAsal);
      fd.append("nip", formNip);
      fd.append("no_telp", formNoTelp);
      if (formFile) {
        fd.append("foto_satpam", formFile);
      }

      const res = await fetch(`${API_BASE}/v1/satpams`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create failed: ${res.status} - ${text}`);
      }

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
    } catch (error) {
      console.error("Add error:", error);
      alert("Gagal menambah satpam.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (editingId === null) return;
    setSubmitting(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("nama", formNama);
      fd.append("asal_daerah", formAsal);
      fd.append("nip", formNip);
      fd.append("no_telp", formNoTelp);
      if (formFile) {
        fd.append("foto_satpam", formFile);
      }

      const res = await fetch(`${API_BASE}/v1/satpams/${editingId}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} - ${text}`);
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
    } catch (error) {
      console.error("Edit error:", error);
      alert("Gagal mengupdate satpam.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (deleteId === null) return;

    setDeleteModalOpen(false);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/v1/satpams/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error("CONSTRAINT_VIOLATION");
      }

      await fetchSatpam();
      addToast({
        title: "Berhasil",
        description: "Data satpam berhasil dihapus.",
        variant: "flat",
        timeout: 3000,
        color: "success",
      });
    } catch (error: any) {
      console.error("Delete error:", error);

      if (error.message === "CONSTRAINT_VIOLATION") {
        setErrorMessage(
          "Tidak berhasil menghapus, satpam berada dalam shift, anda harus menghapusnya dulu",
        );
      } else {
        setErrorMessage(
          "Gagal menghapus satpam. Terjadi kesalahan jaringan atau server.",
        );
      }

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
        {/* HEADER */}
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Satpam
          </h2>
          <Button
            variant="solid"
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
            onPress={openAddModal}
          >
            Tambah +
          </Button>
        </div>

        {/* TABLE */}
        <div className="table-section-container mt-6">
          <Table
            aria-label="Tabel Data Satpam"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>NIP</TableColumn>
              <TableColumn>Asal Daerah</TableColumn>
              <TableColumn>No Telp</TableColumn>
              <TableColumn>Mitra</TableColumn>
              <TableColumn>Pembuatan</TableColumn>
              <TableColumn className="text-center">Aksi</TableColumn>
            </TableHeader>

            <TableBody
              emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
            >
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.nip}</TableCell>
                  <TableCell>{item.asal_daerah}</TableCell>
                  <TableCell>{item.no_telp}</TableCell>
                  <TableCell>Lorem</TableCell>
                  <TableCell>{formatTanggal(item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button
                        size="sm"
                        className="bg-[#02A758] text-white font-semibold"
                        startContent={<FaEdit />}
                        onPress={() => openEditModal(item)}
                      >
                        Ubah
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#A70202] text-white font-semibold"
                        startContent={<FaTrash />}
                        onPress={() => confirmDelete(item.id)}
                      >
                        Hapus
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#122C93] text-white font-semibold"
                        startContent={<MdAssignmentInd />}
                      >
                        Mitra
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal konfirmasi delete */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                  <FaExclamationTriangle size={40} />
                  <span className="mt-2">Konfirmasi Hapus</span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah anda yakin ingin menghapus data satpam ini?</p>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button variant="light" onPress={onClose}>
                    Batal
                  </Button>
                  <Button color="danger" onPress={executeDelete}>
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal eror */}
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

        {/* MODAL ADD/EDIT */}
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
                          onChange={(e) => setFormNama(e.target.value)}
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
                          onChange={(e) => setFormAsal(e.target.value)}
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
                          onChange={(e) => setFormNip(e.target.value)}
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
                          onChange={(e) => setFormNoTelp(e.target.value)}
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
                              console.error(
                                "Gagal memuat gambar di URL:",
                                previewImage,
                              );
                            }}
                          />
                        </div>
                      )}
                      <Input
                        variant="underlined"
                        size="lg"
                        type="file"
                        label="Foto Anggota"
                        placeholder="Pilih File"
                        labelPlacement="outside-top"
                        className="w-[300px]"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0] ?? null;
                          setFormFile(file);

                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewImage(url);
                          }
                        }}
                      />
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
      </div>
    </div>
  );
};

export default AdminManageSatpam;
