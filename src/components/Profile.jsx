import React from 'react';
import { motion } from 'motion/react';

export default function Profile({ lang = 'en' }) {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Profile Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5"
        >
          <div className="aspect-[4/5] relative flex items-center justify-center overflow-hidden">
            <img 
              src="/images/profile.jpg" 
              alt="Santiago Narváez" 
              className="w-full h-full object-cover scale-[1.08] grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
            {/* Difuminado rectangular suave en los bordes */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_4px_#0a0a0a]"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7"
        >
          <span className="text-[#e63946] text-xs font-mono uppercase tracking-[0.2em] mb-6 block">
            {lang === 'en' ? 'Profile' : 'Perfil'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Santiago Narváez</h2>
          
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            {lang === 'en' ? (
              <>
                <p>
                  I'm Santiago Narváez. I come from film and photography — I studied Audiovisual Sciences — and today I work almost exclusively with artificial intelligence.
                </p>
                <p>
                  What I do is direct images and sequences that couldn't exist any other way: fictional portraits, impossible landscapes, documentaries from invented worlds. The process is closer to directing a scene than generating a prompt — there are decisions about framing, light, atmosphere and rhythm before the tool produces anything.
                </p>
                <p>
                  I'm drawn to visual fiction as a form of thinking. Building an image that tells something without needing to explain it. Current project: <em>Chakana Rebelde</em>, a speculative photojournalism piece set in a South America that never was.
                </p>
                <p className="text-gray-500">
                  Based in Margarita Island, Venezuela.
                </p>
              </>
            ) : (
              <>
                <p>
                  Soy Santiago Narváez. Vengo del cine y la fotografía — estudié Ciencias Audiovisuales — y hoy trabajo casi exclusivamente con inteligencia artificial.
                </p>
                <p>
                  Lo que hago es dirigir imágenes y secuencias que no podrían existir de otra forma: retratos ficticios, paisajes imposibles, documentales de mundos inventados. El proceso se parece más a la dirección de una escena que a la generación de un prompt: hay decisiones de encuadre, de luz, de atmósfera y de ritmo antes de que la herramienta produzca algo.
                </p>
                <p>
                  Me interesa la ficción visual como forma de pensamiento. Construir una imagen que cuente algo sin necesidad de explicarlo. Proyecto actual: <em>Chakana Rebelde</em>, un fotorreportaje especulativo en una Sudamérica que nunca fue.
                </p>
                <p className="text-gray-500">
                  Trabajo desde Isla de Margarita, Venezuela.
                </p>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
