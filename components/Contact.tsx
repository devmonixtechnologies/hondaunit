import React, { useState } from 'react';
import { CheckCircle, Instagram, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { submitContactForm } from '../services/contactService';
import { useLanguage } from '../lib/languageContext';

const MIN_MESSAGE_LENGTH = 10;

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    handle: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { t } = useLanguage();
  const trimmedMessageLength = formState.message.trim().length;
  const isMessageTooShort = trimmedMessageLength < MIN_MESSAGE_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isMessageTooShort) {
      setStatus('error');
      setFeedbackMessage(t.contact.form.messageTooShort(MIN_MESSAGE_LENGTH));
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
      }, 4000);
      return;
    }

    setStatus('submitting');
    setFeedbackMessage('');

    try {
      await submitContactForm(formState);
      setStatus('success');
      setFeedbackMessage(t.contact.form.successMessage);
      setFormState({ name: '', email: '', handle: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
      setFeedbackMessage(t.contact.form.genericError);
    } finally {
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
      }, 4000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 bg-zinc-900 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-honda-red to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-honda-red font-bold tracking-widest uppercase mb-4">{t.contact.eyebrow}</h2>
            <h3 className="text-5xl md:text-6xl font-display font-black text-white mb-6 leading-none">
              {t.contact.headlineStart.toUpperCase()} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.contact.headlineAccent.toUpperCase()}</span>
            </h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed whitespace-pre-line">
              {t.contact.description}
            </p>
            
            <div className="flex flex-col gap-6">
              <a href={`mailto:${t.contact.emailValue}`} className="flex items-center gap-4 text-white hover:text-honda-red transition-colors group">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-honda-red transition-colors">
                  <Mail size={20} />
                </div>
                <span className="font-display text-lg tracking-wider">{t.contact.emailValue}</span>
              </a>
              <a href="https://instagram.com/hondaunit" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white hover:text-honda-red transition-colors group">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-honda-red transition-colors">
                  <Instagram size={20} />
                </div>
                <span className="font-display text-lg tracking-wider">{t.contact.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-black border border-white/10 p-8 md:p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-honda-red/10 blur-3xl rounded-full pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.contact.form.nameLabel}</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-honda-red transition-colors rounded-none placeholder-zinc-700"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="handle" className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.contact.form.handleLabel}</label>
                  <input 
                    type="text" 
                    id="handle" 
                    name="handle" 
                    value={formState.handle}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-honda-red transition-colors rounded-none placeholder-zinc-700"
                    placeholder={t.contact.form.handlePlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.contact.form.emailLabel}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-honda-red transition-colors rounded-none placeholder-zinc-700"
                  placeholder={t.contact.form.emailPlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.contact.form.messageLabel}</label>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  <span>{t.contact.form.messageMinNote(MIN_MESSAGE_LENGTH)}</span>
                  <span className={trimmedMessageLength ? (isMessageTooShort ? 'text-red-400' : 'text-green-400') : ''}>
                    {trimmedMessageLength}/{MIN_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-honda-red transition-colors rounded-none resize-none placeholder-zinc-700"
                  placeholder={t.contact.form.messagePlaceholder}
                />
                {formState.message && isMessageTooShort && (
                  <p className="text-xs text-red-400">{t.contact.form.messageTooShort(MIN_MESSAGE_LENGTH)}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting' || isMessageTooShort}
                className={`w-full py-4 font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 text-white ${
                    status === 'success'
                      ? 'bg-green-600'
                      : status === 'error'
                        ? 'bg-red-700'
                        : 'bg-honda-red hover:bg-red-700'
                }`}
                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}
              >
                {status === 'idle' && <>{t.contact.form.submitIdle} <ArrowRight size={18} /></>}
                {status === 'submitting' && t.contact.form.submitSubmitting}
                {status === 'success' && <>{t.contact.form.submitSuccess} <CheckCircle size={18} /></>}
                {status === 'error' && <>{t.contact.form.submitError} <AlertTriangle size={18} /></>}
              </button>

              {feedbackMessage && (
                <p className={`text-sm tracking-wide ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedbackMessage}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;