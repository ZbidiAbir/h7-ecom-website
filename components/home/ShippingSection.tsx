import React, { useState, useEffect } from "react";

const ShippingSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("shipping-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const features = [
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Fast delivery across Tunisia",
      description:
        "Delivery within 24-48 hours in main cities, 2-3 days in other regions",
      stats: "24-48H",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Cash on delivery",
      description:
        "Pay when you receive your order. Multiple payment methods available",
      highlight: "Secure Payment",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Easy returns within 7 days",
      description:
        "Free returns and exchanges within 7 days of receiving your order",
      highlight: "Free Returns",
    },
  ];

  return (
    <div id="shipping-section" className="relative overflow-hidden">
      {/* Background avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0"></div>

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-white/80 backdrop-blur-sm py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec animation */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Shipping & Delivery <br />
              {""}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast, reliable shipping services across Tunisia with complete
              peace of mind
            </p>
          </div>

          {/* Grille de fonctionnalités */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 200}ms` : "0ms",
                }}
              >
                {/* Badge statistique */}
                {feature.stats && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {feature.stats}
                  </div>
                )}

                {/* Highlight badge */}
                {feature.highlight && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {feature.highlight}
                  </div>
                )}

                {/* Icon avec effet hover */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl group-hover:from-gray-50 group-hover:to-gray-100 transition-all duration-300 shadow-inner">
                    <div className="text-gray-700 group-hover:text-gray-600 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Lien d'action */}
                </div>

                {/* Effet de bordure au hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Bannière informative supplémentaire */}
        </div>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ShippingSection;
