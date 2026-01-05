import React, { useState, useEffect } from 'react';
import { Camera, ArrowUpRight, X, User, Calendar, Aperture, MapPin } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  className: string; // Tailwind classes for grid span and height
  description: string;
  photographer: string;
  date: string;
  specs: string;
  location: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // Row 1
  {
    id: 1,
    title: "The Azure Run",
    category: "Professionals",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547880/gallery1_dxuhkv.jpg",
    className: "md:col-span-8 h-64 md:h-[600px]",
    description: "Capturing the raw essence of coastal driving. The chassis feels at home on these winding roads, where the ocean breeze meets high-revving engines. A perfect harmony of machine and nature.",
    photographer: "@ibcej8",
    date: "MAR 29, 2025",
    specs: "Sony A7III, 35mm f/1.4",
    location: "Pacific Coast Highway"
  },
  {
    id: 2,
    title: "Canyon Carver",
    category: "Professionals",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547875/gallery2_jfs2pe.jpg",
    className: "md:col-span-4 h-64 md:h-[600px]",
    description: "Golden hour perfection in the canyons. They slicing through corners like a surgical instrument, proving why it remains the undisputed king of Japanese supercars.",
    photographer: "@faygo_diego",
    date: "DEC 16, 2025",
    specs: "Canon R5, 85mm f/1.2",
    location: "Coachella CA"
  },
  
  // Row 2
  {
    id: 3,
    title: "Corner View",
    category: "Studio Shots",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547883/gallery3_zx6kdq.jpg",
    className: "md:col-span-4 h-64 md:h-[450px]",
    description: "Where the magic happens. A driver-focused interior that screams performance and heritage. Every gauge, every switch is designed for one purpose: the drive.",
    photographer: "@faygo_diego",
    date: "NOV 17, 2025",
    specs: "Fuji XT-4, 16mm f/2.8",
    location: "Palm Desert, CA"
  },
  {
    id: 4,
    title: "Urban Legend",
    category: "Street",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547877/gallery4_jpi5bl.jpg",
    className: "md:col-span-4 h-64 md:h-[450px]",
    description: "Neon lights reflecting off pristine paintwork in the heart of the city. This build turns heads at every intersection.",
    photographer: "@jose_dc4_",
    date: "Jul 29, 2025",
    specs: "Nikon Z6, 50mm f/1.8",
    location: "California, USA"
  },
  {
    id: 5,
    title: "Track Weapons",
    category: "Performance",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547884/gallery5_cwxrnb.jpg",
    className: "md:col-span-4 h-64 md:h-[450px]",
    description: "Pre-grid focus. The smell of high-octane fuel and burning rubber hangs in the air as these machines prepare to attack the circuit.",
    photographer: "@itsah.me.mario",
    date: "AUG 03, 2025",
    specs: "Sony A1, 70-200mm f/2.8",
    location: "California, USA"
  },

  // Row 3
  {
    id: 6,
    title: "Street Sweeper",
    category: "Art",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547876/gallery6_kzvtdj.jpg",
    className: "md:col-span-5 h-64 md:h-[550px]",
    description: "A sleek Honda Integra Type R slicing through city streets at dusk, its aggressive stance and aerodynamic body capturing the spirit of urban performance.",
    photographer: "@gen6cide",
    date: "MAY 28, 2025",
    specs: "Leica Q2, 28mm Summilux",
    location: "Palm Desert, CA"
  },
  {
    id: 7,
    title: "Sunset Drift",
    category: "Action",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547885/gallery7_j2p3uy.jpg",
    className: "md:col-span-7 h-64 md:h-[550px]",
    description: "Sideways action as the sun dips below the horizon. Controlled chaos at its finest, capturing the moment of perfect counter-steer.",
    photographer: "@retro_truckr",
    date: "DEC 31, 2024",
    specs: "Canon 1DX III, 400mm f/2.8",
    location: "Tony's Donut House, BP"
  },

  // Row 4
  {
    id: 8,
    title: "Details Matter",
    category: "Macro",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547886/gallery8_rhcdrw.jpg",
    className: "md:col-span-4 h-64 md:h-[350px]",
    description: "It's the little things that make a build legendary. Custom titanium hardware and carbon fiber weave in perfect alignment.",
    photographer: "@mamas298",
    date: "FEB 16, 2025",
    specs: "Sony A7RIV, 90mm Macro",
    location: "Tony's Donut House, BP"
  },
  {
    id: 9,
    title: "Night Runner",
    category: "Vibes",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547886/gallery9_yj2wyv.jpg",
    className: "md:col-span-4 h-64 md:h-[350px]",
    description: "Cruising the expressway under the sodium lights. The calm before the storm.",
    photographer: "@ej8junior",
    date: "MAR 12, 2024",
    specs: "Fuji GFX100, 45mm f/2.8",
    location: "C1 Loop"
  },
  {
    id: 10,
    title: "Underground",
    category: "Culture",
    image: "https://res.cloudinary.com/dftdlhjl6/image/upload/v1766547886/gallery10_z6mtsi.jpg",
    className: "md:col-span-4 h-64 md:h-[350px]",
    description: "Meeting up in the depths of the city. No invites, just word of mouth. This is where the real culture lives.",
    photographer: "@dc5zebi",
    date: "SEP 28, 2023",
    specs: "Canon AE-1, 35mm Film",
    location: "Lower Level 3"
  }
];

const Gallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedItem]);

  return (
    <section id="gallery" className="bg-black relative">
       {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50 pointer-events-none" />
      
      <div className="w-full px-2 py-24 relative z-10">
        <div className="max-w-7xl mx-auto mb-12 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end">
                <div>
                    <h3 className="text-honda-red font-bold tracking-widest uppercase mb-2">{t.gallery.eyebrow}</h3>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white">
                        {t.gallery.titleStart.toUpperCase()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.gallery.titleAccent.toUpperCase()}</span>
                    </h2>
                </div>
                <div className="hidden md:flex items-center gap-4">
                     <p className="text-gray-400 text-sm tracking-widest uppercase">{t.gallery.subtitle}</p>
                     <div className="w-16 h-1 bg-honda-red"></div>
                </div>
            </div>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {GALLERY_ITEMS.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className={`group relative overflow-hidden cursor-pointer ${item.className}`}
                >
                    {/* Background Image */}
                    <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

                    {/* Content on Hover */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                             <span className="text-honda-red text-xs font-bold uppercase tracking-widest mb-2 block">
                                {item.category}
                             </span>
                             <div className="flex justify-between items-end">
                                <h3 className="text-3xl font-display font-bold text-white leading-none">
                                    {item.title}
                                </h3>
                                <ArrowUpRight className="text-white" size={24} />
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        
      </div>

      {/* Image Modal */}
      {selectedItem && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
            onClick={() => setSelectedItem(null)}
        >
            <div 
                className="relative w-full max-w-7xl h-[90vh] bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-honda-red border border-white/10 rounded-full text-white transition-all duration-300 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Image Side */}
                <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-black flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none md:hidden" />
                    <img 
                        src={selectedItem.image} 
                        alt={selectedItem.title} 
                        className="w-full h-full object-cover md:object-contain"
                    />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/3 h-1/2 md:h-full p-8 md:p-12 flex flex-col bg-zinc-950/90 overflow-y-auto custom-scrollbar border-l border-white/5">
                    <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-honda-red/10 text-honda-red text-xs font-bold uppercase tracking-widest mb-6 rounded-full border border-honda-red/20">
                            {selectedItem.category}
                        </span>
                        <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-[0.9]">
                            {selectedItem.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-8 border-l-2 border-honda-red pl-4 text-sm md:text-base">
                            {selectedItem.description}
                        </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <div className="flex items-start gap-4 text-gray-300 group">
                            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-honda-red group-hover:text-white transition-colors">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Photographer</p>
                                <p className="font-display font-bold text-white tracking-wide">{selectedItem.photographer}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 text-gray-300 group">
                             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-honda-red group-hover:text-white transition-colors">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Date Captured</p>
                                <p className="font-display font-bold text-white tracking-wide">{selectedItem.date}</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-4 text-gray-300 group">
                             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-honda-red group-hover:text-white transition-colors">
                                <Aperture size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Camera Specs</p>
                                <p className="font-display font-bold text-white tracking-wide">{selectedItem.specs}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 text-gray-300 group">
                             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-honda-red group-hover:text-white transition-colors">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Location</p>
                                <p className="font-display font-bold text-white tracking-wide">{selectedItem.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;