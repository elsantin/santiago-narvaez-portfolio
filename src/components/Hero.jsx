import { motion } from 'motion/react';

export default function Hero({ lang = 'es' }) {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-between pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Mobile Background Image & Gradient Overlay */}
      <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none">
        <img 
          src="/images/gallery/the_recurring_gesture.jpg" 
          alt="" 
          className="w-full h-full object-cover object-center opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80"></div>
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          <span className="inline-block mb-6 text-sm font-medium tracking-[0.2em] text-[var(--color-brand-accent)] uppercase">
            SANTIAGO NARVÁEZ
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
            {lang === 'en' ? 'Visual Fiction & Synthetic Narrative' : 'Ficción visual y narrativa sintética'}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-[40ch] leading-relaxed">
            {lang === 'en' 
              ? "I create images, sequences and audiovisual projects with artificial intelligence — grounded in photographic training and a cinematic eye."
              : "Creo imágenes, secuencias y proyectos audiovisuales con inteligencia artificial, desde una formación fotográfica y una mirada cinematográfica."}
          </p>
          <motion.a 
            href="#gallery"
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            {lang === 'en' ? 'View Works' : 'Ver Obras'}
            <span className="text-[#e63946]">→</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Desktop Floating Card Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45vw] max-w-[800px]"
      >
        <div className="aspect-[4/5] relative bg-zinc-900 overflow-hidden shadow-2xl group cursor-default">
           <img 
             src="/images/gallery/the_recurring_gesture.jpg" 
             alt="The Recurring Gesture — Santiago Narváez" 
             className="w-full h-full object-cover object-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)] via-transparent to-transparent opacity-80 pointer-events-none"></div>
        </div>
      </motion.div>
    </section>
  )
}
