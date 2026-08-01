import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Featured from './components/Featured';
import Profile from './components/Profile';
import Contact from './components/Contact';

function App() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  // Close menu on ESC and lock body scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '#gallery', en: 'Gallery', es: 'Galería' },
    { href: '#featured', en: 'Projects', es: 'Proyectos' },
    { href: '#about', en: 'Profile', es: 'Perfil' },
    { href: '#contact', en: 'Contact', es: 'Contacto' },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] font-sans selection:bg-[#e63946] selection:text-white">
      {/* Skip to content */}
      <a 
        href="#gallery" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-[#e63946] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-mono"
      >
        {lang === 'en' ? 'Skip to content' : 'Ir al contenido'}
      </a>

      {/* Navegación Fija con Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/5">
        <a href="#" className="text-sm font-bold tracking-widest uppercase">
          Santiago Narváez
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest items-center">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#e63946] transition-colors">
              {lang === 'en' ? link.en : link.es}
            </a>
          ))}
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <button onClick={toggleLang} className="flex items-center gap-2 hover:text-[#e63946] transition-colors font-mono font-bold cursor-pointer">
            <span className={lang === 'en' ? 'text-white' : 'text-zinc-500'}>EN</span>
            <span className="text-zinc-700">|</span>
            <span className={lang === 'es' ? 'text-white' : 'text-zinc-500'}>ES</span>
          </button>
        </div>

        {/* Mobile Nav Controls */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleLang} className="text-sm font-mono font-bold cursor-pointer">
            {lang.toUpperCase()}
          </button>
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-sm uppercase tracking-widest cursor-pointer"
          >
            {menuOpen 
              ? (lang === 'en' ? 'Close' : 'Cerrar')
              : (lang === 'en' ? 'Menu' : 'Menú')
            }
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/5"
            >
              <div className="flex flex-col px-6 py-8 gap-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="text-2xl font-medium tracking-wide hover:text-[#e63946] transition-colors"
                  >
                    {lang === 'en' ? link.en : link.es}
                  </motion.a>
                ))}
                <div className="h-px bg-white/10 my-2"></div>
                <button 
                  onClick={toggleLang} 
                  className="flex items-center gap-3 text-sm font-mono font-bold cursor-pointer self-start"
                >
                  <span className={lang === 'en' ? 'text-white' : 'text-zinc-500'}>EN</span>
                  <span className="text-zinc-700">|</span>
                  <span className={lang === 'es' ? 'text-white' : 'text-zinc-500'}>ES</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        <Hero lang={lang} />
        <Gallery lang={lang} />
        <Featured lang={lang} />
        <Profile lang={lang} />
        <Contact lang={lang} />
      </main>

      <footer className="py-12 text-center text-xs font-mono tracking-widest text-gray-500 border-t border-zinc-900 mt-12 uppercase relative z-10">
        <p>© {new Date().getFullYear()} Santiago Narváez. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
        <a href="https://sunsetlabs.dev" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-zinc-500 hover:text-zinc-300 transition-colors group">
          <span className="text-[#e63946] group-hover:text-[#f3f4f6] transition-colors">{`{ `}</span>
          Sunset Labs
          <span className="text-[#e63946] group-hover:text-[#f3f4f6] transition-colors">{` }`}</span> 
          - {lang === 'en' ? 'Web Development from Margarita Island 🏝️' : 'Desarrollo Web desde Isla de Margarita 🏝️'}
        </a>
      </footer>
    </div>
  );
}

export default App;
