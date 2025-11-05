"use client";
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-black flex items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-900/5 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gray-800/10 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/3 rounded-full mix-blend-screen filter blur-2xl"></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(255,255,255,0.03)_0%,transparent_50%),linear-gradient(-30deg,rgba(255,255,255,0.02)_0%,transparent_50%)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="px-4 sm:px-6 lg:px-24 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Image Section - Left Side */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Main Image Container */}
              <div className="relative overflow-hidden">
                {/* Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 rounded-2xl"></div>

                {/* Main Image */}
                <img
                  src="/home/about.png"
                  alt="Hashseven Brand Story"
                  className="relative w-full h-96 lg:h-[600px] object-cover"
                />

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20"></div>
              </div>

              {/* Decorative Line */}
              <div className="h-0.5 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 mt-8 w-full"></div>
            </div>
          </div>

          {/* Text Content - Right Side */}
          <div className="lg:w-1/2 text-white">
            {/* Header */}
            <div className="mb-12">
              {/* Brand Tagline */}
              <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                About HASHSEVEN
              </h2>
            </div>

            {/* Description Text */}
            <div className="space-y-8 mb-12">
              {[
                "Founded in Tunisia, Hashseven is a ready-to-wear brand that blends modern street style with Tunisian creativity. More than just clothing, we represent a lifestyle — bold, confident, and effortlessly stylish.",
                "At Hashseven, we believe that fashion is a form of self-expression. Every piece is designed to reflect individuality, comfort, and attitude through thoughtful design and premium craftsmanship.",
                "Combining minimalist cuts, premium fabrics, and unique details that make each outfit stand out. We're not just creating clothes; we're crafting identities and building a community.",
              ].map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-gray-300 leading-relaxed"
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
