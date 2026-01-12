import {
  Button,
  Select,
  SelectItem,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface ReportResponse {
  message: string;
  distance?: string;
  allowed?: string;
}

const ReportPatroli = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [photos, setPhotos] = useState<string[]>(
    routeLocation.state?.allPhotos || Array(4).fill("")
  );

  const [listSatpam, setListSatpam] = useState<any[]>([]);
  const [listPos, setListPos] = useState<any[]>([]);
  const [selectedSatpam, setSelectedSatpam] = useState("");
  const [selectedPos, setSelectedPos] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [coords, setCoords] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan response dari server
  const [resultData, setResultData] = useState<ReportResponse | null>(null);

  // State baru untuk menyimpan pesan validasi manual (Client Side)
  const [alertMessage, setAlertMessage] = useState("");

  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (routeLocation.state?.newPhoto) {
      const { newPhoto, indexToReplace } = routeLocation.state;
      setPhotos((prev) => {
        const updated = [...prev];
        if (indexToReplace !== undefined && indexToReplace >= 0) {
          updated[indexToReplace] = newPhoto;
        }
        return updated;
      });
      window.history.replaceState({}, document.title);
    }
  }, [routeLocation.state]);

  useEffect(() => {
    fetch(`${BASE_API_URL}/v1/satpams/?mode=dropdown`)
      .then((res) => res.json())
      .then((data) => setListSatpam(data.satpams || []))
      .catch((err) => console.error("Gagal fetch satpam:", err));

    const getGPS = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          });
        },
        (err) => console.error("Gagal akses GPS:", err),
        { enableHighAccuracy: true }
      );
    };
    getGPS();
  }, []);

  useEffect(() => {
    if (selectedSatpam) {
      fetch(`${BASE_API_URL}/v1/plotting/route/${selectedSatpam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            const posArray = Array.isArray(data.data) ? data.data : [data.data];
            setListPos(posArray);
            if (posArray.length === 1)
              setSelectedPos(String(posArray[0].pos_id));
          }
        })
        .catch((err) => console.error("Gagal fetch plotting pos:", err));
    } else {
      setListPos([]);
      setSelectedPos("");
    }
  }, [selectedSatpam]);

  const handleCapture = (index: number) => {
    navigate("/TakePhotoPatroli", {
      state: {
        indexToReplace: index,
        allPhotos: photos,
      },
    });
  };

  const dataURLtoBlob = (dataurl: string) => {
    if (!dataurl || !dataurl.includes(",")) return null;
    try {
      const arr = dataurl.split(",");
      const match = arr[0].match(/:(.*?);/);
      if (!match) return null;
      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async () => {
    // Reset state modal sebelumnya
    setAlertMessage("");
    setResultData(null);

    // 1. VALIDASI FOTO
    const isPhotosIncomplete = photos.some((p) => p === "" || p === null);
    if (isPhotosIncomplete) {
      setAlertMessage("Harap lengkapi 4 foto!");
      onOpen();
      return;
    }

    // 2. VALIDASI DATA INPUT
    if (!selectedSatpam || !selectedPos || !status) {
      setAlertMessage("Harap lengkapi semua pilihan!");
      onOpen();
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("satpam_id", selectedSatpam);
      formData.append("pos_id", selectedPos);
      formData.append("latitude", coords.latitude);
      formData.append("longitude", coords.longitude);
      formData.append("status_lokasi", status);
      formData.append("keterangan", notes || "-");

      photos.forEach((photo, i) => {
        const blob = dataURLtoBlob(photo);
        if (blob) {
          formData.append("foto_laporan", blob, `patroli_${i + 1}.jpg`);
        }
      });

      const res = await fetch(`${BASE_API_URL}/v1/laporan/`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setResultData(result);

      if (res.ok) {
        // Sukses
        onOpen();
      } else if (
        result.message &&
        result.message.includes("Location invalid")
      ) {
        // Error Lokasi
        onOpen();
      } else {
        // Error Lain dari Server
        setAlertMessage(result.message || "Terjadi kesalahan pada sistem.");
        onOpen();
      }
    } catch (error) {
      setAlertMessage("Terjadi kesalahan koneksi ke server.");
      onOpen();
    } finally {
      setLoading(false);
    }
  };

  // Helper Variables
  const isLocationError = resultData?.message?.includes("Location invalid");
  // Jika ada alertMessage, berarti ini error validasi / koneksi (bukan sukses, bukan lokasi)
  const isValidationError = alertMessage !== "";

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#F5F7FF] px-6 py-10 text-[#122C93]">
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-bold">Data Hasil Patroli</h2>
        <p className="text-[14px] opacity-80">
          Koordinat:{" "}
          {coords.latitude
            ? `${coords.latitude}, ${coords.longitude}`
            : "Mencari lokasi..."}
        </p>
      </div>

      {/* Grid Foto */}
      <div className="grid grid-cols-4 gap-2 w-full mb-6">
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => handleCapture(i)}
            className="aspect-[3/4] bg-white rounded-xl border-2 border-dashed border-[#122C93] flex items-center justify-center overflow-hidden cursor-pointer"
          >
            {p ? (
              <img src={p} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">+</span>
            )}
          </div>
        ))}
      </div>
      <h2>Tekan kembali jika ingin melakukan foto ulang</h2>

      <div className="w-full flex flex-col gap-4">
        <Select
          label="Petugas"
          placeholder="Pilih Nama"
          selectedKeys={selectedSatpam ? [selectedSatpam] : []}
          onSelectionChange={(k) =>
            setSelectedSatpam(Array.from(k)[0] as string)
          }
        >
          {listSatpam.map((s) => (
            <SelectItem key={String(s.id)} textValue={s.nama}>
              {s.nama}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Lokasi Pos"
          placeholder={selectedSatpam ? "Pilih Pos" : "Pilih Petugas Dulu"}
          isDisabled={!selectedSatpam}
          selectedKeys={selectedPos ? [selectedPos] : []}
          onSelectionChange={(k) => setSelectedPos(Array.from(k)[0] as string)}
        >
          {listPos.map((p) => (
            <SelectItem
              key={String(p.pos_id)}
              textValue={p.nama_pos || `Pos ${p.pos_id}`}
            >
              {p.nama_pos || `Pos ${p.pos_id}`}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Status Lokasi"
          placeholder="Pilih Kondisi"
          selectedKeys={status ? [status] : []}
          onSelectionChange={(k) => setStatus(Array.from(k)[0] as string)}
        >
          <SelectItem key="Aman" textValue="Aman">
            Aman
          </SelectItem>
          <SelectItem key="Tidak Aman" textValue="Tidak Aman">
            Tidak Aman
          </SelectItem>
        </Select>

        <Textarea
          label="Keterangan (Opsional)"
          placeholder="Tambahkan catatan jika ada..."
          value={notes}
          onValueChange={setNotes}
        />

        <Button
          className="bg-[#122C93] text-white font-bold h-12 mt-4"
          onPress={handleSubmit}
          isLoading={loading}
        >
          Laporkan
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        placement="center"
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {isValidationError ? (
                /* --- KONDISI 1: ALERT / VALIDASI BELUM LENGKAP --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#F59E0B] pt-8">
                    {/* Icon Peringatan (Orange) */}
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#F59E0B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold text-center">
                      Data Belum Lengkap
                    </h2>
                  </ModalHeader>

                  <ModalBody className="text-center pb-4">
                    <div className="bg-orange-50 p-4 rounded-xl w-full border border-orange-100">
                      <p className="text-[16px] font-medium text-[#B45309]">
                        {alertMessage}
                      </p>
                    </div>
                  </ModalBody>

                  <ModalFooter className="flex justify-center pb-8">
                    <Button
                      className="bg-[#F59E0B] text-white w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Mengerti
                    </Button>
                  </ModalFooter>
                </>
              ) : isLocationError ? (
                /* --- KONDISI 2: ERROR LOKASI (GPS) --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#A80808] pt-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#A80808]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold text-center">
                      Lokasi Tidak Valid
                    </h2>
                  </ModalHeader>

                  <ModalBody className="flex flex-col items-center gap-4 py-4 text-center">
                    <p className="text-[16px] text-gray-600 px-2">
                      Posisi Anda terlalu jauh dari Pos yang dipilih.
                    </p>

                    <div className="bg-red-50 p-4 rounded-xl w-full border border-red-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-red-200 pb-2">
                        <span className="text-[14px] text-gray-600">
                          Jarak Anda
                        </span>
                        <span className="text-[16px] font-bold text-[#A80808]">
                          {resultData?.distance}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[14px] text-gray-600">
                          Maksimal
                        </span>
                        <span className="text-[16px] font-bold text-green-700">
                          {resultData?.allowed}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13px] text-gray-400 italic">
                      Silakan bergerak mendekat ke titik lokasi Pos.
                    </p>
                  </ModalBody>

                  <ModalFooter className="flex justify-center pb-8 gap-3">
                    <Button
                      variant="bordered"
                      className="border-[#122C93] text-[#122C93] w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Cek GPS Ulang
                    </Button>
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Tutup
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                /* --- KONDISI 3: SUKSES (BERHASIL) --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#122C93] pt-8">
                    {/* Icon Check (Biru) */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#122C93]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold">Laporan Berhasil</h2>
                  </ModalHeader>
                  <ModalBody className="text-center pb-6">
                    <p className="text-[16px] text-gray-600">
                      Data patroli telah berhasil dikirim ke sistem.
                    </p>
                  </ModalBody>
                  <ModalFooter className="flex justify-center pb-8">
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        navigate("/");
                      }}
                    >
                      Selesai
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReportPatroli;
