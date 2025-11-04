"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = ["/home/h1.png", "/home/h2.png", "/home/h3.png"]; // 👉 remplace avec tes propres images dans public/

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // changer d’image toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 200000000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Images de fond avec transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={images[current]}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[current]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Overlay sombre pour meilleure lisibilité */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white pt-64">
        <button className="bg-black px-8 py-3  font-semibold  cursor-pointer">
          Discover the collection{" "}
        </button>
      </div>
    </section>
  );
}
