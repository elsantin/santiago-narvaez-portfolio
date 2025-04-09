// Espera a que el contenido HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del botón Back to Top ---
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Función para hacer scroll hasta arriba suavemente
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Mostrar/ocultar botón según la posición de scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) { // Mostrar después de 300px de scroll
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }

    // --- Efecto de navegación en scroll ---
    const nav = document.querySelector('.nav-container');
    if (nav) {
        // Añadir/quitar clase 'nav-scrolled' al hacer scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Aplicar clase después de 50px de scroll
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }

    // --- Navegación suave para links internos (anclas #) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Asegurarse de que no sea solo "#" y que el elemento exista
            if (href && href.length > 1) {
                try {
                    const target = document.querySelector(href);
                    if (target) {
                         e.preventDefault(); // Prevenir comportamiento por defecto solo si el target existe
                        const offsetTop = target.offsetTop;
                        // Obtener la altura del header fijo (si existe y está visible) para ajustar el scroll
                        let headerOffset = 0;
                        if (nav && getComputedStyle(nav).position === 'fixed') {
                            headerOffset = nav.offsetHeight;
                        }
                        window.scrollTo({
                            top: offsetTop - headerOffset, // Resta altura del nav
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    console.error("Error finding target for smooth scroll:", href, error);
                }
            }
        });
    });

    // --- Funcionalidad del modal de imagen ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    // let currentIndex = 0; // Movida a global para acceso desde updateLanguage

    /**
     * Abre el modal con la imagen y detalles correspondientes al índice dado.
     * @param {number} index - El índice del item de la galería a mostrar.
     */
    function openModal(index) {
        if (!modal || galleryItems.length === 0) return; // Salir si no hay modal o items

        // Ajustar índice para navegación circular (loop)
        if (index < 0) {
            index = galleryItems.length - 1; // Va al último si está en el primero y va prev
        }
        if (index >= galleryItems.length) {
            index = 0; // Va al primero si está en el último y va next
        }

        currentIndex = index; // Actualiza el índice global
        const item = galleryItems[currentIndex];
        const imgElement = item.querySelector('img');

        if (!imgElement) return; // Salir si el item no tiene imagen

        // Obtener datos del item de la galería
        const imgSrc = imgElement.getAttribute('src');
        const title = item.getAttribute('data-title') || '';
        const category = item.getAttribute('data-category') || '';
        // Obtener descripción según idioma actual
        const currentLang = document.documentElement.lang || 'es';
        const descriptionAttr = currentLang === 'es' ? 'data-description-es' : 'data-description';
        let description = item.getAttribute(descriptionAttr) || item.getAttribute('data-description') || ''; // Fallback a inglés si no hay español


        // Actualizar contenido del modal (si los elementos existen)
        if(modalImg) modalImg.setAttribute('src', imgSrc);
        if(modalTitle) modalTitle.textContent = title;
        if(modalCategory) modalCategory.textContent = category;
        if(modalDescription) modalDescription.textContent = description;

        // Detectar orientación de imagen y aplicar clase 'vertical' al contenedor del contenido
        const tempImg = new Image();
        tempImg.onload = function() {
            const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                 if (aspectRatio < 1) { // Imagen más alta que ancha
                    modalContent.classList.add('vertical');
                } else {
                    modalContent.classList.remove('vertical');
                }
            }
        };
        tempImg.onerror = function() {
            console.error("Error loading image for aspect ratio check:", imgSrc);
        };
        tempImg.src = imgSrc; // Cargar imagen temporal para obtener dimensiones

        // Mostrar modal y bloquear scroll del body
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll del fondo
    }

    // Añadir evento de clic a cada item de la galería para abrir el modal
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openModal(index);
        });
    });

    // Eventos del modal (cerrar, click fuera, navegación prev/next)
    if (modal) {
         // Evento para el botón de cierre
         if(closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Restaurar scroll del body
            });
         }

        // Evento para cerrar haciendo clic fuera del contenido del modal
        modal.addEventListener('click', function(e) {
            // Cerrar si se hace clic directamente en el fondo oscuro (el elemento .modal)
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Evento para el botón 'anterior'
        if(prevBtn) {
            prevBtn.addEventListener('click', function() {
                openModal(currentIndex - 1);
            });
        }

        // Evento para el botón 'siguiente'
        if(nextBtn) {
            nextBtn.addEventListener('click', function() {
                openModal(currentIndex + 1);
            });
        }

        // Navegación con teclado (flechas izquierda/derecha y tecla Escape)
        document.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return; // Solo si el modal está activo

            if (e.key === 'ArrowLeft') {
                openModal(currentIndex - 1); // Navegar a la imagen anterior
            } else if (e.key === 'ArrowRight') {
                openModal(currentIndex + 1); // Navegar a la imagen siguiente
            } else if (e.key === 'Escape') {
                modal.classList.remove('active'); // Cerrar modal con Escape
                document.body.style.overflow = 'auto';
            }
        });
    } // Fin if(modal)


    // --- Manejo de envío de formulario (Placeholder con simulación) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previene el envío real del formulario

            // --- Simulación de envío y validación ---
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('.form-button');

            // Validación simple
            if (nameInput && emailInput && messageInput && nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim()) {

                // Deshabilitar botón y mostrar "Enviando..."
                if(submitButton) {
                    const originalButtonText = submitButton.textContent; // Guardar texto original
                    submitButton.textContent = 'Enviando...'; // Cambiar texto
                    submitButton.disabled = true; // Deshabilitar

                    // Simular espera de red
                    setTimeout(() => {
                        // Mostrar mensaje de éxito (mejor si no es alert)
                        console.log('Formulario enviado (simulado)');
                        // alert('Thank you for your message. I will get back to you soon!');
                        // Podrías añadir un div de mensaje en el HTML y mostrarlo aquí

                        contactForm.reset(); // Limpia el formulario

                        // Restaurar botón
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;

                    }, 1500); // Simular 1.5 segundos de espera
                }

            } else {
                // Mostrar mensaje de error (mejor si no es alert)
                alert('Por favor, completa todos los campos requeridos.');
                // Podrías añadir clases de error a los inputs vacíos
            }
            // --- Fin Simulación ---
        });
    }

}); // Fin DOMContentLoaded principal

