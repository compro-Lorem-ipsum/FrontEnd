export const LayananKami = () => {
  return (
    <section id="layanan" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Penyedia Tenaga Keamanan", "Konsultasi Keamanan", "Peralatan Keamanan", "Pengawalan VIP"].map((layanan, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-3 text-[#122C93]">{layanan}</h3>
              <p className="text-gray-600 text-sm">Memberikan solusi terintegrasi sesuai dengan kebutuhan dan standar perusahaan Anda.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
