"use client";
import React, { useState, useEffect, useRef } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeStat, setActiveStat] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-black flex items-center relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-900/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gray-800/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/3 rounded-full mix-blend-screen filter blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.03)_0%,transparent_50%),linear-gradient(-30deg,rgba(255,255,255,0.02)_0%,transparent_50%)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="  px-4 sm:px-6 lg:px-24 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Enhanced Image Section - Left Side */}
          <div className="lg:w-1/2 flex justify-center">
            <div
              className={`relative w-full max-w-lg transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              {/* Main Image Container */}
              <div className="relative  overflow-hidden group">
                {/* Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 rounded-2xl"></div>

                {/* Main Image */}
                <img
                  src="/home/about.png"
                  alt="Hashseven Brand Story"
                  className={`relative w-full h-96 lg:h-[600px] object-cover transition-all duration-700group-hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Dynamic Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                {/* Floating Brand Elements */}
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-gray-700 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-white text-sm font-medium tracking-wider">
                    TUNISIAN CRAFTED
                  </div>
                </div>

                {/* Animated Stats Indicator */}

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Decorative Line */}
              <div
                className={`h-0.5 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 mt-8 transition-all duration-1000 delay-500 ${
                  isVisible ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              ></div>
            </div>
          </div>

          {/* Enhanced Text Content - Right Side */}
          <div className="lg:w-1/2 text-white">
            {/* Animated Header */}
            <div
              className={`mb-12 transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="relative inline-block mb-4">
                <p className="text-xl md:text-2xl text-gray-300 uppercase tracking-widest font-light relative z-10">
                  About HASHSEVEN
                </p>
                <div
                  className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-gray-400 to-transparent transition-all duration-1000 delay-300 ${
                    isVisible ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>

              {/* Brand Tagline */}
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                Redefining
                <span className="block">Tunisian Streetwear</span>
              </h2>
            </div>

            {/* Animated Description Text */}
            <div className="space-y-8 mb-12">
              {[
                "Founded in Tunisia, Hashseven is a ready-to-wear brand that blends modern street style with Tunisian creativity. More than just clothing, we represent a lifestyle — bold, confident, and effortlessly stylish.",
                "At Hashseven, we believe that fashion is a form of self-expression. Every piece is designed to reflect individuality, comfort, and attitude through thoughtful design and premium craftsmanship.",
                "Combining minimalist cuts, premium fabrics, and unique details that make each outfit stand out. We're not just creating clothes; we're crafting identities and building a community.",
              ].map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-lg text-gray-300 leading-relaxed transition-all duration-1000 delay-${
                    500 + index * 200
                  } ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${500 + index * 200}ms`
                      : "0ms",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