// Variable global para el índice del modal (necesaria para actualizar descripción al cambiar idioma)
let currentIndex = 0;

// --- Funcionalidad de cambio de idioma (Fuera del DOMContentLoaded principal para acceso global) ---
const translations = {
    // Claves y traducciones [EN, ES]
    'nav-home': ['Home', 'Inicio'],
    'nav-gallery': ['Gallery', 'Galería'],
    'nav-about': ['Profile', 'Perfil'], // <--- Link del menú ACTUALIZADO
    'nav-contact': ['Contact', 'Contacto'],
    'hero-subtitle': ['Exploring the intersection of imagination<br>and artificial intelligence', 'Explorando la intersección entre imaginación<br>e inteligencia artificial'],
    'hero-btn': ['Discover Works', 'Ver Obras'],
    'section-gallery': ['Gallery', 'Galería'],
    'section-about': ['Profile', 'Perfil'], // Título de la sección
    'section-contact': ['Contact', 'Contacto'],
    'about-title': ['Santiago Narváez', 'Santiago Narváez'], // Título dentro de la sección about
    'about-p1': [
         'As a photographer and visual creator, I explore the frontiers of AI-assisted creation, blending traditional artistic sensibilities with cutting-edge technology to transform unique moments into impactful visual experiences. My work delves into the intersection of human imagination and artificial intelligence, crafting dreamlike landscapes, surreal portraits, and futuristic visions in the liminal space between the real and the imagined.',
         'Como fotógrafo y creador visual, exploro las fronteras de la creación asistida por IA, combinando sensibilidades artísticas tradicionales con tecnología de vanguardia para transformar momentos únicos en experiencias visuales impactantes. Mi trabajo explora la intersección entre la imaginación humana y la inteligencia artificial, creando paisajes oníricos, retratos surrealistas y visiones futuristas en el espacio liminal entre lo real y lo imaginado.'
    ],
     'about-p3': [
         'Drawing inspiration from both natural phenomena and digital abstractions, I strive to create pieces that feel both familiar and otherworldly, inviting viewers to question the boundaries between human creativity and technological innovation.',
         'Inspirándome en fenómenos naturales y abstracciones digitales, me esfuerzo por crear piezas familiares y ajenas, invitando a cuestionar los límites entre creatividad humana e innovación tecnológica.'
    ],
     'about-p4': [
         'Through my portfolio, I invite you to journey through these digital realms – spaces of contemplation, wonder, and possibility that reflect our evolving relationship with technology and the expanding horizons of artistic expression.',
         'A través de mi portafolio, te invito a viajar por estos reinos digitales: espacios de contemplación, asombro y posibilidad que reflejan nuestra relación en evolución con la tecnología y los horizontes en expansión de la expresión artística.'
    ],
    'contact-location': ['Location', 'Ubicación'],
    'contact-email': ['Email', 'Correo Electrónico'], // Usado para título y link
    'contact-social': ['Social Media', 'Redes Sociales'],
    'contact-name': ['Name', 'Nombre'],
    'contact-placeholder-name': ['Your Name', 'Tu Nombre'],
    'contact-email-label': ['Email', 'Correo Electrónico'], // Etiqueta del input email
    'contact-placeholder-email': ['Your Email', 'Tu Correo Electrónico'],
    'contact-subject': ['Subject', 'Asunto'],
    'contact-placeholder-subject': ['Subject', 'Asunto'],
    'contact-message': ['Message', 'Mensaje'],
    'contact-placeholder-message': ['Your Message', 'Tu Mensaje'],
    'contact-send': ['Send Message', 'Enviar Mensaje']
    // Añadir traducciones para los data-title, data-category, data-description-es si se desea
};

