"use client";
import { useState } from "react";
import Image from "next/image";
import { Jersey_10 } from "next/font/google";

// Configuration de la police Jersey 10
const jersey = Jersey_10({
  weight: "400",
  subsets: ["latin"],
});

type Item = {
  title: string;
  image: string;
};

const items: Item[] = [
  { title: "PERFUMS", image: "/home/perfumes.png" },
  { title: "Clothes", image: "/home/clothes.png" },
  { title: "ACCESSORIES", image: "/home/accessories.png" },
];

export default function Carousel() {
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (newIndex: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIndex(newIndex);

    // Réinitialiser l'état de transition après l'animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const prev = () => {
    const newIndex = index === 0 ? items.length - 1 : index - 1;
    navigate(newIndex);
  };

  const next = () => {
    const newIndex = index === items.length - 1 ? 0 : index + 1;
    navigate(newIndex);
  };

  const leftIndex = (index - 1 + items.length) % items.length;
  const rightIndex = (index + 1) % items.length;

  return (
    <div className="w-full flex flex-col items-center bg-black py-24">
      <div className="relative flex items-center gap-8">
        {/* Image gauche */}
        <div className="hidden md:block w-[180px] h-[260px] opacity-50 scale-90 transition-all duration-300 ease-out  overflow-hidden">
          <Image
            src={items[leftIndex].image}
            alt={items[leftIndex].title}
            width={180}
            height={260}
            className="object-cover w-full h-full transition-transform duration-300 ease-out"
          />
        </div>

        {/* Bouton précédent */}
        <button
          onClick={prev}
          disabled={isTransitioning}
          className="text-white text-4xl hover:scale-110 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        {/* Image centrale */}
        <div className="relative">
          <div
            className={`
              w-[300px] h-[420px]  overflow-hidden  
              transition-all duration-300 ease-out
              ${
                isTransitioning
                  ? "scale-95 opacity-80"
                  : "scale-100 opacity-100"
              }
            `}
          >
            <Image
              src={items[index].image}
              alt={items[index].title}
              width={300}
              height={420}
              className="object-cover w-full h-full transition-transform duration-300 ease-out"
            />
            <div
              className={`
                absolute bottom-50 left-1/2 -translate-x-1/2 text-white text-6xl font-bold uppercase 
                transition-all duration-300 ease-out
                ${jersey.className}
                ${
                  isTransitioning
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }
              `}
            >
              {items[index].title}
            </div>
          </div>
        </div>

        {/* Bouton suivant */}
        <button
          onClick={next}
          disabled={isTransitioning}
          className="text-white text-4xl hover:scale-110 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ›
        </button>

        {/* Image droite */}
        <div className="hidden md:block w-[180px] h-[260px] opacity-50 scale-90 transition-all duration-300 ease-out  overflow-hidden">
          <Image
            src={items[rightIndex].image}
            alt={items[rightIndex].title}
            width={180}
            height={260}
            className="object-cover w-full h-full transition-transform duration-300 ease-out"
          />
        </div>
      </div>

      {/* Indicateurs de navigation */}
    </div>
  );
}
