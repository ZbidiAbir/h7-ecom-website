"use client";

import { useState, useEffect, useRef } from "react";

interface MadeInTunisiaProps {
  variant?:
    | "default"
    | "minimal"
    | "elegant"
    | "modern"
    | "floating"
    | "gradient"
    | "particles";
  textColor?: string;
  lineColor?: string;
  animation?:
    | "fade"
    | "slide"
    | "typewriter"
    | "pulse"
    | "wave"
    | "glitch"
    | "floating"
    | "morph"
    | "none";
  infiniteAnimation?:
    | "pulse"
    | "wave"
    | "breathing"
    | "float"
    | "rotate"
    | "typewriter"
    | "none";
  delay?: number;
  className?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  speed?: "slow" | "normal" | "fast";
  withParticles?: boolean;
  particleCount?: number;
  typingLoopDelay?: number;
}

const translations = {
  line1: "Proudly made in Tunisia,",
  line2: "where design meets craftsmanship.",
};

const Particle = ({ color, size, left, top, animationDelay }: any) => {
  return (
    <div
      className={`absolute rounded-full ${color} opacity-20`}
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
        animation: `floatParticle 6s ease-in-out ${animationDelay}s infinite`,
      }}
    />
  );
};

const MadeInTunisia = ({
  variant = "default",
  textColor = "text-gray-800",
  lineColor = "bg-gray-800",
  animation = "fade",
  infiniteAnimation = "typewriter",
  delay = 0,
  className = "",
  align = "center",
  size = "md",
  speed = "normal",
  withParticles = false,
  particleCount = 15,
  typingLoopDelay = 3000,
}: MadeInTunisiaProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState({ line1: "", line2: "" });
  const [isTyping, setIsTyping] = useState(true);
  const [currentLoop, setCurrentLoop] = useState(0);
  const particles = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Correction ici

  const speedMultipliers = {
    slow: 1.5,
    normal: 1,
    fast: 0.6,
  };

  const textSizes = {
    sm: { line1: "text-lg", line2: "text-base" },
    md: { line1: "text-2xl", line2: "text-lg" },
    lg: { line1: "text-4xl", line2: "text-2xl" },
    xl: { line1: "text-6xl", line2: "text-4xl" },
  };

  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const infiniteAnimationClasses = {
    pulse: "animate-pulse",
    wave: "animate-wave",
    breathing: "animate-breathing",
    float: "animate-float",
    rotate: "animate-spin",
    typewriter: "typewriter-cursor",
    none: "",
  };

  // Génération des particules
  useEffect(() => {
    if (withParticles) {
      particles.current = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        size: Math.random() * 8 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: lineColor.replace("bg-", "bg-").split(" ")[0],
        delay: Math.random() * 5,
      }));
    }
  }, [withParticles, particleCount, lineColor]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Animation typing infinie
  useEffect(() => {
    if (animation === "typewriter" || infiniteAnimation === "typewriter") {
      startTypingAnimation();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [animation, infiniteAnimation, speed, currentLoop]);

  const startTypingAnimation = () => {
    setIsTyping(true);
    const text = translations;
    let line1Index = 0;
    let line2Index = 0;

    // Reset text
    setDisplayText({ line1: "", line2: "" });

    const typeLine1 = () => {
      if (line1Index <= text.line1.length) {
        setDisplayText((prev) => ({
          ...prev,
          line1: text.line1.substring(0, line1Index),
        }));
        line1Index++;
        typingTimeoutRef.current = setTimeout(
          typeLine1,
          50 * speedMultipliers[speed]
        );
      } else {
        typingTimeoutRef.current = setTimeout(
          typeLine2,
          200 * speedMultipliers[speed]
        );
      }
    };

    const typeLine2 = () => {
      if (line2Index <= text.line2.length) {
        setDisplayText((prev) => ({
          ...prev,
          line2: text.line2.substring(0, line2Index),
        }));
        line2Index++;
        typingTimeoutRef.current = setTimeout(
          typeLine2,
          30 * speedMultipliers[speed]
        );
      } else {
        setIsTyping(false);
        // Délai avant de recommencer
        typingTimeoutRef.current = setTimeout(() => {
          setCurrentLoop((prev) => prev + 1);
        }, typingLoopDelay);
      }
    };

    typeLine1();
  };

  const getAnimationClasses = (
    element: string,
    delayMultiplier: number = 1
  ) => {
    const baseDelay = 1000 * speedMultipliers[speed];

    switch (animation) {
      case "fade":
        return `transition-all duration-700 delay-${delayMultiplier * 300} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`;

      case "slide":
        return `transition-all duration-700 delay-${delayMultiplier * 300} ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`;

      case "wave":
        return `animate-wave delay-${delayMultiplier * 100}`;

      case "glitch":
        return `transition-all duration-300 delay-${delayMultiplier * 200} ${
          isVisible ? "opacity-100 glitch-effect" : "opacity-0"
        }`;

      case "floating":
        return `animate-float delay-${delayMultiplier * 200}`;

      case "morph":
        return `transition-all duration-1000 delay-${delayMultiplier * 300} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`;

      default:
        return "";
    }
  };

  const renderContent = () => {
    const baseContent = (
      <div className={`flex flex-col ${alignClasses[align]} space-y-6`}>
        {/* Ligne horizontale supérieure avec animation infinie */}
        <div
          className={`w-24 h-0.5 ${lineColor} ${getAnimationClasses(
            "line",
            0
          )} ${
            infiniteAnimation !== "none" && infiniteAnimation !== "typewriter"
              ? infiniteAnimationClasses[infiniteAnimation]
              : ""
          }`}
          style={{
            animationDuration: `${3 * speedMultipliers[speed]}s`,
          }}
        ></div>

        {/* Texte principal avec curseur typing */}
        <div className="space-y-2">
          <div className="relative">
            <p
              className={`${
                textSizes[size].line1
              } font-light tracking-wider ${textColor} ${getAnimationClasses(
                "text",
                1
              )} ${
                infiniteAnimation !== "none" &&
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
              style={{
                animationDuration: `${2 * speedMultipliers[speed]}s`,
              }}
            >
              {displayText.line1}
              {(infiniteAnimation === "typewriter" ||
                animation === "typewriter") &&
                isTyping && <span className="typewriter-cursor">|</span>}
            </p>
          </div>
          <div className="relative">
            <p
              className={`${
                textSizes[size].line2
              } font-light tracking-wider ${textColor.replace(
                "800",
                "600"
              )} ${getAnimationClasses("text", 2)} ${
                infiniteAnimation !== "none" &&
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
              style={{
                animationDuration: `${2 * speedMultipliers[speed]}s`,
              }}
            >
              {displayText.line2}
              {(infiniteAnimation === "typewriter" ||
                animation === "typewriter") &&
                isTyping && <span className="typewriter-cursor">|</span>}
            </p>
          </div>
        </div>

        {/* Ligne horizontale inférieure avec animation infinie */}
        <div
          className={`w-36 h-0.5 ${lineColor} ${getAnimationClasses(
            "line",
            3
          )} ${
            infiniteAnimation !== "none" && infiniteAnimation !== "typewriter"
              ? infiniteAnimationClasses[infiniteAnimation]
              : ""
          }`}
          style={{
            animationDuration: `${3 * speedMultipliers[speed]}s`,
          }}
        ></div>
      </div>
    );

    switch (variant) {
      case "minimal":
        return (
          <div className="text-center space-y-4">
            <div className="relative">
              <p
                className={`${textSizes[size].line1} font-light ${textColor} ${
                  infiniteAnimation !== "typewriter"
                    ? infiniteAnimationClasses[infiniteAnimation]
                    : ""
                }`}
              >
                {displayText.line1}
                {infiniteAnimation === "typewriter" && isTyping && (
                  <span className="typewriter-cursor">|</span>
                )}
              </p>
            </div>
            <div className="relative">
              <p
                className={`${
                  textSizes[size].line2
                } font-light ${textColor.replace("800", "600")} ${
                  infiniteAnimation !== "typewriter"
                    ? infiniteAnimationClasses[infiniteAnimation]
                    : ""
                }`}
              >
                {displayText.line2}
                {infiniteAnimation === "typewriter" && isTyping && (
                  <span className="typewriter-cursor">|</span>
                )}
              </p>
            </div>
          </div>
        );

      case "elegant":
        return (
          <div className={`flex flex-col ${alignClasses[align]} space-y-8`}>
            <div
              className={`w-32 h-px ${lineColor} bg-gradient-to-r from-transparent via-current to-transparent ${getAnimationClasses(
                "line",
                0
              )} ${
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
            ></div>
            <div className="space-y-3">
              <div className="relative">
                <p
                  className={`${
                    textSizes[size].line1
                  } font-serif italic font-light tracking-wide ${textColor} ${getAnimationClasses(
                    "text",
                    1
                  )} ${
                    infiniteAnimation !== "typewriter"
                      ? infiniteAnimationClasses[infiniteAnimation]
                      : ""
                  }`}
                >
                  {displayText.line1}
                  {infiniteAnimation === "typewriter" && isTyping && (
                    <span className="typewriter-cursor">|</span>
                  )}
                </p>
              </div>
              <div className="relative">
                <p
                  className={`${
                    textSizes[size].line2
                  } font-serif font-light tracking-wide ${textColor.replace(
                    "800",
                    "600"
                  )} ${getAnimationClasses("text", 2)} ${
                    infiniteAnimation !== "typewriter"
                      ? infiniteAnimationClasses[infiniteAnimation]
                      : ""
                  }`}
                >
                  {displayText.line2}
                  {infiniteAnimation === "typewriter" && isTyping && (
                    <span className="typewriter-cursor">|</span>
                  )}
                </p>
              </div>
            </div>
            <div
              className={`w-32 h-px ${lineColor} bg-gradient-to-r from-transparent via-current to-transparent ${getAnimationClasses(
                "line",
                3
              )} ${
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
            ></div>
          </div>
        );

      case "modern":
        return (
          <div className={`flex items-center space-x-8 ${alignClasses[align]}`}>
            <div
              className={`flex-1 h-px ${lineColor} ${getAnimationClasses(
                "line",
                0
              )} ${
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
            ></div>
            <div className="text-center space-y-2 flex-shrink-0">
              <div className="relative">
                <p
                  className={`${
                    textSizes[size].line1
                  } font-medium tracking-tight ${textColor} ${getAnimationClasses(
                    "text",
                    1
                  )} ${
                    infiniteAnimation !== "typewriter"
                      ? infiniteAnimationClasses[infiniteAnimation]
                      : ""
                  }`}
                >
                  {displayText.line1}
                  {infiniteAnimation === "typewriter" && isTyping && (
                    <span className="typewriter-cursor">|</span>
                  )}
                </p>
              </div>
              <div className="relative">
                <p
                  className={`${
                    textSizes[size].line2
                  } font-light tracking-tight ${textColor.replace(
                    "800",
                    "600"
                  )} ${getAnimationClasses("text", 2)} ${
                    infiniteAnimation !== "typewriter"
                      ? infiniteAnimationClasses[infiniteAnimation]
                      : ""
                  }`}
                >
                  {displayText.line2}
                  {infiniteAnimation === "typewriter" && isTyping && (
                    <span className="typewriter-cursor">|</span>
                  )}
                </p>
              </div>
            </div>
            <div
              className={`flex-1 h-px ${lineColor} ${getAnimationClasses(
                "line",
                3
              )} ${
                infiniteAnimation !== "typewriter"
                  ? infiniteAnimationClasses[infiniteAnimation]
                  : ""
              }`}
            ></div>
          </div>
        );

      case "particles":
        return (
          <div className="relative">
            {withParticles &&
              particles.current.map((particle) => (
                <Particle
                  key={particle.id}
                  color={particle.color}
                  size={particle.size}
                  left={particle.left}
                  top={particle.top}
                  animationDelay={particle.delay}
                />
              ))}
            {baseContent}
          </div>
        );

      default:
        return baseContent;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center py-8 bg-white ${className}`}
    >
      <style jsx>{`
        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes breathing {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .glitch-effect {
          animation: glitch 0.3s infinite;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .typewriter-cursor {
          display: inline-block;
          background-color: currentColor;
          margin-left: 2px;
          animation: blink 1s infinite;
          width: 2px;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .animate-breathing {
          animation: breathing 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>

      <div className="w-full relative">{renderContent()}</div>
    </div>
  );
};

export default MadeInTunisia;
