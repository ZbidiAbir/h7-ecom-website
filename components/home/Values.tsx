import Image from "next/image";
import {
  Award,
  CheckCircle,
  Sparkles,
  Shield,
  Heart,
  Star,
  Target,
  Leaf,
} from "lucide-react";
import {
  motion,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef, useEffect, useState } from "react";

export default function OurValues() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]));

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left - width / 2) / width);
    mouseY.set((clientY - top - height / 2) / height);
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -45,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: 45,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const values = [
    {
      icon: Award,
      title: "Premium Excellence",
      description: "Selected premium fabrics, built to last generations",
      features: [
        "Luxury Materials",
        "Timeless Craftsmanship",
        "Enduring Quality",
      ],
      gradient: "from-gray-500 to-gray-500",
      particles: 12,
    },
    {
      icon: Shield,
      title: "Authentic Heritage",
      description: "100% original designs with cultural authenticity",
      features: ["Original Designs", "Cultural Integrity", "Proven Legacy"],
      gradient: "from-blue-500 to-cyan-500",
      particles: 8,
    },
    {
      icon: Heart,
      title: "Sustainable Ethics",
      description: "Ethically sourced and environmentally conscious",
      features: ["Eco-Friendly", "Fair Trade", "Sustainable Practices"],
      gradient: "from-emerald-500 to-green-500",
      particles: 16,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden min-h-screen flex items-center">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />

      {/* Animated Particles */}
      <ParticleBackground />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative px-6 md:px-16 py-20 lg:py-28 w-full">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className=" mx-auto grid lg:grid-cols-2 gap-20 "
        >
          {/* Left Content */}
          <div className="space-y-16">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl xl:text-5xl font-bold ">
                  Crafting {""}
                  <span className="  bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 bg-clip-text text-transparent animate-gradient">
                    Legacy Through {""}
                  </span>
                  Excellence
                </h2>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Where timeless craftsmanship meets contemporary elegance. Each
                  piece tells a story of dedication, quality, and authentic
                  heritage that transcends generations.
                </p>
              </div>
            </motion.div>

            {/* Advanced Values Grid */}
            <motion.div variants={itemVariants} className="grid gap-8">
              {values.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Right Content - Advanced 3D Image */}
          <motion.div
            variants={imageVariants}
            className="relative group perspective-1000"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <div className="relative transform-gpu">
              {/* Main Image Container with 3D Effect */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/home/values.png"
                    alt="Craftsmanship and heritage showcase"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    priority
                  />

                  {/* Animated Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                </div>

                {/* Interactive Floating Elements */}
                <InteractiveFloatingElements />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10" />

              {/* Stats Panel with Micro-interactions */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Advanced Value Card Component
const ValueCard = ({ value, index }: { value: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            delay: index * 0.2,
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:border-gray-400/30 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Floating Particles */}
      {Array.from({ length: value.particles }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isHovered
              ? {
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                }
              : {}
          }
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      ))}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-2xl bg-gradient-to-r ${value.gradient} shadow-lg`}
            >
              <value.icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                {value.title}
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </motion.div>
              </h3>
              <p className="text-gray-300 text-lg">{value.description}</p>
            </div>
          </div>

          {/* Animated Stat */}
        </div>
      </div>
    </motion.div>
  );
};

// Interactive Floating Elements for Image
const InteractiveFloatingElements = () => {
  const elements = [
    {
      icon: Award,
      text: "Premium Quality",
      color: "gray",
      position: "top-6 left-6",
    },
    {
      icon: Shield,
      text: "Authentic",
      color: "blue",
      position: "bottom-6 right-6",
    },
    {
      icon: Leaf,
      text: "Eco-Friendly",
      color: "emerald",
      position: "top-1/2 left-1/4",
    },
    {
      icon: Target,
      text: "Precision",
      color: "purple",
      position: "top-1/3 right-8",
    },
  ];

  return (
    <>
      {elements.map((element, index) => (
        <motion.div
          key={element.text}
          className={`absolute ${element.position} bg-black/80 backdrop-blur-lg rounded-2xl p-4 border border-${element.color}-400/30 shadow-2xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5 + index * 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.1,
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <div className="flex items-center gap-2">
            <element.icon className={`w-4 h-4 text-${element.color}-400`} />
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              {element.text}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-400/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          animate={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
