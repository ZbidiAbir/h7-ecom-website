import React, { useState, useEffect, useRef } from "react";

const Standard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  const features = [
    "Premium Japanese selvedge denim",
    "Reinforced copper rivets",
    "Hand-finished stitching",
    "Organic cotton blend",
    "Sustainable dye process",
    "Lifetime guarantee",
  ];

  // Fonction pour gérer les erreurs de chargement d'image
  const handleImageError = () => {
    console.error("Image failed to load: /home/stand.png");
    setImageError(true);
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-black flex items-center relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-900/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-800/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full mix-blend-screen filter blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className=" px-4  sm:px-6 lg:px-36 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Text Content - Left Side */}
          <div className="lg:w-1/2 text-white">
            {/* Logo/Title with Animation */}
            <div
              className={`mb-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-6xl md:text-8xl lg:text-7xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                HASHSEVEN
              </h1>

              {/* Subtitle with Border Animation */}
              <div className="relative inline-block">
                <p className="text-xl md:text-2xl text-gray-300 uppercase tracking-widest font-light relative z-10">
                  The New Standard.
                </p>
                <div
                  className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-gray-400 to-transparent transition-all duration-1000 delay-300 ${
                    isVisible ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Features Grid */}
            <div
              className={`grid grid-cols-2 gap-4 mb-12 transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            ></div>

            {/* Description Text with Staggered Animation */}
            <div className="space-y-6 mb-12">
              {[
                "Our jeans are designed with premium fabrics that combine comfort and durability. We use high-quality denim that resists fading and keeps its shape even after many washes.",
                "Every detail, from the stitching to the buttons, is carefully selected to ensure a flawless finish. Each piece tells a story of craftsmanship and attention to detail.",
                "The result is a pair of jeans that not only looks great but also feels great — soft, flexible, and made to move with you through life's moments.",
              ].map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-lg text-gray-300 leading-relaxed transition-all duration-1000 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${700 + index * 200}ms`
                      : "0ms",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Call to Action Buttons */}
          </div>

          {/* Enhanced Image Section - Right Side */}
          <div className="lg:w-1/2 flex justify-center">
            <div
              className={`relative w-full max-w-lg h-96 lg:h-[700px] transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              {/* Main Image Container */}
              <div className="relative w-full h-full  overflow-hidden group">
                {/* Background Gradient Fallback */}

                {/* Image with Loading State */}
                <img
                  src="/home/stand.png"
                  alt="Premium HASHSEVEN Denim"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105`}
                />

                {/* Loading Indicator */}

                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-full p-3 border border-gray-700 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Quality Badge */}
                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-white text-sm font-medium tracking-wide">
                    Made In Tunisia
                  </span>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standard;
