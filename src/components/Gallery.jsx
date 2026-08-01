import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import portfolioData from '../data/portfolio.json';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Gallery({ lang = 'en' }) {
  const { width } = useWindowSize();
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Calcular número de columnas
  let cols = 3;
  if (width < 768) cols = 1;
  else if (width < 1024) cols = 2;

  // Filtrar obras
  const filteredData = portfolioData.filter(item => ![
    "Schrödinger's Bakeneko", 
    "A Kind of Weather", 
    "Neural Impulse Made Visible", 
    "To Exhale the Soul",
    "The Specimen in Repose",
    "The Epidermal Archive",
    "An Unconvincing Escape",
    "The Committee for Mirth",
    "A Magnificent Rebellion",
    "The Ayahuasca Circuit",
    "A Self-Portrait as a Conflagration"
  ].includes(item.title));

  // Distribuir equitativamente en columnas lógicas (JS Masonry perfecto)
  const columns = Array.from({ length: cols }, () => []);
  const colHeights = Array(cols).fill(0);

  filteredData.forEach((item) => {
    const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
    columns[shortestColIndex].push(item);
    
    // Altura calculada:
    let aspect = item.aspectRatio || 1;
    if (aspect > 1.1) {
      aspect = 6/5; 
    }
    colHeights[shortestColIndex] += (1 / aspect);
  });

  // Manejador de teclado para el Lightbox
  const handleKeyDown = useCallback((e) => {
    if (!selectedImage) return;
    
    const currentIndex = filteredData.findIndex(item => item.id === selectedImage.id);
    
    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % filteredData.length;
      setSelectedImage(filteredData[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
      setSelectedImage(filteredData[prevIndex]);
    }
  }, [selectedImage, filteredData]);

  // Bloquear scroll de la página cuando el modal está abierto
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, selectedImage]);

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-zinc-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 md:mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          {lang === 'en' ? 'Selected Works' : 'Obras Selectas'}
        </h2>
        <p className="text-gray-400 max-w-[60ch] text-lg leading-relaxed">
          {lang === 'en' 
            ? "Fictional portraits, impossible landscapes and visual allegories."
            : "Retratos ficticios, paisajes imposibles y alegorías visuales."}
        </p>
      </motion.div>

      <div className="flex gap-8 items-start">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-8">
            {column.map((item, i) => {
              const isHorizontal = item.aspectRatio > 1.1;
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group overflow-hidden bg-zinc-900 rounded-sm w-full cursor-pointer"
                  style={{ aspectRatio: isHorizontal ? '6/5' : 'auto' }}
                  onClick={() => setSelectedImage(item)}
                >
                  <img 
                    src={`/${item.image}`} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[#e63946] text-[10px] font-mono uppercase tracking-widest mb-1 block">{item.category}</span>
                      <h3 className="text-lg font-bold mb-2">{lang === 'en' ? item.title : (item.titleEs || item.title)}</h3>
                      {/* Limitamos el texto a 3 líneas porque ahora tienen el lightbox para leerlo completo */}
                      <p className="text-[11px] md:text-xs text-gray-300 leading-relaxed font-mono line-clamp-3">
                        {lang === 'en' ? item.descriptionEn : item.descriptionEs}
                      </p>
                      <span className="text-[#e63946] text-[10px] font-bold tracking-[0.2em] uppercase mt-4 block opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                        {lang === 'en' ? '+ Click to view' : '+ Ver obra'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            {/* Controles: Cerrar */}
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-50 p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Controles: Navegación Izquierda */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-50 p-4 hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredData.findIndex(item => item.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
                setSelectedImage(filteredData[prevIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            
            {/* Controles: Navegación Derecha */}
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-50 p-4 hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredData.findIndex(item => item.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % filteredData.length;
                setSelectedImage(filteredData[nextIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            {/* Contenido Modal */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[95vw] 2xl:max-w-[1800px] h-full lg:h-auto max-h-[95vh] flex flex-col lg:flex-row bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen */}
              <div className="w-full lg:w-[75%] bg-black flex items-center justify-center p-4 lg:p-8 min-h-[40vh]">
                <img 
                  src={`/${selectedImage.image}`} 
                  alt={selectedImage.title}
                  className="w-full h-full object-contain max-h-[50vh] lg:max-h-[90vh]"
                />
              </div>

              {/* Panel de texto */}
              <div className="w-full lg:w-[25%] p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[45vh] lg:max-h-[95vh]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                <span className="text-[#e63946] text-xs font-mono uppercase tracking-widest mb-4 block">
                  {selectedImage.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  {lang === 'en' ? selectedImage.title : (selectedImage.titleEs || selectedImage.title)}
                </h2>
                <div className="text-gray-300 leading-relaxed font-mono text-sm space-y-4">
                  <p>
                    {lang === 'en' ? selectedImage.descriptionEn : selectedImage.descriptionEs}
                  </p>
                </div>
                
                <div className="mt-auto pt-12">
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest border-t border-white/10 pt-4">
                    {lang === 'en' ? 'Use arrow keys to navigate' : 'Usa las flechas para navegar'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
