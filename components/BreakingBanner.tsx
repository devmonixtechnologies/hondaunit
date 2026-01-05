import React from 'react';
import { useLanguage } from '../lib/languageContext';

const BreakingBanner: React.FC = () => {
  const { t } = useLanguage();
  const item = `${t.breakingBanner.text}  `;
  const items = Array(12).fill(item);

  return (
    <div className="w-full bg-honda-red border-y-4 border-black overflow-hidden relative z-30 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        <div className="flex shrink-0">
          {items.map((text, i) => (
            <span key={`1-${i}`} className="text-black font-display font-black text-3xl md:text-5xl italic tracking-tighter mx-4 select-none">
              {text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {items.map((text, i) => (
            <span key={`2-${i}`} className="text-black font-display font-black text-3xl md:text-5xl italic tracking-tighter mx-4 select-none">
              {text}
            </span>
          ))}
        </div>
      </div>
      
      {/* Vignette effect on sides */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-honda-red to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-honda-red to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default BreakingBanner;