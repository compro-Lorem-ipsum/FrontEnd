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
  Select,
  SelectItem,
  Spinner,
  addToast,
  Pagination,
} from "@heroui/react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

interface Satpam {
  id: number;
  nama: string;
  nip: string;
}
interface Pos {
  id: number;
  kode_pos: string;
  nama_pos: string;
}
interface Plotting {
  id: number;
  nama_satpam: string;
  nama_pos: string;
  kode_pos: string;
}
interface FormData {
  satpam_id: string;
  pos_id: string;
}

const AdminManagePlotting = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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

  const [listSatpam, setListSatpam] = useState<Satpam[]>([]);
  const [listPos, setListPos] = useState<Pos[]>([]);
  const [dataPlotting, setDataPlotting] = useState<Plotting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const rowsPerPage = 12;


  const [formData, setFormData] = useState<FormData>({
    satpam_id: "",
    pos_id: "",
  });

  const fetchPlotting = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/plotting/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setDataPlotting(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const pages = Math.ceil(dataPlotting.length / rowsPerPage);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resSatpam, resPos] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/satpams/?mode=dropdown`, { headers }),
          fetch(`${API_BASE_URL}/v1/poss/?tipe=jaga`, { headers }),
        ]);
        const ds = await resSatpam.json();
        const dp = await resPos.json();
        setListSatpam(ds.satpams || []);
        setListPos(dp.results || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlotting();
    if (isOpenForm) fetchDropdowns();
  }, [isOpenForm, fetchPlotting, token]);

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({ satpam_id: "", pos_id: "" });
    onOpenForm();
  };

  const handleOpenEdit = async (id: number) => {
    setSelectedId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/plotting/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const item = result.data;
      setFormData({
        satpam_id: String(item.satpam_id),
        pos_id: String(item.pos_id),
      });
      onOpenForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.satpam_id || !formData.pos_id) return;

    const body = {
      satpam_id: Number(formData.satpam_id),
      pos_id: Number(formData.pos_id),
    };

    const url = selectedId
      ? `${API_BASE_URL}/v1/plotting/${selectedId}`
      : `${API_BASE_URL}/v1/plotting/`;
    const method = selectedId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onCloseForm();
        fetchPlotting();
        addToast({
          title: "Berhasil",
          description: `Data plotting berhasil ${
            selectedId ? "diperbarui" : "ditambahkan"
          }.`,
          color: "success",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/plotting/${deleteTargetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        fetchPlotting();
        addToast({
          title: "Berhasil",
          description: "Data plotting berhasil dihapus.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data.",
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
        {/* Header Section */}
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Plotting Patroli
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

        {/* Modal Add / Edit */}
        <Modal
          backdrop="opaque"
          isOpen={isOpenForm}
          onClose={onCloseForm}
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93]">
                  {selectedId ? "Edit Plotting" : "Tambah Plotting Manual"}
                </ModalHeader>
                <ModalBody>
                  <div className="form-input flex flex-col gap-8 p-3">
                    <div className="container-form flex flex-row justify-between gap-10">
                      <div className="left-section flex flex-col items-start gap-8 w-1/2">
                        <Select
                          className="w-full"
                          label="Nama & NIP"
                          size="lg"
                          variant="underlined"
                          placeholder="Pilih Personel"
                          labelPlacement="outside"
                          selectedKeys={
                            formData.satpam_id ? [formData.satpam_id] : []
                          }
                          onSelectionChange={(keys) =>
                            setFormData({
                              ...formData,
                              satpam_id: String(Array.from(keys)[0]),
                            })
                          }
                        >
                          {listSatpam.map((s) => (
                            <SelectItem
                              key={s.id}
                              textValue={`${s.nama} - ${s.nip}`}
                            >
                              {s.nama} - {s.nip}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="right-section flex flex-col items-start gap-8 w-1/2">
                        <Select
                          className="w-full"
                          label="Pos"
                          size="lg"
                          variant="underlined"
                          placeholder="Pilih Pos"
                          labelPlacement="outside"
                          selectedKeys={
                            formData.pos_id ? [formData.pos_id] : []
                          }
                          onSelectionChange={(keys) =>
                            setFormData({
                              ...formData,
                              pos_id: String(Array.from(keys)[0]),
                            })
                          }
                        >
                          {listPos.map((p) => (
                            <SelectItem key={p.id} textValue={p.nama_pos}>
                              {p.nama_pos}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
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
                    {selectedId ? "Simpan +" : "Simpan +"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Table Section */}
        <div className="table-section-container mt-6">
          <Table
            aria-label="Tabel Data Plotting"
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
              <TableColumn>Nama Satpam</TableColumn>
              <TableColumn>Nama Pos</TableColumn>
              <TableColumn>Kode Pos</TableColumn>
              <TableColumn className="text-center">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="Tidak ada data plotting."
              isLoading={isLoading}
              loadingContent={<Spinner />}
            >
              {dataPlotting.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nama_satpam}</TableCell>
                  <TableCell>{item.nama_pos}</TableCell>
                  <TableCell>{item.kode_pos}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button
                        size="sm"
                        className="bg-[#02A758] text-white font-semibold"
                        startContent={<FaEdit />}
                        onPress={() => handleOpenEdit(item.id)}
                      >
                        Ubah
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#A70202] text-white font-semibold"
                        startContent={<FaTrash />}
                        onPress={() => openDeleteModal(item.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
                    <span className="mt-2 text-lg text-[#A70202]">Konfirmasi Hapus</span>
                  </ModalHeader>
                  <ModalBody className="text-center font-medium">
                    <p>Apakah Anda yakin ingin menghapus data plotting ini?</p>
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
        </div>
      </div>
    </div>
  );
};

export default AdminManagePlotting;
