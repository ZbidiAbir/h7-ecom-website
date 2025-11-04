"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // ⏱️ délai entre chaque carte
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Shipping() {
  const items = [
    {
      id: 1,
      img: "/home/delivery.svg",
      title: "Fast delivery",
      text: "across Tunisia",
    },
    {
      id: 2,
      img: "/home/cash.svg",
      title: "Cash on delivery",
      text: "",
    },
    {
      id: 3,
      img: "/home/easy.svg",
      title: "Easy returns",
      text: "within 7 days",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto text-center px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, amount: 0.3 }} // 👈 déclenche à 30% visible
          className="text-4xl font-extrabold text-gray-900 mb-16"
        >
          Shipping
        </motion.h2>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-12"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.07, y: -5 }}
              className="flex flex-col items-center text-center cursor-default"
            >
              <div className="relative w-20 h-20 mb-6">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-800 text-lg font-semibold leading-relaxed">
                {item.title} <br /> {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
