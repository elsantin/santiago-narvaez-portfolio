import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from '@phosphor-icons/react';

export default function Contact({ lang = 'en' }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('santiago.narvaez.84@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-center">
          {lang === 'en' ? 'Contact' : 'Contacto'}
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Available for visual direction, audiovisual projects and narrative concept development.'
            : 'Disponible para dirección visual, proyectos audiovisuales y desarrollo de concepto narrativo.'}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Info Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="mb-12">
             <h4 className="text-[#e63946] text-xs font-mono uppercase tracking-widest mb-2">
               {lang === 'en' ? 'Location' : 'Ubicación'}
             </h4>
             <p className="text-xl">
               {lang === 'en' ? 'Margarita Island, Venezuela' : 'Isla de Margarita, Venezuela'}
             </p>
          </div>

          <div className="mb-12">
             <h4 className="text-[#e63946] text-xs font-mono uppercase tracking-widest mb-2">Email</h4>
             <div className="flex items-center gap-4">
               <p className="text-xl">santiago.narvaez.84@gmail.com</p>
               <button 
                 onClick={copyEmail}
                 className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer"
                 title={lang === 'en' ? 'Copy email' : 'Copiar email'}
               >
                 {copied ? <Check size={18} weight="bold" className="text-green-400" /> : <Copy size={18} />}
               </button>
             </div>
          </div>

          <div className="mb-12">
             <h4 className="text-[#e63946] text-xs font-mono uppercase tracking-widest mb-2">
               {lang === 'en' ? 'Social Media' : 'Redes Sociales'}
             </h4>
             <div className="flex gap-6">
               <a href="https://linkedin.com/in/santiago-narváez-ab8024213/" target="_blank" rel="noreferrer" className="text-xl hover:text-[#e63946] transition-colors">
                 LinkedIn
               </a>
             </div>
          </div>

          <div>
             <h4 className="text-[#e63946] text-xs font-mono uppercase tracking-widest mb-2">
               {lang === 'en' ? 'Freelance Projects' : 'Proyectos Freelance'}
             </h4>
             <a href="https://contra.com/santiago_narvaez_84" target="_blank" rel="noreferrer" className="text-xl text-gray-300 hover:text-[#e63946] transition-colors">
               {lang === 'en' ? 'Contra Profile' : 'Perfil en Contra'}
             </a>
          </div>
        </motion.div>

        {/* Columna Derecha: Formulario Minimalista */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900/50 p-8 rounded-sm border border-white/5"
        >
          <form className="flex flex-col gap-6" action="mailto:santiago.narvaez.84@gmail.com" method="post" encType="text/plain">
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                {lang === 'en' ? 'Name' : 'Nombre'}
              </label>
              <input 
                type="text" 
                name="name" 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#e63946] transition-colors"
                placeholder={lang === 'en' ? 'Your Name' : 'Tu Nombre'}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">Email</label>
              <input 
                type="email" 
                name="email" 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#e63946] transition-colors"
                placeholder={lang === 'en' ? 'Your Email' : 'Tu Email'}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                {lang === 'en' ? 'Subject' : 'Asunto'}
              </label>
              <input 
                type="text" 
                name="subject" 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#e63946] transition-colors"
                placeholder={lang === 'en' ? 'Subject' : 'Asunto'}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                {lang === 'en' ? 'Message' : 'Mensaje'}
              </label>
              <textarea 
                name="message" 
                rows="4" 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#e63946] transition-colors resize-none"
                placeholder={lang === 'en' ? 'Your Message' : 'Tu Mensaje'}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="mt-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-8 hover:bg-gray-200 transition-colors w-fit"
            >
              {lang === 'en' ? 'Send Message' : 'Enviar Mensaje'}
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
