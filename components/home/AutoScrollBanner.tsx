"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

interface LogoItem {
  src: string;
  alt: string;
  name: string;
  description?: string;
  link?: string;
}

export default function AutoScrollBanner() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const logos: LogoItem[] = [
    {
      src: "/home/a.svg",
      alt: "Brand A",
      name: "Premium Denim",
      description: "Luxury fabric specialists",
      link: "/brands/a",
    },
    {
      src: "/home/b.svg",
      alt: "Brand B",
      name: "Eco Textiles",
      description: "Sustainable materials",
      link: "/brands/b",
    },
    {
      src: "/home/c.svg",
      alt: "Brand C",
      name: "Artisan Craft",
      description: "Handcrafted excellence",
      link: "/brands/c",
    },
    {
      src: "/home/d.svg",
      alt: "Brand D",
      name: "Innovation Lab",
      description: "Cutting-edge technology",
      link: "/brands/d",
    },
  ];

  const handleLogoClick = (logo: LogoItem) => {
    if (logo.link) router.push(logo.link);
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-black py-12 md:py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/3 rounded-full blur-2xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}

        {/* Control Button */}

        {/* Logos Scroll */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />

          <div
            className={`flex gap-16 ${
              isPaused ? "" : "animate-scroll"
            } whitespace-nowrap`}
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className={`group relative  backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 cursor-pointer flex-shrink-0 `}
                onMouseEnter={() => setHoveredLogo(logo.alt)}
                onMouseLeave={() => setHoveredLogo(null)}
                onClick={() => handleLogoClick(logo)}
              >
                <div className="relative w-60 h-40 flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      hoveredLogo === logo.alt
                        ? "brightness-0 invert scale-110"
                        : ""
                    }`}
                  />
                </div>
                {/* Hover Info */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-2xl transition-all duration-300 z-30 ${
                    hoveredLogo === logo.alt
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-white text-lg mb-1">
                      {logo.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {logo.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-semibold">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900/95 rotate-45 border-l border-t border-white/10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
