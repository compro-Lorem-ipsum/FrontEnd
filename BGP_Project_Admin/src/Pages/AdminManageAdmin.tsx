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
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  ModalHeader,
} from "@heroui/react";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface User {
  uuid: string;
  nama: string;
  username: string;
  created_at: string;
  is_active?: number;
}

interface FormErrors {
  nama?: string;
  username?: string;
  password?: string;
}

const AdminManageUsers = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);

  const [dataUsers, setDataUsers] = useState<User[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const fetchUsers = async () => {
    setLoadingTable(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/users/?pid=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const responseData = await res.json();

      if (
        res.ok &&
        responseData.data &&
        Array.isArray(responseData.data.data)
      ) {
        setDataUsers(responseData.data.data);

        if (responseData.data.pagination) {
          setTotalPages(responseData.data.pagination.total_pages);
        }
      } else {
        setDataUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log("Error fetch users:", error);
      setDataUsers([]);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!nama.trim()) {
      newErrors.nama = "Nama wajib diisi.";
      isValid = false;
    } else if (nama.length > 150) {
      newErrors.nama = "Nama maksimal 150 karakter.";
      isValid = false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username) {
      newErrors.username = "Username wajib diisi.";
      isValid = false;
    } else if (username.length < 5) {
      newErrors.username = "Username minimal 5 karakter.";
      isValid = false;
    } else if (username.length > 100) {
      newErrors.username = "Username maksimal 100 karakter.";
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      newErrors.username = "Hanya huruf, angka, dan underscore (_).";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    } else if (password.length > 16) {
      newErrors.password = "Password maksimal 16 karakter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCloseModal = () => {
    setNama("");
    setUsername("");
    setPassword("");
    setErrors({});
    onClose();
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      addToast({
        title: "Peringatan",
        description: "Mohon periksa inputan anda kembali.",
        variant: "flat",
        color: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nama,
          username,
          password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "User berhasil ditambahkan.",
          variant: "flat",
          timeout: 3000,
          color: "success",
        });
        handleCloseModal();
        setPage(1);
        fetchUsers();
      } else {
        throw new Error(result.message || "Gagal menambahkan user");
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menambahkan user.",
        variant: "flat",
        color: "danger",
      });
    }
  };

  const confirmDelete = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setDeleteModalOpen(false);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/users/${deleteTargetUuid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Data user berhasil dihapus.",
          variant: "flat",
          timeout: 3000,
          color: "danger",
        });
        fetchUsers();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus user");
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal menghapus user.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setDeleteTargetUuid(null);
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
            onPress={onOpen}
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
          >
            Tambah +
          </Button>
        </div>

        <Modal
          backdrop={"opaque"}
          isOpen={isOpen}
          onClose={handleCloseModal}
          size="4xl"
        >
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
                  maxLength={150}
                  isInvalid={!!errors.nama}
                  errorMessage={errors.nama}
                  onValueChange={(val) => {
                    setNama(val);
                    if (errors.nama) setErrors({ ...errors, nama: undefined });
                  }}
                />
                <Input
                  type="text"
                  variant="underlined"
                  size="lg"
                  label="Username"
                  placeholder="Masukan Username"
                  labelPlacement="outside-top"
                  description="Min 5 karakter, huruf, angka, dan underscore (_)"
                  value={username}
                  maxLength={100}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username}
                  onValueChange={(val) => {
                    setUsername(val);
                    if (errors.username)
                      setErrors({ ...errors, username: undefined });
                  }}
                />
                <Input
                  type="text"
                  variant="underlined"
                  size="lg"
                  label="Password"
                  placeholder="Masukan Password"
                  labelPlacement="outside-top"
                  description="Panjang password 8 - 16 karakter"
                  value={password}
                  maxLength={16}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                  onValueChange={(val) => {
                    setPassword(val);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-5">
              <Button color="danger" variant="light" onPress={handleCloseModal}>
                Batal -
              </Button>
              <Button
                variant="solid"
                className="bg-[#122C93] text-white"
                onPress={handleAddUser}
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
              aria-label="Tabel Data User"
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
              <TableHeader>
                <TableColumn>No</TableColumn>
                <TableColumn>Nama Mitra</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Pembuatan</TableColumn>
                <TableColumn className="text-center">Aksi</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"Tidak ada data user"}>
                {dataUsers.map((item, index) => (
                  <TableRow key={item.uuid}>
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
                          onPress={() => confirmDelete(item.uuid)}
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
                  <span className="mt-2 text-[#A70202]">Konfirmasi Hapus</span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah anda yakin ingin menghapus data user ini?</p>
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
      </div>
    </div>
  );
};

export default AdminManageUsers;
