"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Abel } from "next/font/google";

const abel = Abel({
  weight: "400",
  subsets: ["latin"],
});
const images = ["/home/h1.png", "/home/h2.png", "/home/h3.png"]; // 👉 remplace avec tes propres images dans public/

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // changer d'image toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[900px] overflow-hidden">
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

      {/* Image absolute à droite */}
      <div
        className={`absolute text-4xl left-10 bottom-24 transform -translate-y-1/2 z-20 ${abel.className}`}
      >
        <p>Don’t blink.</p>
        <p>
          New <span className="font-semibold">HASHSEVEN</span> pieces are coming
        </p>
        <p>be here to grab the fire first.</p>
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col items-center  h-full text-center text-black pt-36">
        <p className={`p-4 text-6xl font-bold ${abel.className}`}>
          MADE FOR STREET AND LUXURY{" "}
          <span className="text-black font-bold">FASHION</span>
        </p>
        <div className="uppercase flex items-center gap-4">
          {" "}
          <button className="bg-black px-8 py-3 font-semibold cursor-pointer text-white rounded-lg">
            SHOP NOW !{" "}
          </button>
          <button className="bg-white uppercase px-8 py-3 font-semibold cursor-pointer text-black rounded-lg">
            Explore ALL
          </button>
        </div>
      </div>
    </section>
  );
}
