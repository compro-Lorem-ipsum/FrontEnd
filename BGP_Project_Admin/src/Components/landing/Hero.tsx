import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center py-20 hero-grid-bg text-white overflow-hidden"
    >
      {/* Static Blur Backgrounds */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#5000AB] rounded-full blur-[200px] opacity-25 z-0 pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-[#122C93] rounded-full blur-[200px] opacity-20 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
        >
          Never Stop To <br /> Protect and Service
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-[#94A3B8] mb-10 leading-relaxed max-w-4xl mx-auto"
        >
          Berdiri sejak 2016, kami menghadirkan Jasa Security, Cleaning, dan
          Supporting Services berskala nasional. Didukung legalitas penuh, SDM
          terlatih, dan sistem manajemen mutu digital yang inovatif untuk
          kepuasan Anda.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#122C93] px-10 py-4 rounded-full font-bold shadow-xl hover:bg-gray-100 hover:shadow-2xl transition-all text-lg"
        >
          Hubungi Kami
        </motion.button>
      </div>
    </section>
  );
};
