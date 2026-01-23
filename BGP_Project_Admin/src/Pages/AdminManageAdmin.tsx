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
} from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
} from "@heroui/react";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";

interface Admin {
  id: number;
  nama: string;
  username: string;
  role: string;
  created_at: string;
}

const AdminManageAdmin = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [dataadmin, setDataAdmin] = useState<Admin[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const filteredAdmins = dataadmin.filter((item) => item.role !== "SuperAdmin");

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAdmins.slice(start, end);
  }, [page, filteredAdmins]);

  const pages = Math.ceil(filteredAdmins.length / rowsPerPage);

  const formatDate = (dateString: any) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const fetchAdmins = async () => {
    setLoadingTable(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admins/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setDataAdmin(data.admins || []);
    } catch (error) {
      console.log("Error fetch admins:", error);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!nama || !username || !password) {
      addToast({
        title: "Peringatan",
        description: "Semua field wajib diisi!",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admins/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nama,
          username,
          password,
          role: "Admin",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Admin berhasil ditambahkan.",
          variant: "flat",
          timeout: 3000,
          color: "success",
        });
        onClose();
        setNama("");
        setUsername("");
        setPassword("");
        fetchAdmins();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menambahkan admin.",
        variant: "flat",
        color: "danger",
      });
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetId === null) return;
    setDeleteModalOpen(false);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admins/${deleteTargetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Data admin berhasil dihapus.",
          variant: "flat",
          timeout: 3000,
          color: "danger",
        });
        fetchAdmins();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus admin.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Client
          </h2>
          <Button
            variant="solid"
            onPress={() => onOpen()}
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
          >
            Tambah +
          </Button>
        </div>

        {/* MODAL ADD ADMIN */}
        <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalContent>
            <ModalBody>
              <div className="form-input flex flex-col gap-8 p-3 pt-6">
                <Input
                  type="text"
                  variant="underlined"
                  size="lg"
                  label="Nama"
                  placeholder="Masukan nama"
                  labelPlacement="outside-top"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <Input
                  type="text"
                  variant="underlined"
                  size="lg"
                  label="Username"
                  placeholder="Masukan Username"
                  labelPlacement="outside-top"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="password"
                  variant="underlined"
                  size="lg"
                  label="Password"
                  placeholder="Masukan Password"
                  labelPlacement="outside-top"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-5">
              <Button color="danger" variant="light" onPress={onClose}>
                Batal -
              </Button>
              <Button
                variant="solid"
                className="bg-[#122C93] text-white"
                onPress={handleAddAdmin}
              >
                Simpan +
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <div className="table-section-container mt-6">
          {loadingTable ? (
            <div className="flex justify-center py-10">
              <Spinner label="Memuat data..." />
            </div>
          ) : (
            <Table
              aria-label="Tabel Data Admin"
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
                <TableColumn>Nama Mitra</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Pembuatan</TableColumn>
                <TableColumn className="text-center">Aksi</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"Tidak ada data admin"}>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="bg-[#A70202] text-white font-semibold"
                          startContent={<FaTrash />}
                          onPress={() => confirmDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* MODAL KONFIRMASI DELETE */}
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
                  <FaExclamationTriangle size={40} />
                  <span className="mt-2">Konfirmasi Hapus</span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah anda yakin ingin menghapus data admin ini?</p>
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
      </div>
    </div>
  );
};

export default AdminManageAdmin;
