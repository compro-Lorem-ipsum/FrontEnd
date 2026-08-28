export const Mitra = () => {
  return (
    <section id="mitra" className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">Mitra Kami</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Telah dipercaya oleh berbagai perusahaan dan institusi di Indonesia untuk menjaga aset dan operasional mereka.</p>
        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="w-32 h-16 bg-gray-200 rounded-lg flex justify-center items-center">
               <span className="text-gray-500 text-xs">[ Logo {item} ]</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
