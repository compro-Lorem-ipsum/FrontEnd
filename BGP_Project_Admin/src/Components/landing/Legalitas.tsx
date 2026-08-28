export const Legalitas = () => {
  return (
    <section id="legalitas" className="py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">Legalitas Perusahaan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Izin Operasional", "Tanda Daftar Perusahaan", "NPWP", "Sertifikasi ISO"].map((item, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div className="w-12 h-12 bg-[#E8EEFF] rounded-full mx-auto mb-3 flex items-center justify-center text-[#122C93] font-bold">
                ✓
              </div>
              <p className="font-medium text-gray-800 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
