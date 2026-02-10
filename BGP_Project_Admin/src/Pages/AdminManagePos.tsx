import { useEffect, useState } from "react";
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
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationMarkerProps {
  position: LatLng | null;
  setPosition: (position: LatLng) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e: L.DragEndEvent) {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  ) : null;
}

const AdminManagePos = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);

  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [dataPos, setDataPos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    uuid: null,
    nama: "",
    kode: "",
    lat: "",
    lng: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${BASE_API_URL}/v1/pos`;

  const getToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const fetchData = async () => {
    try {
      setLoadingTable(true);
      const res = await fetch(`${API_URL}?tipe=Jaga&pid=${page}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const responseData = await res.json();

      if (
        responseData &&
        responseData.data &&
        Array.isArray(responseData.data.data)
      ) {
        setDataPos(responseData.data.data);

        if (responseData.data.pagination) {
          setTotalPages(responseData.data.pagination.total_pages);
          setRowsPerPage(responseData.data.pagination.items_per_page);
        }
      } else {
        setDataPos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Gagal memuat data pos:", error);
      setDataPos([]);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const updateCoordinates = (latlng: LatLng) => {
    setSelectedPosition(latlng);
    setFormData((prev) => ({
      ...prev,
      lat: latlng.lat.toString(),
      lng: latlng.lng.toString(),
    }));
  };

  const handleManualCoordChange = (field: "lat" | "lng", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const latVal =
      field === "lat" ? parseFloat(value) : parseFloat(formData.lat);
    const lngVal =
      field === "lng" ? parseFloat(value) : parseFloat(formData.lng);

    if (!isNaN(latVal) && !isNaN(lngVal)) {
      setSelectedPosition(new LatLng(latVal, lngVal));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = new LatLng(latitude, longitude);
          updateCoordinates(newPos);
        },
        (error) => {
          console.error("Error getting location:", error);
          addToast({
            title: "Lokasi Gagal",
            description: "Pastikan GPS aktif dan izin diberikan.",
            color: "warning",
          });
        },
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      uuid: null,
      nama: "",
      kode: "",
      lat: "",
      lng: "",
      created_at: "",
    });

    setSelectedPosition(null);
    getCurrentLocation();

    onOpen();
  };

  const handleEdit = async (uuid: string) => {
    try {
      const res = await fetch(`${API_URL}/${uuid}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const responseJson = await res.json();

      const item = responseJson.data || responseJson;

      if (item) {
        setFormData({
          uuid: item.uuid,
          nama: item.nama || "",
          kode: item.kode || "",
          lat: item.lat || "",
          lng: item.lng || "",
          created_at: item.created_at || "",
        });

        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedPosition(new LatLng(lat, lng));
        } else {
          setSelectedPosition(null);
        }

        onOpen();
      }
    } catch (error) {
      console.error("Gagal mengambil detail pos:", error);
      addToast({
        title: "Error",
        description: "Gagal memuat detail pos.",
        color: "danger",
      });
    }
  };

  const validateForm = () => {
    if (
      !formData.nama ||
      formData.nama.length < 4 ||
      formData.nama.length > 100
    ) {
      addToast({
        title: "Validasi Gagal",
        description: "Nama harus 4-100 karakter.",
        color: "danger",
      });
      return false;
    }
    if (
      !formData.kode ||
      formData.kode.length < 1 ||
      formData.kode.length > 20
    ) {
      addToast({
        title: "Validasi Gagal",
        description: "Kode harus 1-20 karakter.",
        color: "danger",
      });
      return false;
    }
    if (!selectedPosition) {
      addToast({
        title: "Validasi Gagal",
        description: "Lokasi (Lat/Lng) wajib diisi.",
        color: "danger",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      nama: formData.nama,
      kode: formData.kode,
      tipe: "Jaga",
      lat: selectedPosition!.lat,
      lng: selectedPosition!.lng,
    };

    setLoading(true);
    try {
      const isEdit = !!formData.uuid;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/${formData.uuid}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan!");

      setPage(1);
      await fetchData();
      onClose();
      addToast({
        title: "Berhasil",
        description: "Data tersimpan",
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "danger",
      });
    } finally {
      setLoading(false);
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
      const res = await fetch(`${API_URL}/${deleteTargetUuid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
        await fetchData();
        addToast({
          title: "Berhasil",
          description: "Data pos berhasil dihapus.",
          color: "danger",
        });
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error) {
      console.error("Gagal menghapus pos:", error);
      addToast({
        title: "Gagal",
        description: "Gagal menghapus data pos.",
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
            Manage Pos Patroli
          </h2>
          <Button
            variant="solid"
            onPress={handleOpenAdd}
            className="bg-[#122C93] text-white font-semibold w-30 h-12 text-[16px]"
          >
            Tambah +
          </Button>
        </div>

        <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalContent>
            <>
              <ModalBody>
                <div className="form-input flex flex-col gap-8 p-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <Input
                      type="text"
                      variant="underlined"
                      size="lg"
                      label="Nama Pos"
                      placeholder="Masukan nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      variant="underlined"
                      size="lg"
                      label="Kode Pos"
                      placeholder="Masukan Kode Pos"
                      value={formData.kode}
                      onChange={(e) =>
                        setFormData({ ...formData, kode: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      variant="underlined"
                      size="lg"
                      label="Latitude"
                      placeholder="-6.xxxxx"
                      value={formData.lat}
                      onChange={(e) =>
                        handleManualCoordChange("lat", e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      variant="underlined"
                      size="lg"
                      label="Longitude"
                      placeholder="107.xxxxx"
                      value={formData.lng}
                      onChange={(e) =>
                        handleManualCoordChange("lng", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start w-full gap-2">
                    <h2 className="text-lg font-semibold">
                      Titik Koordinat Maps
                    </h2>
                    <p className="text-sm text-gray-500">
                      Klik di peta untuk memilih lokasi, drag marker, atau isi
                      Latitude/Longitude manual.
                    </p>
                    <div className="w-full h-[400px] rounded-lg overflow-hidden z-10">
                      <MapContainer
                        center={
                          selectedPosition
                            ? [selectedPosition.lat, selectedPosition.lng]
                            : [-6.9175, 107.6191]
                        }
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker
                          position={selectedPosition}
                          setPosition={updateCoordinates}
                        />
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-center gap-5">
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-semibold"
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner classNames={{ label: "text-white ml-2" }} />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>

        <div className="mt-6">
          {loadingTable ? (
            <div className="flex justify-center py-10">
              <Spinner label="Memuat data..." />
            </div>
          ) : (
            <Table
              aria-label="Tabel Data Pos"
              shadow="none"
              isStriped
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
                <TableColumn>Nama Pos</TableColumn>
                <TableColumn>Kode Pos</TableColumn>
                <TableColumn>Longitude</TableColumn>
                <TableColumn>Latitude</TableColumn>
                <TableColumn>Pembuatan</TableColumn>
                <TableColumn className="text-center">Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {dataPos.map((item, index) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.kode}</TableCell>
                    <TableCell>{item.lng}</TableCell>
                    <TableCell>{item.lat}</TableCell>
                    <TableCell>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-3">
                        <Button
                          size="sm"
                          className="bg-[#02A758] text-white font-semibold"
                          startContent={<FaEdit />}
                          onPress={() => handleEdit(item.uuid)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#A70202] text-white font-semibold"
                          startContent={<FaTrash />}
                          onPress={() => confirmDelete(item.uuid)}
                        >
                          Delete
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
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                  <FaExclamationTriangle size={40} className="text-[#A70202]" />
                  <span className="mt-2 text-[#A70202]">Konfirmasi Hapus</span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah anda yakin ingin menghapus data pos ini?</p>
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

export default AdminManagePos;
