import { useRef, useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";

const TakePhoto_Patroli = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);

  // 1. Ambil data allPhotos yang dikirim dari ReportPatroli
  // Gunakan nama 'allPhotos' agar sinkron dengan state di ReportPatroli
  const allPhotos = location.state?.allPhotos || Array(4).fill("");
  const indexToReplace = location.state?.indexToReplace;

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Gagal mengakses kamera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhotoData(canvas.toDataURL("image/jpeg", 0.7));
      setPhotoTaken(true);
    }
  };

  const handleNext = () => {
    // 2. KUNCI PERBAIKAN: Kirimkan kembali 'allPhotos' ke halaman Report
    navigate("/ReportPatroli", {
      state: {
        newPhoto: photoData,
        indexToReplace: indexToReplace,
        allPhotos: allPhotos, // Ini yang menjaga agar foto lain tidak hilang
      },
    });
  };

  const handleRetake = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center text-[#122C93] p-10 justify-between min-h-screen bg-[#F5F7FF]">
      <div className="text-center">
        <h2 className="text-[20px] font-semibold">Pengambilan Gambar</h2>
        <p className="text-[15px] font-medium">Ambil Gambar Lokasi Patroli</p>
      </div>

      <div className="relative w-full max-w-[350px] aspect-[9/16] bg-black rounded-xl overflow-hidden border-2 border-[#122C93]">
        {!photoTaken ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={photoData!}
            className="w-full h-full object-cover"
            alt="Captured"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="w-full flex flex-col gap-3">
        {!photoTaken ? (
          <Button
            className="bg-[#122C93] text-white h-12 font-bold"
            onPress={takePhoto}
          >
            Ambil Foto
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              className="bg-[#122C93] text-white h-12 font-bold"
              onPress={handleNext}
            >
              Gunakan Foto
            </Button>
            <Button variant="flat" color="danger" onPress={handleRetake}>
              Foto Ulang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakePhoto_Patroli;
