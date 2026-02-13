import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AttendanceData {
  status: string;
  kategori: string;
  distance: number;
  time: string;
  nama_satpam: string;
  nip: string;
}

interface AttendanceResponse {
  message: string;
  data?: AttendanceData;
}

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<AttendanceResponse | null>(null);

  const photoFromState = location.state?.photo;
  const latitude = location.state?.latitude;
  const longitude = location.state?.longitude;

  const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

  const dataURLtoBlob = (dataurl: string) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleConfirm = async () => {
    if (!photoFromState) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const imageBlob = dataURLtoBlob(photoFromState);

      formData.append("image", imageBlob, "attendance.png");
      formData.append("lat", latitude || "0");
      formData.append("lng", longitude || "0");

      const response = await fetch(`${BASE_API_URL}/v1/absensi/record`, {
        method: "POST",
        body: formData,
      });

      const result: AttendanceResponse = await response.json();
      setResultData(result);
      onOpen();
    } catch (error) {
      setResultData({ message: "Terjadi kesalahan jaringan." });
      onOpen();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/TakePhoto");
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status?: string) => {
    if (status === "CHECK_IN") return "Check In";
    if (status === "CHECK_OUT") return "Check Out";
    return status || "-";
  };

  const msg = resultData?.message?.toLowerCase() || "";

  const isSuccess = !!resultData?.data;

  const isLocationError =
    msg.includes("jarak") ||
    msg.includes("radius") ||
    msg.includes("pos utama");

  const isFaceError = msg.includes("wajah") || msg.includes("face");

  const isScheduleError =
    msg.includes("jadwal") ||
    msg.includes("terlalu awal") ||
    msg.includes("menyelesaikan shift");

  const isUserError = msg.includes("satpam") || msg.includes("user");

  return (
    <>
      <div className="flex flex-col items-center justify-between min-h-screen bg-[#F5F7FF] p-10 text-[#122C93]">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[20px] font-semibold">Verifikasi Wajah</h1>
          <p className="text-[15px] font-medium">
            Pastikan Wajah dan Identitas Sesuai
          </p>
        </div>

        <div className="flex flex-col items-center mt-4 gap-10">
          <div className="flex flex-col items-center mt-4 text-center">
            <p className="text-[20px] font-semibold">Konfirmasi Absensi</p>
            <p className="text-[20px] font-medium">
              Waktu Scan:{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="relative w-[280px] h-[280px] border-2 border-dashed border-[#122C93] rounded-xl overflow-hidden">
            <img
              src={photoFromState}
              alt="Hasil Foto"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center mt-3">
            <p className="text-[20px] font-semibold text-[#122C93]">
              Menunggu Konfirmasi Anda
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6 ">
          <Button
            className="bg-[#122C93] text-white w-[350px] font-semibold rounded-xl"
            onPress={handleConfirm}
            isLoading={isSubmitting}
          >
            Konfirmasi
          </Button>
          <Button
            className="bg-[#A80808] text-white w-[350px] font-semibold rounded-xl"
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
        </div>
      </div>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        className="mx-5"
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {isSuccess ? (
                /* --- KONDISI 1: SUKSES --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#122C93] pt-8">
                    <h2 className="text-[22px] font-bold">Absensi Berhasil</h2>
                  </ModalHeader>

                  <ModalBody className="flex flex-col items-center gap-4 py-6 w-full">
                    <div className="text-center w-full">
                      <p className="text-[24px] font-bold text-[#122C93]">
                        {formatStatus(resultData?.data?.status)}
                      </p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl w-full text-center">
                      <p className="text-[14px]">Waktu Pencatatan</p>
                      <p className="text-[20px] font-bold">
                        {formatTime(resultData?.data?.time)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-full">
                      <p
                        className={`text-[18px] font-bold ${
                          resultData?.data?.kategori === "Tepat Waktu"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {resultData?.data?.kategori}
                      </p>
                    </div>
                  </ModalBody>

                  <ModalFooter className="flex justify-center pb-8 w-full">
                    <Button
                      color="primary"
                      className="bg-[#122C93] text-white rounded-lg w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        navigate("/");
                      }}
                    >
                      Selesai
                    </Button>
                  </ModalFooter>
                </>
              ) : isLocationError ? (
                /* --- KONDISI 2: ERROR LOKASI / POS --- */
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
                      Posisi Anda tidak sesuai dengan ketentuan.
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl w-full border border-red-100">
                      <p className="text-sm text-red-800">
                        {resultData?.message}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex justify-center pb-8 gap-3 w-full">
                    <Button
                      variant="bordered"
                      className="border-[#122C93] text-[#122C93] w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Cek GPS
                    </Button>
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        handleCancel();
                      }}
                    >
                      Kembali
                    </Button>
                  </ModalFooter>
                </>
              ) : isFaceError ? (
                /* --- KONDISI 3: ERROR WAJAH --- */
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold text-center">
                      Wajah Tidak Dikenali
                    </h2>
                  </ModalHeader>
                  <ModalBody className="flex flex-col items-center gap-4 py-4 text-center">
                    <p className="text-[16px] text-gray-600 px-2">
                      Sistem gagal memverifikasi identitas.
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl w-full border border-red-100">
                      <p className="text-[14px] font-medium text-[#A80808]">
                        {resultData?.message ||
                          "Pastikan pencahayaan cukup dan wajah terlihat jelas."}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex justify-center pb-8 gap-3 w-full">
                    <Button
                      variant="bordered"
                      className="border-[#122C93] text-[#122C93] w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Coba Lagi
                    </Button>
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        handleCancel();
                      }}
                    >
                      Ambil Foto Ulang
                    </Button>
                  </ModalFooter>
                </>
              ) : isScheduleError ? (
                /* --- KONDISI 4: MASALAH JADWAL / WAKTU --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#d97706] pt-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#d97706]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold text-center">
                      Informasi Jadwal
                    </h2>
                  </ModalHeader>
                  <ModalBody className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="bg-orange-50 p-4 rounded-xl w-full border border-orange-100">
                      <p className="text-[15px] font-medium text-[#d97706]">
                        {resultData?.message}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex justify-center pb-8 w-full">
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        navigate("/");
                      }}
                    >
                      Kembali ke Beranda
                    </Button>
                  </ModalFooter>
                </>
              ) : isUserError ? (
                /* --- KONDISI 5: ERROR USER/DATA --- */
                <>
                  <ModalHeader className="flex flex-col items-center text-[#A80808] pt-8">
                    <h2 className="text-[22px] font-bold text-center">
                      Data Tidak Ditemukan
                    </h2>
                  </ModalHeader>
                  <ModalBody className="text-center py-4">
                    <p className="text-red-600">{resultData?.message}</p>
                  </ModalBody>
                  <ModalFooter className="flex justify-center pb-8 w-full">
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        navigate("/");
                      }}
                    >
                      Kembali
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                /* --- KONDISI 6: DEFAULT / UNKNOWN ERROR --- */
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-[22px] font-bold text-center">Gagal</h2>
                  </ModalHeader>

                  <ModalBody className="flex flex-col items-center gap-4 py-4 text-center">
                    <p className="text-[16px] text-gray-600 px-2">
                      Terjadi kesalahan saat memproses permintaan.
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl w-full border border-red-100">
                      <p className="text-[14px] font-medium text-[#A80808]">
                        {resultData?.message || "Internal Server Error"}
                      </p>
                    </div>
                  </ModalBody>

                  <ModalFooter className="flex justify-center pb-8 gap-3 w-full">
                    <Button
                      variant="bordered"
                      className="border-[#122C93] text-[#122C93] w-full h-12 font-semibold"
                      onPress={onClose}
                    >
                      Tutup
                    </Button>
                    <Button
                      className="bg-[#122C93] text-white w-full h-12 font-semibold"
                      onPress={() => {
                        onClose();
                        handleConfirm();
                      }}
                    >
                      Coba Lagi
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Verification;
