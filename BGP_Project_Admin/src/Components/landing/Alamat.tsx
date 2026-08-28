export const Alamat = () => {
  return (
    <section id="alamat" className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Alamat Kantor</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-xl mb-4 text-[#122C93]">Kantor Pusat</h3>
            <p className="text-gray-600 mb-2">Gedung Keamanan Mandiri Lt. 3</p>
            <p className="text-gray-600 mb-2">Jl. Jend. Sudirman Kav. 21, Jakarta Selatan</p>
            <p className="text-gray-600 mb-2">DKI Jakarta, 12920</p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-200 h-64 rounded-2xl flex justify-center items-center">
            <span className="text-gray-500 font-medium">[ Google Maps ]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