/**
 * Actualiza los textos de la página según el idioma seleccionado.
 * @param {string} lang - El código del idioma ('en' o 'es').
 * @param {HTMLElement} languageToggle - El botón que cambia el idioma.
 */
function updateLanguage(lang, languageToggle) {
    localStorage.setItem('language', lang); // Guardar preferencia en localStorage
    document.documentElement.lang = lang; // Actualizar atributo lang del HTML

    // Actualizar textos basados en el atributo data-translate
    Object.keys(translations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(el => {
            const index = lang === 'es' ? 1 : 0;
            const translation = translations[key] ? translations[key][index] : null;
             if (translation !== null) {
                 // Diferenciar entre contenido de texto y atributos como placeholder
                 if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder !== undefined) {
                     // Solo actualiza placeholder si el atributo data-translate coincide con la clave de placeholder
                     if (el.hasAttribute('data-translate') && key === el.getAttribute('data-translate')) {
                        el.placeholder = translation;
                     }
                 } else {
                     // Actualiza contenido para otros elementos si data-translate coincide
                     if (el.hasAttribute('data-translate') && key === el.getAttribute('data-translate')) {
                        el.innerHTML = translation;
                     }
                 }
             }
        });
    });

    // Mostrar/ocultar párrafos específicos de idioma (basado en data-translate-lang)
    document.querySelectorAll('[data-translate-lang]').forEach(el => {
        if (el.getAttribute('data-translate-lang') === lang) {
            el.style.display = ''; // Mostrar párrafo del idioma actual
        } else {
            el.style.display = 'none'; // Ocultar párrafo del otro idioma
        }
    });

    // Actualizar texto del botón de cambio de idioma
    if (languageToggle) {
        languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    // Actualizar descripciones del modal según el idioma (si el modal está activo)
    const modal = document.getElementById('imageModal'); // Referencia al modal
    const modalDescElement = document.getElementById('modalDescription');
    // Asegurarse que currentIndex sea accesible y esté actualizado
    const activeGalleryItem = document.querySelector(`.gallery-item[data-index="${currentIndex}"]`);
    if (modal && modalDescElement && activeGalleryItem && modal.classList.contains('active')) {
         const descriptionAttr = lang === 'es' ? 'data-description-es' : 'data-description';
         let description = activeGalleryItem.getAttribute(descriptionAttr) || activeGalleryItem.getAttribute('data-description') || '';
         modalDescElement.textContent = description;
    }
}


// Añadir listener al botón de idioma (dentro de DOMContentLoaded para asegurar que el botón exista)
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    // Obtener idioma guardado o usar 'es' por defecto
    let currentLang = localStorage.getItem('language') || 'es';

    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            // Cambiar al otro idioma
            const newLang = currentLang === 'en' ? 'es' : 'en';
            currentLang = newLang; // Actualizar idioma actual
            updateLanguage(newLang, languageToggle); // Llamar a la función de actualización
        });

        // Inicializar idioma al cargar la página
        updateLanguage(currentLang, languageToggle);
    }
});
