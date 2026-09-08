import { useState, useEffect } from "react";
import { FaWifi } from "react-icons/fa6";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm text-[#1E1E1E]">
      <div className="flex flex-col items-center text-center px-4 bg-white p-10 rounded-2xl shadow-xl border border-[#E8EEFF] max-w-lg w-full m-4">
        <div className="bg-[#FFE2E2] p-6 rounded-full mb-6">
          <FaWifi className="text-6xl text-[#F31260]" />
        </div>

        <h1 className="text-3xl font-bold text-[#122C93] mb-3">
          Koneksi Terputus
        </h1>

        <p className="text-sm text-[#8D8787] mb-8">
          Anda sedang offline. Mohon periksa koneksi internet Anda untuk
          melanjutkan menggunakan aplikasi.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-block px-8 py-3 text-sm font-semibold rounded-xl text-white bg-[#122C93] hover:bg-[#0C1F6B] transition-colors shadow-sm w-full"
        >
          Coba Hubungkan Ulang
        </button>
      </div>
    </div>
  );
};

export default NetworkStatus;
