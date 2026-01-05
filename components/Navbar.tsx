import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Instagram, User, LogOut, Settings, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import AuthModal from './AuthModal';
import { useLanguage } from '../lib/languageContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    const handleLanguageClickOutside = (event: MouseEvent) => {
      if (
        showLanguageMenu &&
        languageMenuRef.current &&
        !(event.target as Element).closest('.language-menu')
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleLanguageClickOutside);
    return () => document.removeEventListener('mousedown', handleLanguageClickOutside);
  }, [showLanguageMenu]);

  const navLinks = t.navbar.links;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="font-display font-black text-2xl tracking-tighter italic text-white flex items-center gap-2">
            <span className="text-honda-red text-4xl leading-none">H</span>ONDAUNIT
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="font-sans text-sm uppercase tracking-widest text-gray-300 hover:text-honda-red transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            <div className="relative language-menu" ref={languageMenuRef}>
              <span className="sr-only" id="language-trigger-label">{t.navbar.languageLabel}</span>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={showLanguageMenu}
                aria-labelledby="language-trigger-label"
                onClick={() => setShowLanguageMenu((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm uppercase tracking-wide text-gray-200 hover:border-honda-red/60 transition-colors"
              >
                <span>{languages.find((lang) => lang.code === language)?.label}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right ${
                  showLanguageMenu
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
                role="listbox"
                aria-label="Language options"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm uppercase tracking-wide transition-colors ${
                      language === lang.code
                        ? 'bg-honda-red/20 text-white border-l-2 border-honda-red font-semibold'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                    role="option"
                    aria-selected={language === lang.code}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        language === lang.code ? 'bg-honda-red' : 'bg-white/30'
                      }`}
                    />
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* User Authentication */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                      {user?.role === 'admin' && (
                        <a
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                        >
                          <Settings size={16} />
                          <span>Admin Dashboard</span>
                        </a>
                      )}
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2 bg-honda-red text-white rounded-full hover:bg-red-600 transition-all duration-300 font-medium text-sm"
                >
                  {t.navbar.signIn}
                </button>
              )}
              
              <a 
                href="https://instagram.com/hondaunit" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-honda-red hover:text-white transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white hover:text-honda-red transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 py-8 flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="font-display text-2xl text-white hover:text-honda-red transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="w-full px-6">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded-full border text-xs tracking-wide ${
                      language === lang.code
                        ? 'border-honda-red text-white bg-honda-red/20'
                        : 'border-white/10 text-gray-300 hover:border-honda-red/60'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile Auth */}
            <div className="flex flex-col items-center gap-4 w-full px-6">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-center">
                    <span className="block text-sm text-gray-400">Signed in as</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <a
                      href="/admin"
                      className="w-full py-3 bg-purple-900/50 rounded-lg text-center hover:bg-purple-900/70 transition-colors"
                    >
                      Admin Dashboard
                    </a>
                  )}
                  <a
                    href="/dashboard"
                    className="w-full py-3 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-colors"
                  >
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-900/50 rounded-lg text-center hover:bg-red-900/70 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileOpen(false);
                  }}
                  className="w-full py-3 bg-honda-red rounded-lg text-center hover:bg-red-600 transition-colors font-medium"
                >
                  {t.navbar.signIn}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;