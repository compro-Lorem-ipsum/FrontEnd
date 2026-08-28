export const KompetensiSecurity = () => {
  return (
    <section id="kompetensi" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Kompetensi Security</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 bg-gray-200 h-64 rounded-2xl flex justify-center items-center">
             <span className="text-gray-500 font-medium">[ Foto Pelatihan ]</span>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-[#122C93] mb-4">SDM Terlatih & Tersertifikasi</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-600">Pelatihan dasar dan lanjutan keamanan fisik.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-600">Pelatihan penanganan gawat darurat dan K3.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-600">Sertifikasi Gada Pratama, Madya, dan Utama.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
