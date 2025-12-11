"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function PremiumSushiScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const animationRef = useRef();
  const lastScrollY = useRef(0);

  // Optimisation des performances avec useCallback
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Limite les calculs à 60fps
    if (Math.abs(currentScrollY - lastScrollY.current) > 1) {
      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    }
  }, []);

  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    handleResize(); // Initial size

    const onScroll = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(() => {
          handleScroll();
          animationRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll, handleResize]);

  // Calculs optimisés
  const docHeight = document.documentElement.scrollHeight - windowSize.height;
  const progress = Math.min(scrollY / docHeight, 1);

  const sushiTransform = {
    x: progress * (windowSize.width - 160),
    y: Math.sin(progress * Math.PI * 3) * 80,
    rotation: progress * 720,
    scale: 0.7 + progress * 0.6,
  };

  // Couleur dynamique basée sur la position
  const dynamicColor = `hsl(${20 + progress * 40}, 70%, 50%)`;

  return (
    <div className="min-h-[400vh] bg-gradient-to-b from-blue-50 via-amber-50 to-orange-100">
      {/* Navigation simple */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-orange-200">
        <div className="container mx-auto px-6 py-4">
          <div className="text-xl font-bold text-orange-600">
            🍣 Sushi Scroll
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Sushi
            <span className="block text-2xl md:text-3xl text-orange-500 mt-2">
              L'art du mouvement
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scroll down to begin the culinary journey
          </p>
        </div>
      </section>

      {/* Sushi Principal avec Animations Avancées */}
      <div
        className="fixed top-1/2 left-4 z-40 will-change-transform"
        style={{
          transform: `
            translate3d(${sushiTransform.x}px, ${sushiTransform.y}px, 0)
            scale(${sushiTransform.scale})
            rotate(${sushiTransform.rotation}deg)
          `,
          filter: `drop-shadow(0 ${10 + progress * 20}px ${
            20 + progress * 30
          }px rgba(0,0,0,0.3))`,
        }}
      >
        <div className="relative w-40 h-40">
          {/* Effet de lumière */}
          <div
            className="absolute -inset-4 bg-orange-200 rounded-full blur-xl opacity-50 transition-opacity duration-300"
            style={{ opacity: 0.3 + progress * 0.4 }}
          />

          {/* Plateau */}
          <div className="absolute inset-0 bg-wood rounded-2xl border-4 border-amber-700 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl opacity-90" />
          </div>

          {/* Sushi Composition */}
          <div className="absolute inset-3 flex items-center justify-center">
            <div className="relative w-24 h-16">
              {/* Riz avec texture */}
              <div className="absolute inset-0 bg-white rounded-lg shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 rounded-lg" />
                {/* Texture riz */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-1 bg-gray-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Saumon avec effet de fraîcheur */}
              <div
                className="absolute -top-1 inset-x-1 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-lg transform -skew-y-3 shadow-lg"
                style={{
                  background: dynamicColor,
                  transform: `skewY(${
                    -3 + Math.sin(progress * Math.PI * 8) * 2
                  }deg)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" />
              </div>

              {/* Algue subtile */}
              <div className="absolute -bottom-1 inset-x-2 h-1 bg-green-800 rounded-full opacity-80" />

              {/* Graines de sésame animées */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-amber-600 rounded-full shadow-sm transition-transform duration-300"
                    style={{
                      transform: `scale(${
                        0.8 + Math.sin((progress * 10 + i) * Math.PI * 2) * 0.4
                      })`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections de Contenu */}
      {[
        {
          title: "Fraîcheur",
          content: "Ingrédients sélectionnés pour une qualité optimale",
          emoji: "🎣",
        },
        {
          title: "Précision",
          content: "Chaque mouvement est calculé pour la perfection",
          emoji: "🎯",
        },
        {
          title: "Harmonie",
          content: "L'équilibre parfait entre tradition et innovation",
          emoji: "⚖️",
        },
        {
          title: "Voyage",
          content: "Une expérience culinaire qui transcende les frontières",
          emoji: "✈️",
        },
      ].map((section, index) => (
        <section
          key={index}
          className="h-screen flex items-center justify-center px-4"
        >
          <div className="text-center max-w-2xl mx-auto bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-orange-200">
            <div className="text-4xl mb-4">{section.emoji}</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {section.title}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </div>
        </section>
      ))}

      {/* Section Finale */}
      <section className="h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-8">🍣</div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Merci !
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Votre voyage culinaire animé est terminé
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Découvrir la Carte
          </button>
        </div>
      </section>

      <style jsx>{`
        .bg-wood {
          background-image: linear-gradient(45deg, #d97706 25%, transparent 25%),
            linear-gradient(-45deg, #d97706 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #d97706 75%),
            linear-gradient(-45deg, transparent 75%, #d97706 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
