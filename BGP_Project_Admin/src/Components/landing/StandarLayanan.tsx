export const StandarLayanan = () => {
  return (
    <section id="standar-layanan" className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Standar Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-[#E8EEFF] rounded-full mx-auto mb-4 flex items-center justify-center text-[#122C93] font-bold">
                0{item}
              </div>
              <h3 className="font-semibold text-lg mb-2">Profesionalisme Tinggi</h3>
              <p className="text-gray-600 text-sm">Standar keamanan dengan pelatihan terbaik untuk menjamin kepuasan klien.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
