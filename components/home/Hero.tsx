"use client";

import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  imageUrl: string;
  buttonText: string;
  verticalText: string;
  onButtonClick?: () => void;
  imagePriority?: boolean;
  imageQuality?: number;
  overlayGradient?: string;
  enableParallax?: boolean;
  scrollIndicator?: boolean;
  loadingStrategy?: "eager" | "lazy";
  buttonLink?: string; // Added optional button link prop
}

const Hero: React.FC<HeroProps> = memo(
  ({
    imageUrl,
    buttonText,
    verticalText,
    onButtonClick,
    imagePriority = false,
    imageQuality = 85,
    overlayGradient = "bg-gradient-to-br from-black/40 via-transparent to-black/20",
    enableParallax = true,
    scrollIndicator = true,
    loadingStrategy = "lazy",
    buttonLink = "/categories", // Default link
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      if (sectionRef.current) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observerRef.current?.disconnect();
            }
          },
          { threshold: 0.1 }
        );
        observerRef.current.observe(sectionRef.current);
      }
      return () => observerRef.current?.disconnect();
    }, []);

    const handleButtonClick = useCallback(() => {
      onButtonClick?.();
    }, [onButtonClick]);

    const renderVerticalText = useMemo(() => {
      return verticalText.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="
            text-white font-bold text-xl 
            transition-all duration-300 ease-out
            hover:opacity-70 hover:scale-110
            transform hover:translate-x-1
            cursor-default
          "
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {char}
        </span>
      ));
    }, [verticalText]);

    const handleParallax = useCallback(
      (e: React.MouseEvent) => {
        if (!enableParallax || !sectionRef.current) return;

        const { clientX, clientY } = e;
        const { width, height } = sectionRef.current.getBoundingClientRect();

        const x = (clientX / width - 0.5) * 20;
        const y = (clientY / height - 0.5) * 20;

        if (imageRef.current) {
          imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
        }
      },
      [enableParallax]
    );

    const resetParallax = useCallback(() => {
      if (imageRef.current) {
        imageRef.current.style.transform = "translate(0px, 0px) scale(1)";
      }
    }, []);

    const handleScroll = useCallback(() => {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }, []);

    // Fixed button component to avoid nested links
    const ButtonContent = useMemo(
      () => (
        <button
          onClick={handleButtonClick}
          className="group relative bg-black px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={buttonText}
        >
          <span className="relative z-10 transition-all duration-300 group-hover:tracking-wider text-white">
            {buttonText}
          </span>
          <span className="absolute inset-0 rounded-lg bg-black -z-10" />
        </button>
      ),
      [buttonText, handleButtonClick]
    );

    return (
      <section
        ref={sectionRef}
        className={`relative w-full h-[120vh] overflow-hidden transform transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        role="banner"
        onMouseMove={handleParallax}
        onMouseLeave={resetParallax}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Hero Image"
            fill
            priority={imagePriority}
            quality={imageQuality}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className={`object-cover w-full h-full transition-transform duration-700 ease-out ${
              isLoaded ? "scale-100" : "scale-110"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            loading={loadingStrategy}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Overlay Gradient */}
          <div
            className={`absolute inset-0 ${overlayGradient} transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />

          {/* Subtle brightness overlay */}
          <div
            className="absolute inset-0 bg-white/5 mix-blend-overlay"
            aria-hidden="true"
          />
        </div>

        {/* Vertical Decorative Text */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-32 h-32 md:w-48 md:h-[680px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            {renderVerticalText}
          </div>
        </div>

        {/* Center Button */}
        <div className="absolute inset-0 flex justify-center items-center z-30">
          {buttonLink ? (
            <Link href={buttonLink}>{ButtonContent}</Link>
          ) : (
            ButtonContent
          )}
        </div>

        {/* Scroll Indicator */}
        {scrollIndicator && (
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 z-30 ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
            aria-hidden="true"
          >
            <button
              onClick={handleScroll}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
              aria-label="Scroll to explore"
            >
              <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center group-hover:border-white transition-colors duration-300">
                <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse group-hover:bg-white transition-colors duration-300" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Scroll to explore
              </div>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-40">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        )}
      </section>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;
