"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, memo, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

// Types
interface Slide {
  id: number;
  images: string[];
  alt?: string[];
  title?: string;
  description?: string;
  price?: string;
}

interface SlideProps {
  slide: Slide;
  isActive: boolean;
  direction: number;
}

// Données améliorées avec plus d'informations
const SLIDES: Slide[] = [
  {
    id: 1,
    images: ["/home/s1.png", "/home/s2.png"],
    alt: ["Summer collection look 1", "Summer collection look 2"],
  },
  {
    id: 2,
    images: ["/s3.png", "/s4.png"],
    alt: ["Casual wear look 1", "Casual wear look 2"],
  },
  {
    id: 3,
    images: ["/s5.png", "/s6.png"],
    alt: ["Evening collection look 1", "Evening collection look 2"],
  },
];

const AUTO_PLAY_INTERVAL = 6000;

const SlideContent = memo(({ slide, isActive, direction }: SlideProps) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = slide.images.length;

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const slideDirection = direction > 0 ? "slide-in-right" : "slide-in-left";

  return (
    <div
      className={`absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 transition-all duration-700 ease-out ${
        isActive
          ? `opacity-100 transform-none ${slideDirection}`
          : "opacity-0 transform translate-x-20 pointer-events-none"
      }`}
    >
      {/* Images Container */}
      <div className="flex gap-4 md:gap-8 justify-center items-center relative">
        {slide.images.map((img, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="relative group cursor-pointer"
            style={{
              transform: `translateY(${index % 2 === 0 ? "-20px" : "20px"})`,
              transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <div className="relative w-44 h-64 sm:w-60 sm:h-80 md:w-80 md:h-96 lg:w-96 lg:h-[500px] xl:w-[450px] xl:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
              {/* Loading Overlay */}
              {imagesLoaded < totalImages && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                  <div className="animate-spin  h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              <Image
                src={img}
                alt={slide.alt?.[index] || `Look ${index + 1}`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 44vw, (max-width: 768px) 60vw, 80vw"
                priority={isActive && index === 0}
                onLoad={handleImageLoad}
              />

              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              {/* Hover Badge */}
            </div>

            {/* Floating Element */}
          </div>
        ))}
      </div>
    </div>
  );
});

SlideContent.displayName = "SlideContent";

export default function BestSellersLookbook() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      setProgress(0);
    },
    [current]
  );

  // Gestion du swipe tactile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-play et progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / AUTO_PLAY_INTERVAL) * 100;
      setProgress(Math.min(newProgress, 100));

      if (elapsed >= AUTO_PLAY_INTERVAL) {
        nextSlide();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, current]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying);

  return (
    <section
      className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-900/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Best sellers lookbook of the month{" "}
          </h2>
        </div>

        {/* Main Carousel */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center min-h-[800px] lg:min-h-[700px] mx-auto"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 lg:left-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-4 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20 shadow-2xl"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Slides Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {SLIDES.map((slide, index) => (
              <SlideContent
                key={slide.id}
                slide={slide}
                isActive={index === current}
                direction={direction}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 lg:right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-4 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20 shadow-2xl"
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in-right {
          animation: slide-in-right 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }

        .slide-in-left {
          animation: slide-in-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }
      `}</style>
    </section>
  );
}
