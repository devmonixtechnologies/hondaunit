import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Globe, Clock, Users } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '../lib/languageContext';
import { apiService, Branch } from '../services/api';

const WorldMap: React.FC = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    apiService
      .getBranches()
      .then((data) => {
        if (isMounted) {
          setLocations(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load branches:', err);
          setError('Failed to load branches. Showing map without markers.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    try {
      // Initialize Map
      const map = L.map(mapContainerRef.current, {
        center: [25, 10],
        zoom: 2,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false, 
        boxZoom: false,
        keyboard: false,
        touchZoom: false
      });

      // Dark Matter Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      map.on('click', () => setActiveLocation(null));
    } catch (err) {
      console.error("Failed to initialize map:", err);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {
        console.error("Map cleanup error", e);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute w-full h-full bg-honda-red rounded-full opacity-75 animate-ping"></div>
            <div class="relative w-2 h-2 bg-honda-red rounded-full shadow-[0_0_15px_#D8000D] transition-transform duration-300 hover:scale-150"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(
        markersLayerRef.current!,
      );

      marker.on('mouseover', () => {
        if (!mapInstanceRef.current) return;
        const point = mapInstanceRef.current.latLngToContainerPoint([
          loc.lat,
          loc.lng,
        ]);
        setTooltipPos({ x: point.x, y: point.y });
        setActiveLocation(loc._id);
      });

      marker.on('mouseout', () => {
        setActiveLocation(null);
      });
    });
  }, [locations]);

  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && activeLocation) {
        const loc = locations.find((l) => l._id === activeLocation);
        if (loc) {
          const point = mapInstanceRef.current.latLngToContainerPoint([
            loc.lat,
            loc.lng,
          ]);
          setTooltipPos({ x: point.x, y: point.y });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeLocation, locations]);

  const decorativeStats = useMemo(() => {
    if (locations.length === 0) {
      return {
        lat: 'Lat: 00.0000°',
        status: 'System Status: Standby',
        nodes: 'Active Nodes: 0',
        lng: 'Long: 00.0000°',
      };
    }
    const primary = locations[0];
    return {
      lat: `Lat: ${primary.lat.toFixed(4)}°`,
      status: 'System Status: Online',
      nodes: `Active Nodes: ${locations.length}`,
      lng: `Long: ${primary.lng.toFixed(4)}°`,
    };
  }, [locations]);

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-honda-red font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              {t.worldMap.eyebrow}
            </h2>
            <h3 className="text-5xl font-display font-black text-white">
              {t.worldMap.headline.toUpperCase()}<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.worldMap.headlineAccent.toUpperCase()}</span>
            </h3>
          </div>
          <p className="text-gray-400 max-w-md text-right hidden md:block mt-4 md:mt-0">
            {t.worldMap.description}
          </p>
        </div>

        {/* Map Container Wrapper */}
        <div className="relative w-full aspect-[1.8/1] bg-zinc-900/30 rounded-xl border border-white/10 shadow-2xl overflow-hidden group">
          
          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} id="map" className="w-full h-full z-0 mix-blend-screen opacity-80" />

          {/* Grid Overlay (Visual candy on top of map) */}
          <div className="absolute inset-0 z-10 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>

          {/* React Tooltip (Rendered outside Leaflet for easier styling) */}
          {activeLocation && (
              (() => {
                  const loc = locations.find(l => l._id === activeLocation);
                  if (!loc) return null;
                  return (
                    <div 
                        className="absolute w-72 bg-zinc-950/95 backdrop-blur-xl border border-white/20 rounded-lg p-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 origin-bottom z-50 pointer-events-none animate-in fade-in zoom-in-95"
                        style={{ 
                            left: tooltipPos.x, 
                            top: tooltipPos.y, 
                            transform: 'translate(-50%, -100%) translateY(-20px)' 
                        }}
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-20 w-full bg-gradient-to-r from-zinc-900 to-honda-red/20 rounded-t-lg relative overflow-hidden flex items-end p-4 border-b border-white/10">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            
                            <h4 className="font-display font-bold text-white text-xl leading-none shadow-black drop-shadow-md relative z-10">{loc.name}</h4>
                        </div>

                        {/* Content */}
                        <div className="p-5 relative">
                            {/* Connecting Triangle */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r border-b border-white/20 transform rotate-45"></div>

                            <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                                {loc.description}
                            </p>

                            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500 font-bold bg-white/5 p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Est. {loc.est}</span>
                                </div>
                                <div className="w-px h-3 bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} />
                                    <span>{loc.members}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  );
              })()
          )}

          {/* Scanning Line Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-honda-red/10 to-transparent h-[10%] w-full animate-[scan_4s_linear_infinite] pointer-events-none z-20" />
        </div>
        
        {/* Decorative Grid Lines */}
        <div className="hidden md:flex justify-between text-[10px] text-gray-600 font-mono mt-2 uppercase tracking-widest opacity-50">
            <span>{decorativeStats.lat}</span>
            <span>{decorativeStats.status}</span>
            <span>{decorativeStats.nodes}</span>
            <span>{decorativeStats.lng}</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
        /* Custom DivIcon Style reset */
        .custom-pin {
            background: transparent;
            border: none;
        }
      `}</style>
    </section>
  );
};

export default WorldMap;