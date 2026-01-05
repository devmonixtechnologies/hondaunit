import React from 'react';
import { Users, Wrench, Trophy } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  const icons = [Users, Wrench, Trophy];

  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-honda-red font-bold tracking-widest uppercase mb-4">{t.about.eyebrow}</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              {t.about.headlineStart.toUpperCase()} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.about.headlineAccent.toUpperCase()}</span>
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {t.about.body}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {t.about.features.map((feature, idx) => {
                const Icon = icons[idx];
                return (
                  <div key={feature.title} className="bg-white/5 p-6 border border-white/5 hover:border-honda-red/50 transition-colors duration-300">
                    <div className="mb-4">{Icon && <Icon className="w-8 h-8 text-honda-red" />}</div>
                    <h4 className="font-display text-white text-lg font-bold mb-2">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
             <div className="absolute -inset-4 bg-honda-red/20 blur-3xl rounded-full"></div>
            <img 
                src="https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547875/engine-bay_fzadph.jpg" 
                alt="Honda Engine Bay" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 border-4 border-white/10 relative z-10"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
            />
            {/* Overlay Text */}
            <div className="absolute bottom-10 right-10 z-20 text-right hidden md:block">
                <p className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-t from-white/10 to-white/60">
                    VTEC
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;