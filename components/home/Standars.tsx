import React from "react";

const Standard = () => {
  const features = [
    "Premium Japanese selvedge denim",
    "Reinforced copper rivets",
    "Hand-finished stitching",
    "Organic cotton blend",
    "Sustainable dye process",
    "Lifetime guarantee",
  ];

  return (
    <div className="min-h-screen bg-black flex items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-900/10 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-800/5 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full mix-blend-screen filter blur-2xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="px-4 sm:px-6 lg:px-36 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Text Content - Left Side */}
          <div className="lg:w-1/2 text-white">
            {/* Logo/Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-4xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                HASHSEVEN The New Standard.
              </h1>

              {/* Subtitle */}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12"></div>

            {/* Description Text */}
            <div className="space-y-6 mb-12">
              {[
                "Our jeans are designed with premium fabrics that combine comfort and durability. We use high-quality denim that resists fading and keeps its shape even after many washes.",
                "Every detail, from the stitching to the buttons, is carefully selected to ensure a flawless finish. Each piece tells a story of craftsmanship and attention to detail.",
                "The result is a pair of jeans that not only looks great but also feels great — soft, flexible, and made to move with you through life's moments.",
              ].map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Call to Action Buttons */}
          </div>

          {/* Image Section - Right Side */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-96 lg:h-[700px]">
              {/* Main Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                {/* Image */}
                <img
                  src="/home/stand.png"
                  alt="Premium HASHSEVEN Denim"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

                {/* Quality Badge */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standard;
