import React from 'react';
import { motion } from 'motion/react';

export default function Featured({ lang = 'en' }) {
  return (
    <section id="featured" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          {lang === 'en' ? 'Featured Projects' : 'Proyectos Destacados'}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Chakana Rebelde */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <a href="https://chakana-rebelde.vercel.app/" target="_blank" rel="noopener noreferrer" className="block aspect-[16/9] bg-zinc-900 mb-6 overflow-hidden relative">
            <img 
              src="/images/chakana-thumb.jpg" 
              alt="Chakana Rebelde"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 pointer-events-none">
              <span className="bg-[#e63946] text-white text-[10px] font-mono tracking-widest px-3 py-1 uppercase">
                {lang === 'en' ? 'AI Photojournalism' : 'Fotoreportaje AI'}
              </span>
            </div>
          </a>
          <h3 className="text-2xl font-bold mb-3">Chakana Rebelde</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            {lang === 'en' 
              ? "A speculative documentary exploring the intersection between Andean cosmogony and cyberpunk rebellion in a dystopian South America."
              : "Un documental especulativo que explora la intersección entre la cosmogonía andina y la rebelión cyberpunk en una Sudamérica distópica."}
          </p>
          <a 
            href="https://chakana-rebelde.vercel.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-xs font-mono tracking-widest hover:text-[#e63946] transition-colors"
          >
            {lang === 'en' ? 'VISIT PROJECT' : 'VISITAR PROYECTO'} <span className="text-[#e63946]">→</span>
          </a>
        </motion.div>

        {/* YouTube Video */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative"
        >
          <div className="aspect-[16/9] bg-zinc-900 mb-6 relative overflow-hidden">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/ffyYAaFTrkk?autoplay=0&controls=1&mute=0" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <div className="absolute top-4 right-4 pointer-events-none">
              <span className="bg-[#e63946] text-white text-[10px] font-mono tracking-widest px-3 py-1 uppercase">
                {lang === 'en' ? 'Music Video' : 'Video Musical'}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Xylos - Cortometraje</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            {lang === 'en'
              ? "Direction and visual generation for 'Xylos'. Exploring synthetic textures and procedural rhythms."
              : "Dirección y generación visual para 'Xylos'. Explorando texturas sintéticas y ritmos procedurales."}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
