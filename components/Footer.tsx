import React from 'react';
import { useLanguage } from '../lib/languageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-950 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="font-display font-black text-2xl text-white italic">
            <span className="text-honda-red">H</span>ONDAUNIT
          </h2>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest space-y-1">
            <span>{t.footer.rights}</span> <br />
            <a href="https://devmonix.io" target="_blank" className="text-white transition-colors text-xs">
              <span className="text-gray-500">{t.footer.poweredByPrefix} </span>
              <span className="text-honda-red">Dev</span>
              <span className="text-white-500">{t.footer.poweredByName.replace('Dev', '')}</span>
            </a>
          </p>
        </div>

        <div className="flex gap-6">
          <a href="https://www.allseriesdecals.com/" target="_blank" className="text-gray-400 hover:text-white transition-colors text-xs uppercase">
            {t.footer.links.decals}
          </a>
          <a href="https://custombuiltcars.us/" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm uppercase">
            {t.footer.links.customCars}
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm uppercase">
            {t.footer.links.home}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;