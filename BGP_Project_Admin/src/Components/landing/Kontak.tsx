export const Kontak = () => {
  return (
    <section id="kontak" className="py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Hubungi Kami</h2>
        <p className="text-gray-600 mb-10">Punya pertanyaan atau ingin berkonsultasi mengenai kebutuhan keamanan Anda? Silakan hubungi tim kami.</p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#122C93]" />
          <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#122C93]" />
          <textarea rows={4} placeholder="Pesan Anda" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#122C93]"></textarea>
          <button className="bg-[#122C93] text-white py-3 rounded-lg font-medium hover:bg-[#0e2170] transition-colors mt-2">Kirim Pesan</button>
        </div>
      </div>
    </section>
  );
};
