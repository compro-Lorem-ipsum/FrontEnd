export const Footer = () => {
  return (
    <footer className="bg-[#0b1b5e] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">BGP</h2>
          <p className="text-sm text-gray-300 mt-2">Solusi Keamanan Profesional</p>
        </div>
        <div className="text-sm text-gray-400 text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} BGP Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
