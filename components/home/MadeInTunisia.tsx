"use client";

import { motion } from "framer-motion";

export default function MadeInTunisia() {
  return (
    <section className="py-16 bg-white  px-4 overflow-hidden">
      <blockquote className="text-2xl md:text-6xl font-bold text-black leading-relaxed inline-block">
        {/* Ligne 1 - Animation depuis la gauche */}
        <motion.span
          className="block px-12"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.6 }} // Déclenche quand 60% est visible
        >
          “Proudly made in Tunisia,
        </motion.span>

        {/* Ligne 2 - Animation depuis la droite */}
        <motion.span
          className="block mt-3  pl-[400px]"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          where design meets craftsmanship.”
        </motion.span>
      </blockquote>
    </section>
  );
}
