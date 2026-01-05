import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

const HERO_VIDEOS = [
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766545879/bg-vd1_ql5slo.mp4", // Night city drive
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766555191/bg-vd2_ngcawr.mp4", // Fast tunnel lights
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546073/bg-vd10_yxf9em.mp4", // dan ma special
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766545905/bg-vd3_otaadc.mp4", // Neon vibes
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546117/bg-vd5_le4exr.mp4", // Additional video
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546131/bg-vd6_y70rcx.mp4", // Extra video
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546066/bg-vd7_xutyag.mp4", // Another video
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546066/bg-vd7_xutyag.mp4", // More variety
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766555392/bg-vd8_lyztmw.mp4", // Additional variety
  "https://res.cloudinary.com/dftdlhjl6/video/upload/v1766546005/bg-vd9_nbblcc.mp4", // Final variety
];

const Hero: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  }, [currentVideoIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark Overlay */}
        
        {/* VHS/Grain Overlay Effect */}
        <video
          ref={videoRef}
          key={HERO_VIDEOS[currentVideoIndex]} // Force re-render on change
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover scale-105" // Slight scale to prevent edge bleeding
        >
          <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 mix-blend-screen">
        <h2 className="font-sans text-honda-red tracking-[0.3em] text-sm md:text-lg uppercase font-bold mb-4 animate-fade-in-up drop-shadow-[0_0_10px_rgba(216,0,13,0.8)]">
          {t.hero.tagline}
        </h2>
        <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white mb-6 leading-none text-glow drop-shadow-2xl">
          {t.hero.titleLineOne.toUpperCase()} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 animate-pulse-fast">
            {t.hero.titleAccent.toUpperCase()}
          </span>
        </h1>
        <p className="font-sans text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
          {t.hero.description}
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#gallery"
            className="px-8 py-4 bg-honda-red text-white font-display font-bold uppercase tracking-wider hover:bg-red-700 transition-all duration-300 clip-path-slant hover:scale-105 shadow-[0_0_20px_rgba(216,0,13,0.4)]"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
          >
            {t.hero.primaryCta}
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-transparent border border-white/30 hover:border-white text-white font-display font-bold uppercase tracking-wider transition-all duration-300 clip-path-slant hover:bg-white/5 backdrop-blur-sm"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
          >
            {t.hero.secondaryCta}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="text-white/50 w-10 h-10 hover:text-honda-red transition-colors" />
      </div>
    </div>
  );
};

export default Hero;