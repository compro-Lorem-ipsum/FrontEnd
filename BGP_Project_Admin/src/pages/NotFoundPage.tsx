import { Link } from "react-router-dom";
import { FaGhost } from "react-icons/fa6";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF] text-[#1E1E1E]">
      <div className="flex flex-col items-center text-center px-4 bg-white p-10 rounded-2xl shadow-sm border border-[#E8EEFF] max-w-lg w-full">
        <div className="bg-[#DBEAFE] p-6 rounded-full mb-6">
          <FaGhost className="text-6xl text-[#122C93]" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-[#122C93] mb-2">
          404
        </h1>

        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Oops! Halaman Hilang.
        </h2>
        
        <p className="text-sm text-[#8D8787] mb-8">
          Sepertinya Anda tersesat. Halaman yang Anda cari tidak
          dapat ditemukan di sistem kami.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 text-sm font-semibold rounded-xl text-white bg-[#122C93] hover:bg-[#0C1F6B] transition-colors shadow-sm w-full"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );

};

export default NotFoundPage;
