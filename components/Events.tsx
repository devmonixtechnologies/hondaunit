import React, { useMemo, useState } from 'react';
import { Calendar, MapPin, ArrowRight, CheckCircle2, X } from 'lucide-react';

import { apiService, PublicEvent } from '../services/api';
import { useLanguage } from '../lib/languageContext';
import { SupportedLanguage } from '../lib/i18n';

const localeMap: Record<SupportedLanguage, string> = {
  en: 'en-US',
  es: 'es-ES',
  ja: 'ja-JP',
  fr: 'fr-FR',
  el: 'el-GR'
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const { t, language } = useLanguage();
  const locale = useMemo(() => localeMap[language] || 'en-US', [language]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getPublicEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleRsvp = (id: string) => {
    setRsvpedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openEventDetails = (event: PublicEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <section id="events" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-honda-red font-bold tracking-widest uppercase mb-4">{t.events.eyebrow}</h2>
          <h3 className="text-5xl font-display font-black text-white uppercase">
            {t.events.headlineStart}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              {t.events.headlineAccent}
            </span>
          </h3>
        </div>

        <div className="flex flex-col gap-6">
          {error && (
            <div className="text-red-400 text-center">{t.events.errorFallback}</div>
          )}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-32 bg-zinc-900/50 animate-pulse rounded-xl border border-white/5" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-gray-400 text-center">{t.events.empty}</p>
          ) : (
          events.map((event) => {
            const isRsvped = rsvpedEvents.has(event._id);
            
            return (
              <div key={event._id} className="group relative flex flex-col md:flex-row items-center bg-zinc-900/50 border border-white/5 overflow-hidden hover:border-honda-red transition-all duration-300">
                {/* Image Overlay Background for visual interest */}
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <img src={event.coverImage ?? 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80'} className="w-full h-full object-cover" alt="" />
                </div>

                {/* Date Box */}
                <div className="w-full md:w-32 bg-honda-red/10 p-6 flex flex-col items-center justify-center border-r border-white/5 group-hover:bg-honda-red group-hover:text-white transition-colors duration-300 z-10">
                  <span className="font-display text-3xl font-bold">{new Date(event.startDate).toLocaleString(locale, { month: 'short' }).toUpperCase()}</span>
                  <span className="font-sans text-sm font-bold">{new Date(event.startDate).getDate()}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 z-10 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                  <div>
                    <h4 className="font-display text-2xl text-white mb-2">{event.title}</h4>
                    <div className="flex items-center text-gray-400 gap-2 text-sm">
                      <MapPin size={16} />
                      {event.location || t.events.toBeAnnounced}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openEventDetails(event)}
                    className={`px-6 py-3 border font-bold uppercase text-sm tracking-wider flex items-center gap-2 transition-all duration-300 ${
                        isRsvped 
                        ? 'bg-green-600 border-green-600 text-white hover:bg-green-700' 
                        : 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
                    }`}
                  >
                    {isRsvped ? (
                        <>
                          {t.events.buttonRsvped}
                          <CheckCircle2 size={16} />
                        </>
                    ) : (
                        <>
                          {t.events.buttonDefault}
                          <ArrowRight size={16} />
                        </>
                    )}
                  </button>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <p className="text-sm uppercase tracking-wide text-honda-red">{t.events.modalTitle}</p>
                <h3 className="text-2xl font-display text-white">{selectedEvent.title}</h3>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {selectedEvent.coverImage && (
              <img
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-6 space-y-4 text-gray-300">
              <div className="flex items-center gap-3 text-white text-lg">
                <Calendar size={18} />
                <div>
                  <p>{new Date(selectedEvent.startDate).toLocaleString(locale)}</p>
                  {selectedEvent.endDate && (
                    <p className="text-sm text-gray-400">
                      {t.events.modalEndsLabel}: {new Date(selectedEvent.endDate).toLocaleString(locale)}
                    </p>
                  )}
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.description && (
                <p className="leading-relaxed text-gray-200">
                  {selectedEvent.description}
                </p>
              )}

              
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;